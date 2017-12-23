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

// show popup
function showPopup () {
  if (!selectionText) {
    return
  }

  const container = document.createElement('div')
  const list = document.createElement('ul')
  container.className = className
  container.style.left = position.left
  container.style.top = position.top

  Object.keys(options).forEach(key => {
    if (options[key].enabled) {
      options[key].items.forEach(item => {
        if (item.url) {
          list.innerHTML += `<li>
          <a href='${item.url.replace('%s', selectionText)}' target='_blank'>
            ${item.name}
          </a>
        </li>`
        } else {
          // TODO: menu items
        }
      })
    }
  })

  container.appendChild(list)
  document.body.appendChild(container)
}

// add mouseup event to check selection to document
function addEventHandlers () {
  document.onmouseup = (e) => {
    const selection = window.getSelection()

    if (selection.type === 'Range') {
      selectionText = selection.focusNode.nodeValue
        .substring(selection.baseOffset, selection.focusOffset)
        .trim()

      position.left = `${e.pageX  }px`
      position.top = `${e.pageY + 14  }px`

      showPopup()
    } else {
      hidePopup()
    }
  }

  document.onmousedown = (e) => {
    console.log(e)
  }
}

// Get options from background script
function getOptions () {
  chrome.runtime.sendMessage({
    type: 'options'
  }, obj => {
    options = obj
    addEventHandlers()
  })
}

// Start process
getOptions()
