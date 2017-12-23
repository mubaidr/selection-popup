// class for styling
const className = 'selection-popup-container'
let selectionText = ''
let options = null
// eslint-disable-next-line
let position = {
  left: 0,
  top: 0
}

// Get options
chrome.runtime.sendMessage(
  {
    type: 'options'
  },
  obj => {
    options = obj
  }
)

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

// show popup
function showPopup () {
  const { list } = options
  const container = document.createElement('div')
  const listContainer = document.createElement('ul')
  container.className = className
  container.style.left = position.left
  container.style.top = position.top

  Object.keys(list).forEach(key => {
    if (list[key].enabled) {
      list[key].items.forEach(item => {
        const li = document.createElement('li')
        li.onclick = clickHandler
        li.innerText = item.name
        li.setAttribute('data-is-command', !!item.isCommand)
        li.setAttribute(
          'data-action',
          item.isCommand ? item.command : item.url.replace('%s', selectionText)
        )
        li.onclick = clickHandler
        listContainer.appendChild(li)
      })
    }

    listContainer.appendChild(document.createElement('hr'))
  })

  container.appendChild(listContainer)
  document.body.appendChild(container)
}

// add mouseup event to check selection to document
function addEventHandlers () {
  document.onmouseup = e => {
    if (e.target.dataset.action) return

    const selection = window.getSelection()
    if (selection.type === 'Range' && selection.focusNode.nodeValue) {
      selectionText = selection.focusNode.nodeValue
        .substring(selection.baseOffset, selection.focusOffset)
        .trim()

      if (!selectionText) {
        hidePopup()
        return
      }

      position.left = `${e.pageX}px`
      position.top = `${e.pageY + 14}px`
      showPopup()
    } else {
      hidePopup()
    }
  }
}

addEventHandlers()
