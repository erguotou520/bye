<template>
  <span class="dot">...</span>
</template>
<style lang="stylus">
.dot
  display inline-block
  width 3ch
  text-align left
  vertical-align bottom
  overflow hidden
  text-indent -1ch
  animation dot 3s infinite step-start both
  /* 等宽字体很重要 */
  font-family Consolas, Monaco, monospace
  @keyframes dot
    33%
      text-indent 0
    66%
      text-indent -2ch
</style>
