<template>
  <div class="app-qrcode">
    <img :src="imgSrc" alt="" />
  </div>
</template>
<script>
import Qrcodesvg from 'qrcodesvg'
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
        this.imgSrc = new Qrcodesvg(val, 400).generate()
        console.log(typeof this.imgSrc)
      }
    }
  }
}
</script>
<style lang="stylus">
.app-qrcode
  width 17.5rem
</style>
