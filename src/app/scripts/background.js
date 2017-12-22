// Oninstall handler
chrome.runtime.onInstalled.addListener(details => {
  console.log(details)
})

// Default cofigurations
const defaults = {
  menu: {
    enabled: true,
    items: [
      {
        copy: {
          enabled: true
        }
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
}

// User configurations
let options = defaults

// Persistant options
chrome.storage.sync.get('options', key => {
  if (key.options && key.options.searchEngines && key.options.menu) {
    // eslint-disable-next-line
    options = key.options
  } else {
    chrome.storage.sync.set({ options })
  }
})

// Share settings with content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'options') {
    sendResponse(options)
  }
})
