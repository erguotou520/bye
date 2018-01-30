<template>
  <!-- 二维码 -->
  <div class="app-qrcode flex flex-column flex-ai-center flex-jc-center pos-r">
    <p class="tip mb-1">截图请注意打码</p>
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="280" height="280"
      :view-box.camel="`0 0 ${editingConfigQR.size} ${editingConfigQR.size}`"
      @contextmenu="onRightClick" ref="svg">
      <path :d="editingConfigQR.path"></path>
    </svg>
    <ul v-if="contextmenu.show" class="contextmenu" v-clickoutside="clickoutside"
      :style="{left:contextmenu.left,right:contextmenu.right,top:contextmenu.top}">
      <li @click="copyImage">复制图像</li>
      <li @click="copyLink">复制链接</li>
    </ul>
    <div class="link flex flex-ai-center mt-1">
      <i-checkbox v-model="isSSR">SSR链接</i-checkbox>
      <i-input class="flex-1" ref="input" :value="editingConfigLink" readonly style="width:auto">
        <template slot="append">
          <i-tooltip :content="copyTooltip" placement="top-end" :delay="300">
            <i-button icon="ios-copy" @click="copyLink"
              @mouseover.native="onCopyOver" @mouseout.native="onCopyOut"></i-button>
          </i-tooltip>
        </template>
      </i-input>
    </div>
    <div class="flex mt-2 flex-jc-center">
      <i-button class="w-6r" type="default" @click="cancel">取消</i-button>
      <i-button class="w-6r ml-3" type="primary" @click="save">确定</i-button>
    </div>
  </div>
</template>
<script>
import { clipboard, nativeImage } from 'electron'
import qr from 'qr-image'
import clickoutside from 'erguotou-iview/src/directives/clickoutside'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { hideWindow } from '../../ipc'
import { clone, merge } from '../../../shared/utils'

const COPY_TOOLTIP = '点击复制链接'
const COPY_TOOLTIP_COPIED = '链接已复制'
export default {
  data () {
    return {
      isSSR: true,
      copyTooltip: COPY_TOOLTIP,
      copied: false,
      timeout: null,
      contextmenu: {
        show: false,
        left: 'auto',
        right: 'auto',
        top: '0px'
      }
    }
  },
  computed: {
    ...mapState(['appConfig', 'editingConfig']),
    ...mapGetters(['isEditingConfigUpdated']),
    editingConfigLink () {
      return this.isSSR ? this.editingConfig.getSSRLink() : this.editingConfig.getSSLink()
    },
    editingConfigQR () {
      return qr.svgObject(this.editingConfigLink)
    }
  },
  directives: {
    clickoutside
  },
  methods: {
    ...mapMutations(['resetState', 'updateEditingBak']),
    ...mapActions(['updateConfigs']),
    copyImage () {
      const self = this
      const base64Image = `data:image/svg+xml;base64,${btoa(new XMLSerializer().serializeToString(this.$refs.svg))}`
      const img = new Image()
      const canvas = document.createElement('canvas')
      img.width = canvas.width = 280
      img.height = canvas.height = 280
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, 280, 280)
      img.src = base64Image
      img.onload = function () {
        ctx.drawImage(img, 0, 0, 280, 280)
        clipboard.writeImage(nativeImage.createFromDataURL(canvas.toDataURL()))
        self.$Message.success('已将二维码复制到剪贴板')
      }
      this.contextmenu.show = false
    },
    copyLink () {
      this.copied = true
      this.copyTooltip = COPY_TOOLTIP_COPIED
      clipboard.writeText(this.editingConfigLink)
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
      this.contextmenu.show = false
    },
    onCopyOver () {
      if (this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = null
      }
    },
    onCopyOut () {
      this.timeout = setTimeout(() => {
        this.copyTooltip = COPY_TOOLTIP
      }, 500)
    },
    onRightClick (e) {
      const showOnRight = e.layerX < 180
      merge(this.contextmenu, {
        show: true,
        left: showOnRight ? `${e.layerX + 4}px` : 'auto',
        right: showOnRight ? 'auto' : `${284 - e.layerX}px`,
        top: `${e.layerY + 4}px`
      })
    },
    clickoutside () {
      this.contextmenu.show = false
    },
    cancel () {
      this.resetState()
      hideWindow()
    },
    save () {
      if (this.editingConfig.isValid()) {
        if (this.isEditingConfigUpdated) {
          const copy = this.appConfig.configs.slice()
          const index = copy.findIndex(config => config.id === this.editingConfig.id)
          copy.splice(index, 1)
          copy.splice(index, 0, clone(this.editingConfig))
          this.updateEditingBak()
          this.updateConfigs(copy)
        } else {
          hideWindow()
        }
      } else {
        window.alert('服务器配置信息不完整')
      }
    }
  }
}
</script>
<style lang="stylus">
@import '../../assets/styles/variable'
.app-qrcode
  .tip
    line-height 0
    color $color-sub-title
  .contextmenu
    position absolute
    display block
    margin 0
    padding 2px 0
    min-width 6rem
    list-style none
    background-color #fff
    box-shadow 2px 2px 4px rgba(0, 0, 0, .5)
    z-index 999
    li
      padding 4px 16px
      cursor pointer
      &:hover
        background-color #f1f1f1
</style>
