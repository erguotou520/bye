<template>
  <app-view name="panel" class="px-2 py-2" row>
    <ssr-nodes></ssr-nodes>
    <ssr-form v-show="!editingGroup" class="flex-1 mx-1"></ssr-form>
    <ssr-group v-show="editingGroup" class="flex-1 ml-1"></ssr-group>
    <ssr-qrcode v-show="!editingGroup"></ssr-qrcode>
  </app-view>
</template>
<script>
import { mapState } from 'vuex'
import SsrNodes from './panel/SSRNodes'
import SsrForm from './panel/SSRForm'
import SsrGroup from './panel/SSRGroup'
import SsrQrcode from './panel/SSRQrcode'
export default {
  components: {
    SsrNodes, SsrForm, SsrGroup, SsrQrcode
  },
  computed: {
    ...mapState(['editingGroup'])
  }
}
</script>
<style lang="stylus">
.view-panel
  .config-btn
    width 6rem
</style>
