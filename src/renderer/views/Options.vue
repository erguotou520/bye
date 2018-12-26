<template>
  <app-view name="options" class="bg-white">
    <i-tabs class="flex-1 w-100" :value="view.tab" @on-click="name => updateView({ tab: name })">
      <i-tab-pane label="通用设置" name="common">
        <option-common></option-common>
      </i-tab-pane>
      <i-tab-pane label="SSR设置" name="ssr">
        <option-ssr></option-ssr>
      </i-tab-pane>
      <i-tab-pane label="订阅管理" name="subscribes">
        <option-subscribe></option-subscribe>
      </i-tab-pane>
      <i-tab-pane label="快捷键管理" name="shortcuts">
        <option-shortcut></option-shortcut>
      </i-tab-pane>
    </i-tabs>
    <div class="w-100 flex flex-jc-end px-2 py-1 border-1px-t">
      <i-button class="w-6r mr-2" @click="$emit('back')">返回</i-button>
      <i-button class="w-6r" type="primary" @click="done">完成</i-button>
    </div>
  </app-view>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { hideWindow } from '../ipc'
import OptionCommon from './option/Common'
import OptionSsr from './option/SSR'
import OptionSubscribe from './option/Subscribe'
import OptionShortcut from './option/Shortcut'

export default {
  computed: {
    ...mapState(['view'])
  },
  components: {
    OptionCommon, OptionSsr, OptionSubscribe, OptionShortcut
  },
  methods: {
    ...mapMutations(['resetState', 'updateView']),
    done () {
      this.resetState()
      hideWindow()
    }
  }
}
</script>
<style lang="stylus">
@import '../assets/styles/variable'
.view-options
  .create-input
    width 8.75rem
  .options-container
    height calc(100vh - 102px)
  .url-input
    width 12rem
  .ivu-table
    .ivu-checkbox-wrapper
      margin-right 0
  .input-error
    .ivu-input
      border-color $color-error
      &:focus
        box-shadow 0 0 0 2px rgba($color-error, .2)
</style>
