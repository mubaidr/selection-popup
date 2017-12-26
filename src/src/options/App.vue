<template>
  <div>
    <template v-if="options">
      <div class="control">
        <input type="checkbox" v-model="options.list.menu.enabled"> Enable Copy Command
      </div>
      <div class="control">
        <input type="checkbox" v-model="options.list.searchEngines.enabled"> Enable Search Engines
      </div>
      <fieldset v-if="options.list.searchEngines.enabled">
        <legend>Search Engines</legend>
        <div class="control">
          <input type="checkbox" v-model="options.openTabInBackground"> Open Search Tabs In Background
        </div>
        <p>
          Add search engines and change the order. <br/>
          Use <strong>%s</strong> in the search url to represent <strong>selected text.</strong>
        </p>
        <draggable v-model="options.list.searchEngines.items" :options="{draggable:'.item'}" handle="handle">
          <div v-for="(item, index) in options.list.searchEngines.items" :key="item.url" class="item">
            <div class="handle" title="Drag to Sort"> :::: </div>
            <input type="text" v-model="item.name" class="name" placeholder="Name" title="Name"/>
            <input type="text" v-model="item.url" class="url" placeholder="URL" title="URL"/>
            <div class="remove" title="Remove Search Engine" @click="removeItem(index)"> x </div>
          </div>
        </draggable>
        <br/>
        <button @click="addItem">Add Search Engine</button>
      </fieldset>
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
        options: null
      }
    },
    watch: {
      options: {
        handler () {
          this.setOptions()
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
  .control {
    margin: 15px 0;
  }

  .item {
    margin: 10px 0;
  }

  .handle {
    width: 5%;
    padding: 5px 0;
    display: inline-block;
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
  }
</style>
