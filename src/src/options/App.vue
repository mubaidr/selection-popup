<template>
  <div>
    <fieldset>
      <legend>General</legend>
    </fieldset>

    <fieldset>
      <legend>Menu</legend>
    </fieldset>

    <fieldset>
      <legend>Search</legend>
    </fieldset>

    <pre>{{$data}}</pre>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        options: null
      }
    },
    created () {
      // Get options
      chrome.runtime.sendMessage(
        {
          type: 'options'
        },
        obj => {
          this.options = obj
        }
      )
    }
  }
</script>

<style lang="scss" scoped>
  p {
    font-size: 20px;
  }
</style>
