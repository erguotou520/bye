<template>
  <div class="flex flex-column h-100 bg-white">
    <i-tabs class="flex-1" :value="tab">
      <i-tab-pane label="通用设置" name="common">
        123
      </i-tab-pane>
      <i-tab-pane label="SSR设置" name="ssr">
        234
      </i-tab-pane>
      <i-tab-pane label="订阅管理" name="subscribes">
        345
      </i-tab-pane>
    </i-tabs>
    <div class="options-footer flex flex-jc-end px-2 py-1 border-1px-t">
      <i-button class="w-6r mr-2" @click="$emit('back')">返回</i-button>
      <i-button class="w-6r" type="primary" @click="done">完成</i-button>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { hideWindow } from '../ipc'
export default {
  data () {
    return {
      tab: ''
    }
  },
  computed: {
    ...mapState(['view'])
  },
  watch: {
    view: {
      deep: true,
      handler (v) {
        if (v.fromMain && v.tab) {
          this.tab = v.tab
        }
      }
    }
  },
  methods: {
    ...mapMutations(['resetState']),
    done () {
      this.resetState()
      hideWindow()
    }
  }
}
</script>
