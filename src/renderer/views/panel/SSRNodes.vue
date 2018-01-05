<template>
  <i-tree multiple show-checkbox></i-tree>
</template>
<script>
export default {
  data () {
    return {
      nodes: this.$store.groupedNodes
    }
  }
}
</script>
