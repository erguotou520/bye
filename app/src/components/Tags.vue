<template>
  <div class="tags">
    <div v-for="tag in value" class="tag">
      <span>{{tag}}</span>
      <span class="close" @click="remove(tag)">+</span>
    </div>
    <div v-show="isAdding" class="tag">
      <input type="text" v-model="name" @keydown.enter="save">
      <span class="close" @click="close">+</span>
    </div>
    <div v-show="!isAdding" class="tag tag-plus" @click="onAdd">+</div>
  </div>
</template>
<script>
export default {
  props: {
    value: Array
  },
  data () {
    return {
      name: '',
      isAdding: false
    }
  },
  methods: {
    onAdd () {
      this.isAdding = true
      this.name = ''
    },
    save () {
      if (this.name) {
        const copy = this.value.slice()
        copy.push(this.name)
        this.$emit('input', copy)
        this.close()
      }
    },
    remove (tag) {
      const copy = this.value.slice()
      copy.splice(copy.indexOf(tag), 1)
      this.$emit('input', copy)
    },
    close () {
      this.isAdding = false
      this.name = ''
    }
  }
}
</script>
<style lang="stylus" scoped>
.tags
  &::after
    content ''
    display block
    clear both
.tag
  position relative
  float left
  margin 2px 6px
  padding 4px 26px 4px 10px
  line-height 16px
  border-radius 5px
  background-color #41b883
  color #fff
  white-space nowrap
  > input
    -webkit-apprance none
    padding 0
    border none
    outline none
.close
  position absolute
  top 6px
  right 2px
  width 16px
  height 16px
  color #266d4d
  font-size 20px
  transform rotate(45deg)
  transition all .3s
  cursor pointer
  user-select none
  &:hover
    color #fff
.tag-plus
  padding-right 10px
  font-size 20px
  cursor pointer
</style>
