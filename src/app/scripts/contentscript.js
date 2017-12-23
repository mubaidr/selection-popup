// class for styling
const className = 'selection-popup-container'
let selectionText = ''
let options = null
// eslint-disable-next-line
let position = {
  left: 0,
  top: 0
}

// hide popup
function hidePopup () {
  const popups = document.getElementsByClassName(className)
  for (let i = 0; i < popups.length; i += 1) {
    const popup = popups[i]
    popup.parentNode.removeChild(popup)
  }
}

function clickHandler (e) {
  hidePopup()

  const { isCommand, action } = e.target.dataset
  if (isCommand) {
    console.log(`Action: ${action}`)
  } else {
    console.log(`Action: ${action}`)
  }
}

// show popup
function showPopup () {
  const container = document.createElement('div')
  const list = document.createElement('ul')
  container.className = className
  container.style.left = position.left
  container.style.top = position.top

  Object.keys(options).forEach(key => {
    if (options[key].enabled) {
      options[key].items.forEach(item => {
        const li = document.createElement('li')
        li.onclick = clickHandler
        li.innerText = item.name
        li.setAttribute('data-is-command', !!item.isCommand)
        li.setAttribute(
          'data-action',
          item.isCommand ? item.command : item.url.replace('%s', selectionText)
        )
        list.appendChild(li)
        li.onclick = clickHandler
      })
    }

    list.appendChild(document.createElement('hr'))
  })

  container.appendChild(list)
  document.body.appendChild(container)
}

// add mouseup event to check selection to document
function addEventHandlers () {
  document.onmouseup = e => {
    if (e.target.dataset.action) return

    const selection = window.getSelection()
    if (selection.type === 'Range') {
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

// Get options from background script
function getOptions () {
  chrome.runtime.sendMessage(
    {
      type: 'options'
    },
    obj => {
      options = obj
    }
  )
}

// Start process
getOptions()
addEventHandlers()
