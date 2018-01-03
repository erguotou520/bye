<template>
  <i-tree multiple show-checkbox></i-tree>
</template>
<script>
export default {
  data () {
    nodes: this.$store.groupedNodes
  }
}
</script>
