import './index.css'

// class for styling
const className = '__selection-popup-container__'
let selectionText = ''
let options = null

// hide popup
function hidePopup () {
  document.getElementsByClassName(className)[0].style.display = 'none'
}

// hide popup
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

  if (isCommand === 'true') {
    switch (action) {
      case 'gtwa':
        chrome.runtime.sendMessage({
          type: 'tab',
          url: selectionText,
          active: !options.openTabInBackground
        })
        break
      case 'copy':
      default:
        document.execCommand('Copy')
        break
    }
  } else {
    chrome.runtime.sendMessage({
      type: 'tab',
      url: action.replace('%s', selectionText),
      active: !options.openTabInBackground
    })
  }
}

// check if selected text is a url
function validURL () {
  // eslint-disable-next-line
  const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  return regexp.test(selectionText)
}

// show popup
function addPopup () {
  const { list } = options
  const container = document.createElement('div')
  const listContainer = document.createElement('ul')
  const defaultEngine = list.searchEngines.items.length === 1
  const propList = defaultEngine
    ? ['searchEngines', 'menu']
    : ['menu', 'searchEngines']

  if (!(list.menu.enabled || list.searchEngines.enabled)) return

  propList.forEach(key => {
    if (list[key].enabled) {
      list[key].items.forEach((item, index) => {
        if (item.isCommand && !item.enabled) return
        if (item.isCommand && item.command === 'gtwa' && !validURL()) return

        const li = document.createElement('li')
        li.className = index === 0 ? 'first-item' : ''
        li.innerText = defaultEngine && !item.isCommand ? 'Search' : item.name
        li.setAttribute('data-is-command', !!item.isCommand)
        li.setAttribute('data-action', item.isCommand ? item.command : item.url)
        li.onclick = clickHandler
        listContainer.appendChild(li)
      })
    }
  })

  listContainer.className = defaultEngine ? 'single-liner' : ''
  container.className = className
  container.style.display = 'none'
  container.appendChild(listContainer)
  document.body.appendChild(container)
}

// add mouseup event to check selection to document
function setup () {
  // Get options
  chrome.storage.sync.get('options', key => {
    // eslint-disable-next-line
    options = key.options

    // add popup markup
    addPopup()

    // inject custom css
    if (options.enableAdvanceSettings && options.style.trim().length > 0) {
      chrome.runtime.sendMessage({
        type: 'style',
        style: options.style
      })
    }
  })

  // add text selection event
  document.onmouseup = e => {
    hidePopup()

    const selection = window.getSelection()
    if (selection.type === 'Range' && selection.focusNode.nodeValue) {
      selectionText = selection.focusNode.nodeValue
        .substring(selection.baseOffset, selection.focusOffset)
        .trim()

      if (selectionText) {
        showPopup({
          left: `${e.pageX}px`,
          top: `${e.pageY + 14}px`
        })
      }
    }
  }
}

setup()
