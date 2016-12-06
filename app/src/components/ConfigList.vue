<template>
  <div class="app-config-list flex flex-column">
    <div class="list-wrapper flex-1">
      <ul>
        <li v-for="config in configs" @click="select(config)" :class="{selected:selected===config}">
          {{config.remark||config.host}}（{{config.host}}:{{config.port}}）
        </li>
      </ul>
    </div>
    <div class="buttons flex">
      <button type="button" class="flex-1" @click="add">添加</button>
      <button type="button" class="flex-1" @click="remove">删除</button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    configs: Array
  },
  data () {
    return {
      selected: undefined
    }
  },
  methods: {
    getSelected () {
      return this.selected
    },
    select (config) {
      this.selected = config
      console.log(config)
    },
    add () {
      this.selected = undefined
      this.$emit('add')
    },
    remove () {
      if (this.selected) {
        this.$emit('remove', this.selected)
        this.selected = undefined
      }
    }
  }
}
</script>
<style lang="stylus">
.app-config-list
  width 15rem
  padding 1rem
  .list-wrapper
    padding 1px
    border 1px solid #888
    margin-bottom 4px
    background #fff
    > ul
      margin 0
      padding 0
      list-style none
      > li
        display block
        padding 2px 1px
        text-align left
        cursor default
        -webkit-user-select none
        &.selected
          background rgb(51, 153, 255)
          color #fff
  > .buttons
    button
      margin 2px
</style>
