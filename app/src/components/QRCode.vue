<template>
  <div class="app-qrcode flex flex-column flex-main-center flex-cross-center">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 47 47">
      <path :d="imgSrc"></path>
    </svg>
    <div class="buttons flex">
      <button type="button" class="flex-1" @click="cancel">取消</button>
      <button type="button" class="flex-1" @click="ok">确定</button>
    </div>
  </div>
</template>
<script>
import qr from 'qr-image'
export default {
  props: {
    link: String
  },
  data () {
    return {
      imgSrc: ''
    }
  },
  watch: {
    link (val) {
      if (val) {
        const svgObj = qr.svgObject(val, 'H')
        this.imgSrc = svgObj.path
      }
    }
  },
  methods: {
    cancel () {},
    ok () {}
  }
}
</script>
<style lang="stylus">
.app-qrcode
  width 17.5rem
  padding 1rem
  svg
    width 240px
    height @width
    margin-bottom 1rem
  .buttons
    width 100%
  button
    margin 4px
</style>
