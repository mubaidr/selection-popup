// Default cofigurations
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
          url: 'http://google.com/search?q=%s'
        },
        {
          name: 'Youtube',
          url: 'https://www.youtube.com/results?search_query=%s'
        },
        {
          name: 'Stackoverflow',
          url: 'http://stackoverflow.com/search?q=%s'
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

// Oninstall handler
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    chrome.storage.sync.set({ options }, chrome.runtime.openOptionsPage)
  }
})

// Persistant options
chrome.storage.sync.get('options', key => {
  if (key.options && key.options.searchEngines && key.options.menu) {
    // eslint-disable-next-line
    options = key.options
  }
})

// Share settings with content script
chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.type === 'tab') {
    chrome.tabs.create({
      url: request.url,
      active: !options.openTabInBackground
    })
  } else if (request.type === 'style') {
    chrome.tabs.insertCSS(sender.tab.id, {
      code: request.style,
      allFrames: true
    })
  }
})
