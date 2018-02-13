<template>
  <i-alert v-show="alertError" class="client-errors" type="error" closable>
    <div class="messages">
      <div v-for="(err,index) in clientErrors" :key="index">{{err}}</div>
    </div>
    <div slot="close">
      <div class="mb-2" @click.stop="clearClientErrors">清空</div>
      <div>关闭</div>
    </div>
  </i-alert>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  props: {},
  data () {
    return {
      alertError: false
    }
  },
  computed: {
    ...mapState(['clientErrors'])
  },
  watch: {
    clientErrors (v) {
      this.alertError = !!v.length
    }
  },
  methods: {
    ...mapMutations(['clearClientErrors']),
  }
}
</script>
<style lang="stylus">
.client-errors
  position fixed
  top 0
  left 2rem
  right @left
  .messages
    max-height 12.5rem
    overflow auto
    white-space pre-wrap
</style>
