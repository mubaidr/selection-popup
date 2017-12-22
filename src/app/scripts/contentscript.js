// class for styling
const className = 'selection-popup'

// add events to document
function addEventHandlers () {
  // TODO: add listners for text selection
}

// Prepare layout for popup
function prepareLayout (options) {
  const container = document.createElement('div')
  const list = document.createElement('ul')
  container.className = `${className}-container`
  container.appendChild(list)
  document.body.appendChild(container)

  Object.keys(options).forEach(key => {
    if (options[key].enabled) {
      options[key].items.forEach(item => {
        list.innerHTML += `<li>
          <a href=${item.url}>
            ${item.name}
          </a>
        </li>`
      })
    }
  })
  // TODO: set position of the layout
  /* Debug start */
  container.className += ' active'
  /* Debug end */

  addEventHandlers()
}

// Get options from background script
function getOptions () {
  chrome.runtime.sendMessage(
    {
      type: 'options'
    },
    options => {
      prepareLayout(options)
    }
  )
}

// TODO: Get text selection
getOptions()
