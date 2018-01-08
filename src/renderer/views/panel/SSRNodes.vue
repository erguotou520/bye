<template>
  <div class="panel-nodes h-100">
    <i-tree class="node-tree px-1 bg-white" :data="groupedNodes"
      @on-select-change="onSelect"></i-tree>
    <div class="flex mt-2 flex-jc-center">
      <i-button type="primary" class="config-btn mr-2">添加</i-button>
      <i-button type="error" class="config-btn">删除</i-button>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      buttonProps: {
        type: 'ghost',
        size: 'small'
      }
    }
  },
  computed: {
    ...mapState(['appConfig']),
    // 分组后的ssr节点
    groupedNodes () {
      if (this.appConfig && this.appConfig.configs && this.appConfig.configs.length) {
        const ungrouped = []
        const groups = {}
        this.appConfig.configs.forEach(config => {
          if (config.group) {
            if (groups[config.group]) {
              groups[config.group].push(this.cloneConfig(config))
            } else {
              groups[config.group] = [this.cloneConfig(config)]
            }
          } else {
            ungrouped.push(this.cloneConfig(config))
          }
        })
        if (ungrouped.length) {
          groups['未分组'] = ungrouped
        }
        return Object.keys(groups).map(groupName => {
          return {
            title: groupName,
            selectable: false,
            expand: true,
            children: groups[groupName]
          }
        })
      } else {
        return []
      }
    }
  },
  methods: {
    ...mapMutations(['setCurrentConfig']),
    // 复制节点并带上title参数
    cloneConfig (config) {
      return { title: `${config.remarks || config.server} (${config.server}:${config.server_port})`, selectable: true, ...config }
    },
    onSelect (selection) {
      const node = selection[0]
      if (node.children === undefined) {
        this.setCurrentConfig(node)
      }
    }
  }
}
</script>
<style lang="stylus">
@import '../../assets/styles/variable';
.panel-nodes
  width 12.5rem
  .node-tree
    border 1px solid $color-border
    border-radius 4px
    overflow-x hidden
    overflow-y auto
  .config-btn
    width 10rem
  .ivu-tree-children
    .ivu-tree-children
      .ivu-tree-arrow
        display none
</style>
