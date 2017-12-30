// Default configurations
let options = {
  list: {
    searchEngines: {
      enabled: true,
      items: [
        {
          name: 'Duck Duck Go',
          url: 'https://duckduckgo.com/?q=%s'
        },
        {
          name: 'Google',
          url: 'https://google.com/search?q=%s'
        },
        {
          name: 'Youtube',
          url: 'https://www.youtube.com/results?search_query=%s'
        },
        {
          name: 'Stack Overflow',
          url: 'https://stackoverflow.com/search?q=%s'
        },
        {
          name: 'IMDB',
          url: 'https://www.imdb.com/find?ref_=nv_sr_fn&q=%s&s=all'
        },
        {
          name: 'Wikipedia',
          url: 'https://en.wikipedia.org/wiki/%s'
        }
      ]
    },
    menu: {
      enabled: true,
      items: [
        {
          name: 'Copy',
          enabled: true,
          command: 'copy',
          isCommand: true
        },
        {
          name: 'Go to Web Address',
          enabled: true,
          command: 'gtwa',
          isCommand: true
        }
      ]
    }
  },
  openTabInBackground: true,
  enableAdvanceSettings: false,
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

    /* for other possibilities or live testing you can inspect the popup */`
}

// OnInstall handler
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    chrome.storage.sync.set({ options }, chrome.runtime.openOptionsPage)
  } else {
    // merge new options
    chrome.storage.sync.get('options', key => {
      options = Object.assign({}, options, key.options)

      // save updated options
      chrome.storage.sync.set({ options })
    })
  }
})

// Share settings with content script
chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.type === 'tab') {
    chrome.tabs.create({
      url: request.url,
      active: request.active
    })
  } else if (request.type === 'style') {
    chrome.tabs.insertCSS(sender.tab.id, {
      code: request.style,
      allFrames: true
    })
  }
})
