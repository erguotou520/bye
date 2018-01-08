<template>
  <app-view name="panel" class="px-1 py-1" row>
    <ssr-nodes></ssr-nodes>
    <ssr-form class="flex-1 mx-1"></ssr-form>
    <ssr-qrcode></ssr-qrcode>
  </app-view>
</template>
<script>
import SsrNodes from './panel/SSRNodes'
import SsrForm from './panel/SSRForm'
import SsrQrcode from './panel/SSRQrcode'
export default {
  components: {
    SsrNodes, SsrForm, SsrQrcode
  }
}
</script>
