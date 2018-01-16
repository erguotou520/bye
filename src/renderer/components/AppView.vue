<template>
  <div class="app-view flex-1 flex flex-ai-center flex-jc-center" :class="[`view-${name}`, { 'flex-column': !row, 'flex-row': row }]">
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    name: String,
    row: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="stylus">
.app-view
  width 100vw
  height 100vh
  overflow hidden
.page-view-enter-active
.page-view-leave-active
  position absolute
  transition all .3s
.page-view-leave
  transform translate3d(0, 0, 0)
.page-view-leave-to
  opacity 0
  transform translate3d(-100vw, 0, 0)
.page-view-enter
  opacity 0
  transform translate3d(100vw, 0, 0)
.page-view-enter-to
  transform translate3d(0, 0, 0)
</style>
