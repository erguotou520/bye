<template>
  <a href @click.prevent="open"><slot>{{href}}</slot></a>
</template>
<script>
import { shell } from 'electron'
export default {
  props: {
    href: String
  },
  methods: {
    open () {
      shell.openExternal(this.href)
    }
  }
}
</script>

