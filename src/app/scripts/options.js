let options = null

console.log(Vue)

// Get options
chrome.runtime.sendMessage(
  {
    type: 'options'
  },
  obj => {
    options = obj
  }
)
