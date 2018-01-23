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
      <i-button class="w-6r" type="default" @click="cancel">取消</i-button>
      <i-button class="w-6r ml-3" type="primary" :disabled="!appConfig.configs.length" @click="save">确定</i-button>
    </div>
  </div>
</template>
<script>
import qr from 'qr-image'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { clipboard } from 'electron'
import { hideWindow } from '../../ipc'
import { clone } from '../../../shared/utils'

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
    ...mapState(['appConfig', 'editingConfig']),
    ...mapGetters(['isEditingConfigUpdated']),
    editingConfigLink () {
      return this.isSSR ? this.editingConfig.getSSRLink() : this.editingConfig.getSSLink()
    },
    editingConfigQR () {
      return qr.svgObject(this.editingConfigLink)
    }
  },
  methods: {
    ...mapMutations(['resetState']),
    ...mapActions(['updateConfigs']),
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
