<template>
  <app-view name="panel" row>
    <ssr-nodes></ssr-nodes>
    <ssr-form></ssr-form>
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
