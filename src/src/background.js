// Default configurations
let options = {
  list: {
    searchEngines: {
      // display search engines
      enabled: true,
      // list of search engines
      // %s will be replaced by selected text in content script
      items: [
        {
          name: 'Duck Duck Go',
          url: 'https://duckduckgo.com/?q=%s',
        },
        {
          name: 'Google',
          url: 'https://google.com/search?q=%s',
        },
        {
          name: 'Youtube',
          url: 'https://www.youtube.com/results?search_query=%s',
        },
        {
          name: 'Stack Overflow',
          url: 'https://stackoverflow.com/search?q=%s',
        },
        {
          name: 'IMDB',
          url: 'https://www.imdb.com/find?ref_=nv_sr_fn&q=%s&s=all',
        },
        {
          name: 'Wikipedia',
          url: 'https://en.wikipedia.org/wiki/%s',
        },
      ],
    },
    menu: {
      // display commands in popup
      enabled: true,
      items: [
        {
          // copy to clipboard
          name: 'Copy',
          enabled: true,
          command: 'copy',
          isCommand: true,
        },
      ],
    },
  },
  // open all tabs in background
  openTabInBackground: true,
  // open new tab in background
  openTabNextToActive: true,
  // enable advance settings like custom styles for popup
  enableAdvanceSettings: false,
  // custom styles for popup
  style: `.__selection-popup-container__ {
      /* main container*/
      /* you should only need to customize background-color*/
    }

    .__selection-popup-container__ ul li{
      /* each item in popup menu*/
    }

    .__selection-popup-container__ ul li:hover {
      /* item hover state */
    }

    .__selection-popup-container__ ul li:active {
      /* item active state */
    }

    /* for other possibilities or live testing you can inspect the popup */`,
};

// OnInstall handler
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    // set default options
    chrome.storage.sync.set({ options }, chrome.runtime.openOptionsPage);
  } else {
    // merge new options with user options
    chrome.storage.sync.get('options', key => {
      options = Object.assign({}, options, key.options);

      // remove obselete option param
      options.list.menu.items = [options.list.menu.items[0]];

      // save updated options
      chrome.storage.sync.set({ options });
    });
  }
});

// Share settings with content script
chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.type === 'tab') {
    if (options.openTabNextToActive) {
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        tabs => {
          const { index } = tabs[0];

          // open new tab for search or gtwa command
          chrome.tabs.create({
            index: index + 1,
            url: request.url,
            active: request.active,
          });
        }
      );
    } else {
      // open new tab for search or gtwa command
      chrome.tabs.create({ url: request.url, active: request.active });
    }
  } else if (request.type === 'style') {
    // insert css into tab
    chrome.tabs.insertCSS(sender.tab.id, {
      code: request.style,
      allFrames: true,
    });
  } else if (request.type === 'options') {
    // eslint-disable-next-line
    options = request.options;
  }
});
