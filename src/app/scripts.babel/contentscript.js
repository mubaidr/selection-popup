'use strict'

// class for styling
const class = 'selection-popup'

// Get options from background script
getOptions()
function getOptions() {
  chrome.runtime.sendMessage(
    {
      type: 'options'
    },
    options => {
      prepareLayout(options)
    }
  )
}

// Prepare layout for popup
function prepareLayout(options) {
  let container = document.createElement('div')
  container.innerHTML = `<div class='${class}-container'></div>`
  document.appendChild(container)

  prepareMenu(container)
  prepareSearchEngines(container)
  addEventHandlers()
}

// add menu objects to popup
function prepareMenu() {}

// add search engines objects to popup
function prepareSearchEngines() {}

// add events to document
function addEventHandlers() {}
