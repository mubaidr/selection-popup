// Default cofigurations
let options = {
  list: {
    menu: {
      enabled: true,
      items: [
        {
          name: 'Copy',
          enabled: true,
          command: 'copy',
          isCommand: true
        }
      ]
    },
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
    }
  },
  openTabInBackground: true
}

// Oninstall handler
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    chrome.storage.sync.set({ options })
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
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'options') {
    sendResponse(options)
  } else if (request.type === 'tab') {
    chrome.tabs.create({
      url: request.url,
      active: !options.openTabInBackground
    })
  }
})
