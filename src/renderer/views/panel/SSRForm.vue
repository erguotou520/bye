<template>
  <i-form :model="form" :label-width="120">
    <i-form-item label="服务器地址">
      <i-input type="text" v-model="form.host"/>
    </i-form-item>
    <i-form-item label="服务器端口">
      <i-input-number v-model="form.port" :min="1024" :max="65535"/>
    </i-form-item>
    <i-form-item label="密码">
      <i-input-number v-model="form.password"/>
    </i-form-item>
    <i-form-item label="加密方式">
      <i-select v-model="form.method">
        <i-option v-for="method in $store.appConfig.methods" :key="method" :value="method">{{method}}</i-option>
      </i-select>
    </i-form-item>
    <i-form-item label="协议">
      <i-select v-model="form.protocol">
        <i-option v-for="protocol in $store.appConfig.protocols" :key="protocol" :value="protocol">{{protocol}}</i-option>
      </i-select>
    </i-form-item>
    <i-form-item label="混淆">
      <i-select v-model="form.obfs">
        <i-option v-for="obfs in $store.appConfig.obfses" :key="obfs" :value="obfs">{{obfs}}</i-option>
      </i-select>
    </i-form-item>
    <i-form-item label="混淆参数">
      <i-input v-model="form.obfsparam"/>
    </i-form-item>
    <i-form-item label="备注">
      <i-input v-model="form.remark"/>
    </i-form-item>
  </i-form>
</template>
<script>
export default {
  data () {

  }
}
</script>
