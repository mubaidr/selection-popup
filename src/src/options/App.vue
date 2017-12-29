<template>
  <div>
    <template v-if="options">
      <div class="control">
        <input type="checkbox" v-model="options.list.searchEngines.enabled"> Enable Search Engines
      </div>
      <fieldset v-if="options.list.searchEngines.enabled">
        <legend>Search Engines</legend>
        <p>
          Add search engines and change the order. <br/>
          Use <strong>%s</strong> in the search url to represent <strong>selected text.</strong>
        </p>
        <draggable v-model="options.list.searchEngines.items" :options="{draggable:'.item'}" handle=".my-handle">
          <div v-for="(item, index) in options.list.searchEngines.items" :key="item.url" class="item">
            <div class="my-handle" title="Drag to Sort"> :::: </div>
            <input type="text" v-model="item.name" class="name" placeholder="Name" title="Name"/>
            <input type="text" v-model="item.url" class="url" placeholder="URL" title="URL"/>
            <div class="remove" title="Remove Search Engine" @click="removeItem(index)"> x </div>
          </div>
        </draggable>
        <br/>
        <button @click="addItem">Add Search Engine</button>
      </fieldset>
      <div class="control">
        <input type="checkbox" v-model="options.list.menu.enabled"> Enable Commands
      </div>
      <fieldset v-if="options.list.menu.enabled">
        <legend>Commands</legend>
        <p>Change the order of commands. <br/>Go to web address command is only visible when selected address contains a valid url.</p>
        <draggable v-model="options.list.menu.items" :options="{draggable:'.item'}" :handle="'.my-handle'">
          <div v-for="item in options.list.menu.items" :key="item.command" class="item">
            <div class="my-handle" title="Drag to Sort"> :::: </div>
            {{item.name}}
            <div class="group">
              <input type="checkbox" v-model="item.enabled"> Enabled
            </div>
          </div>
        </draggable>
      </fieldset>
      <div class="control">
        <input type="checkbox" v-model="options.openTabInBackground"> Open Tabs In Background
      </div>
    </template>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'

  export default {
    components: {
      draggable
    },
    data () {
      return {
        options: null,
        _timer: null
      }
    },
    watch: {
      options: {
        handler () {
          window.clearTimeout(this._timer)
          this._timer = window.setTimeout(this.setOptions, 250)
        },
        deep: true
      }
    },
    created () {
      this.getOptions()
    },
    methods: {
      addItem () {
        this.options.list.searchEngines.items.push({
          name: '',
          url: ''
        })
      },
      removeItem (index) {
        this.options.list.searchEngines.items.splice(index, 1)
      },
      getOptions () {
        chrome.storage.sync.get('options', key => {
          this.options = key.options
        })
      },
      setOptions () {
        chrome.storage.sync.set({ options: this.options })
      }
    }
  }
</script>

<style lang="scss" scoped>
  fieldset {
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  .control {
    margin: 15px 0;
  }

  .item {
    margin: 10px 0;
  }

  .item .group {
    float: right;
  }

  .my-handle {
    width: 5%;
    padding: 5px 0;
    display: inline-block;
    cursor: move;
    cursor: -webkit-grabbing;
  }

  .name {
    width: 25%;
    display: inline-block;
  }

  .url {
    width: 60%;
    display: inline-block;
  }

  .remove {
    padding: 5px 0;
    width: 5%;
    display: inline-block;
    text-align: center;
    cursor: pointer;
  }
</style>
