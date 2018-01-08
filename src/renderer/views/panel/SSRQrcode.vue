<template>
  <!-- 二维码 -->
  <div class="app-qrcode flex flex-column flex-ai-center flex-jc-center">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
      :view-box.camel="`0 0 ${editingConfigQR.size} ${editingConfigQR.size}`" width="280" height="280">
      <path :d="editingConfigQR.path"></path>
    </svg>
    <div class="link flex flex-ai-center mt-2">
      <i-checkbox v-model="isSSR">SSR链接</i-checkbox>
      <i-input class="flex-1" ref="input" :value="editingConfigLink" readonly style="width:auto">
        <template slot="append">
          <i-tooltip :content="copyTooltip" placement="top-end" :delay="300">
            <i-button icon="ios-copy" @click="copy"
              @mouseover.native="onCopyOver" @mouseout.native="onCopyOut"></i-button>
          </i-tooltip>
        </template>
      </i-input>
    </div>
    <div class="flex mt-2 flex-jc-center">
      <i-button type="default" @click="cancel">取消</i-button>
      <i-button type="primary" class="ml-3" @click="save">确定</i-button>
    </div>
  </div>
</template>
<script>
import qr from 'qr-image'
import { mapState } from 'vuex'
import { clipboard } from 'electron'

const COPY_TOOLTIP = '点击复制链接'
const COPY_TOOLTIP_COPIED = '链接已复制'
export default {
  data () {
    return {
      isSSR: true,
      copyTooltip: COPY_TOOLTIP,
      copied: false,
      timeout: null
    }
  },
  computed: {
    ...mapState(['editingConfig']),
    editingConfigLink () {
      return this.isSSR ? this.editingConfig.getSSRLink() : this.editingConfig.getSSLink()
    },
    editingConfigQR () {
      return qr.svgObject(this.editingConfigLink)
    }
  },
  methods: {
    copy () {
      this.copied = true
      this.copyTooltip = COPY_TOOLTIP_COPIED
      clipboard.writeText(this.editingConfigLink)
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
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
    cancel () {
      this.$emit('hide-window')
    },
    save () {
      if (!this.selectedConfig) {
        return window.alert('请先选择或创建一个配置')
      }
      if (this.tempConfig.isValid()) {
        const copy = this.configs.slice()
        Object.assign(copy[this.selectedIndex], this.tempConfig)
        this.updateConfigs(copy)
        this.$emit('hide-window')
      } else {
        window.alert('服务器配置信息不完整')
      }
    }
  }
}
</script>
