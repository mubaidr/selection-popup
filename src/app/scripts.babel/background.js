'use strict'

// Oninstall handler
chrome.runtime.onInstalled.addListener(details => {})

// Default cofigurations
var defaults = {
  searchEngines: {
    enabled: true,
    items: [
      {
        name: 'Duck Duck Go',
        url: 'https://duckduckgo.com/?q=%s&t=hf&ia=web'
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
        copy: {
          enabled: true
        }
      }
    ]
  }
}

// User configurations
var options = null

// Persistant options
chrome.storage.sync.get('options', key => {
  if (key.options && key.options.searchEngines && key.options.menu) {
    options = key.options
  } else {
    options = defaults
    chrome.storage.sync.set({ options: options })
  }
})

// Share settings with content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'options') {
    sendResponse(options)
  }
})
