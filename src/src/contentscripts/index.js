import './index.css'

// class for styling
const className = '__selection-popup-container__'
let selectionText = ''
let options = null

// hide popup
function hidePopup () {
  document.getElementsByClassName(className)[0].style.display = 'none'
}

// show popup at selection position
function showPopup (position) {
  const popup = document.getElementsByClassName(className)[0]
  popup.style.left = position.left
  popup.style.top = position.top
  popup.style.display = 'block'
}

// handle click on menu item
function clickHandler (e) {
  hidePopup()

  const { isCommand, action } = e.target.dataset
  if (isCommand === 'false') {
    chrome.runtime.sendMessage({
      type: 'tab',
      url: action.replace('%s', selectionText),
      active: !options.openTabInBackground
    })
  } else if (action === 'gtwa') {
    chrome.runtime.sendMessage({
      type: 'tab',
      url: selectionText,
      active: !options.openTabInBackground
    })
  } else {
    document.execCommand('Copy')
  }
}

// check if selected text is a url
function validURL () {
  // eslint-disable-next-line
  const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  return regexp.test(selectionText)
}

// add popup to the page, we will only toggle display and postion later
function addPopup () {
  const container = document.createElement('div')
  const listContainer = document.createElement('ul')
  const types = Object.keys(options.list)
  const defaultEngine = options.list.searchEngines.items.length === 1

  if (defaultEngine) {
    // we need to change order of list items, search option will be displayed first
    types.reverse()
    listContainer.className = 'single-liner'
  }

  types.forEach(key => {
    if (!options.list[key].enabled) return

    options.list[key].items.forEach(item => {
      const li = document.createElement('li')
      const cmd = !!item.isCommand
      let action

      if (cmd) {
        if (!item.enabled) return
        if (item.command === 'gtwa' && !validURL()) return
        action = item.command
        li.innerText = item.name
      } else {
        action = item.url
        li.innerText = defaultEngine ? 'Search' : item.name
      }

      // add data to item data attributes
      li.setAttribute('data-is-command', cmd)
      li.setAttribute('data-action', action)
      li.onclick = clickHandler
      listContainer.appendChild(li)
    })
  })

  container.className = className
  container.style.display = 'none'
  container.appendChild(listContainer)
  document.body.appendChild(container)
}

// check if popup should be displayed or skipped
function isPopupRequired () {
  return (
    selectionText &&
    (options.list.menu.enabled || options.list.searchEngines.enabled)
  )
}

// detect text selection
function mouseUpHandler (e) {
  hidePopup()

  const selection = window.getSelection()
  if (selection.type === 'Range') {
    selectionText = (selection.focusNode.nodeValue || '')
      .substring(selection.baseOffset, selection.focusOffset)
      .trim()

    if (isPopupRequired()) {
      showPopup({
        left: `${e.pageX}px`,
        top: `${e.pageY + 14}px`
      })
    }
  }
}

// add mouseup event to check selection to document
function setup () {
  // Get options
  chrome.storage.sync.get('options', key => {
    // eslint-disable-next-line
    options = key.options

    // inject custom css
    if (options.enableAdvanceSettings) {
      chrome.runtime.sendMessage({
        type: 'style',
        style: options.style
      })
    }

    // add popup markup
    addPopup()
  })

  // add text selection event
  document.onmouseup = mouseUpHandler
}

// prepare popup and add event handlers
setup()
