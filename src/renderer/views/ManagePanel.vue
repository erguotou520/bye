<template>
  <app-view name="panel" class="px-2 py-2" row>
    <ssr-nodes></ssr-nodes>
    <ssr-form v-show="!editingGroup.show" class="flex-1 mx-1"></ssr-form>
    <ssr-group v-show="editingGroup.show&&editingGroup.title" class="flex-1 ml-1"></ssr-group>
    <ssr-qrcode v-show="!editingGroup.show"></ssr-qrcode>
    <div v-show="editingGroup.show&&!editingGroup.title" class="flex-1"></div>
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
