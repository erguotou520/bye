<template>
  <div class="app-config-list">
    <div class="list-wrapper">
      <ul>
        <li v-for="config in configs" @click="selected=config" :class="{selected:selected===config}">
          {{config.remark}}（{{config.server}}:{{config.port}}）
        </li>
      </ul>
    </div>
    <div class="buttons">
      <button type="button">添加</button>
      <button type="button">删除</button>
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
  width 200px
  > ul
    margin 0
    padding 0
    list-style none
    > li
      color normal
      &.selected
        background-color blur
</style>
