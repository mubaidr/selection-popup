import './index.css'

// class for styling
const className = 'selection-popup-container'
let selectionText = ''
let options = null

// hide popup
function hidePopup () {
  const popups = document.getElementsByClassName(className)
  for (let i = 0; i < popups.length; i += 1) {
    const popup = popups[i]
    popup.parentNode.removeChild(popup)
  }
}

// handle click on menu item
function clickHandler (e) {
  const { isCommand, action } = e.target.dataset

  if (isCommand === 'true') {
    switch (action) {
      case 'gtwa':
        chrome.runtime.sendMessage({
          type: 'tab',
          url: selectionText
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
      url: action
    })
  }

  hidePopup()
}

// check if selected text is a url
function validURL () {
  // eslint-disable-next-line
  const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  return regexp.test(selectionText)
}

// show popup
function showPopup (position) {
  const { list } = options
  const container = document.createElement('div')
  const listContainer = document.createElement('ul')
  const defaultEngine = list.searchEngines.items.length === 1

  container.className = className
  container.style.left = position.left
  container.style.top = position.top

  if (!(list.menu.enabled || list.searchEngines.enabled)) return

  ;['searchEngines', 'menu'].forEach(key => {
    if (list[key].enabled) {
      list[key].items.forEach((item, index) => {
        if (item.isCommand && !item.enabled) return
        if (item.isCommand && item.command === 'gtwa' && !validURL()) return

        const li = document.createElement('li')
        li.className = index === 0 ? 'first-item' : ''
        li.innerText = defaultEngine && !item.isCommand ? 'Search' : item.name
        li.setAttribute('data-is-command', !!item.isCommand)
        li.setAttribute(
          'data-action',
          item.isCommand ? item.command : item.url.replace('%s', selectionText)
        )
        li.onclick = clickHandler
        listContainer.appendChild(li)
      })
    }
  })

  listContainer.className = defaultEngine ? 'single-liner' : ''

  container.appendChild(listContainer)
  document.body.appendChild(container)
}

// add mouseup event to check selection to document
function setup () {
  // Get options
  chrome.storage.sync.get('options', key => {
    // eslint-disable-next-line
    options = key.options
  })

  // add text selection event
  document.onmouseup = e => {
    if (e.target.dataset.action) return

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
