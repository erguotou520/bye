<template>
  <div class="app-config-list flex flex-column">
    <div class="list-wrapper flex-1">
      <ul>
        <li v-for="config in configs" @click="selected=config" :class="{selected:selected===config}">
          {{config.remark}}（{{config.server}}:{{config.port}}）
        </li>
      </ul>
    </div>
    <div class="buttons flex">
      <button type="button" class="flex-1">添加</button>
      <button type="button" class="flex-1">删除</button>
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
    add () {
      this.$emit('add')
    },
    remove (config) {
      this.$emit('remove', config)
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
        color normal
        &.selected
          background-color blur
  > .buttons
    button
      margin 2px
</style>
