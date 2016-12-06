<template>
  <div class="form-item">
    <label>
      <slot v-if="$slots.label" name="label"></slot>
      <span v-else>{{label}}</span>
    </label>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    label: String
  }
}
</script>
<style lang="stylus">
.form-item
  display flex
  margin 4px 0
  align-items center
  > label
    width 5rem
    margin-right .75rem
    text-align right
  input
  select
    flex 1
    padding 0 4px
    height 1.5rem
    line-height @height
    outline none
    &:disabled
      background #e8e8e8
  input[type=checkbox]
    display inline-block
    width 1rem
    height 1rem
    vertical-align middle
</style>
