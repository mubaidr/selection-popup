// eslint-disable-next-line
const app = new Vue({
  el: '#app',
  data: {
    options: null
  },
  created () {
    // Get options
    chrome.runtime.sendMessage(
      {
        type: 'options'
      },
      obj => {
        console.log(this)
        this.options = obj
      }
    )
  },
  mounted () {}
})

// TODO enable vue-loader in gulp
