<template>
  <span class="edit-tag">
    <i-tag v-if="!isEditing" :name="name" closable @dblclick.native="isEditing=true" @on-close="$emit('on-close', name)">{{name}}</i-tag>
    <i-input v-else v-model="editingName" class="w-6r" placeholder="回车保存,esc取消" size="small"
      @keyup.esc.native="cancel" @keyup.enter.native="save"/>
  </span>
</template>
<script>
export default {
  props: {
    name: String
  },
  data () {
    return {
      isEditing: false,
      editingName: this.name
    }
  },
  watch: {
    name (v) {
      this.editingName = v
    }
  },
  methods: {
    cancel () {
      this.isEditing = false
      this.editingName = this.name
      this.$emit('on-cancel')
    },
    save () {
      if (this.editingName) {
        this.isEditing = false
        this.$emit('on-update', this.editingName)
      }
    }
  }
}
</script>
