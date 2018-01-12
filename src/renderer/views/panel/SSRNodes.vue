<template>
  <div class="panel-nodes flex flex-column h-100">
    <i-tree class="node-tree flex-1 px-1 bg-white" :class="{'empty-tree': !appConfig.configs.length}"
      empty-text="暂无节点，点击添加添加新节点" :enable-cancel-select="false"
      :data="groupedNodes" @on-select-change="onSelect" ref="tree"></i-tree>
    <div class="flex mt-1 flex-jc-center">
      <i-button type="primary" class="config-btn mr-1" @click="create">添加</i-button>
      <i-poptip v-if="selectedNode&&selectedNode.children" confirm title="确定删除该分组下所有节点？"
        @on-ok="removeGroup">
        <i-button class="config-btn" :disabled="disabled.remove">删除</i-button>
      </i-poptip>
      <i-button v-else class="config-btn" :disabled="disabled.remove" @click="remove">删除</i-button>
    </div>
    <div class="flex mt-1 flex-jc-center">
      <i-button class="config-btn mr-1" :disabled="disabled.up" @click="updown(1)">上移</i-button>
      <i-button class="config-btn" :disabled="disabled.down" @click="updown(-1)">下移</i-button>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import Config from '../../../shared/ssr'
export default {
  data () {
    return {
      buttonProps: {
        type: 'ghost',
        size: 'small'
      },
      selectedNodeIndex: -1,
      selectedConfigIndex: this.$store.state.appConfig.index,
      selectedNode: null
    }
  },
  computed: {
    ...mapState(['appConfig', 'editingGroup']),
    // 配置节点
    configs () {
      if (this.appConfig && this.appConfig.configs && this.appConfig.configs.length) {
        return this.appConfig.configs.map((config, index) => {
          return this.cloneConfig(config, index === this.selectedConfigIndex)
        })
      }
      return []
    },
    // 选中的配置节点
    selectedConfig () {
      return this.configs[this.appConfig.index]
    },
    // 分组后的ssr节点
    groupedNodes () {
      if (this.configs.length) {
        const ungrouped = []
        const groups = {}
        this.configs.forEach(node => {
          if (node.group) {
            if (groups[node.group]) {
              groups[node.group].push(node)
            } else {
              groups[node.group] = [node]
            }
          } else {
            ungrouped.push(node)
          }
        })
        if (ungrouped.length) {
          groups['未分组'] = ungrouped
        }
        let index = 0
        return Object.keys(groups).map(groupName => {
          const node = {
            title: groupName,
            expand: true,
            selected: index === this.selectedNodeIndex,
            children: groups[groupName]
          }
          index = index + groups[groupName].length + 1
          return node
        })
      }
      return []
    },
    // 按钮禁用状态
    disabled () {
      if (!this.selectedNode) {
        return { remove: true, up: true, down: true }
      }
      if (this.selectedNode.children) {
        // 选中的是分组
        const index = this.groupedNodes.indexOf(this.selectedNode)
        const isUngrouped = this.selectedNode.title === '未分组'
        return {
          remove: isUngrouped,
          up: index < 1,
          down: index > this.groupedNodes.length - 2
        }
      }
      // 选中的是配置节点
      const prev = this.$refs.tree.flatState[this.selectedNodeIndex - 1]
      const next = this.$refs.tree.flatState[this.selectedNodeIndex + 1]
      return {
        remove: false,
        // 前一项不存在或前一项是分组节点
        up: !prev || !!prev.node.children,
        // 后一项不存在或后一项是分组节点
        down: !next || !!next.node.children
      }
    }
  },
  watch: {
    'appConfig.index' (v) {
      this.selectedConfigIndex = v
      this.setSelectedNodeIndex()
    }
  },
  methods: {
    ...mapMutations(['setCurrentConfig', 'updateEditingGroup']),
    ...mapActions(['updateConfigs']),
    // 复制节点并带上title和选中参数
    cloneConfig (config, selected) {
      return { title: `${config.remarks || config.server} (${config.server}:${config.server_port})`, selected, ...config }
    },
    // 设置选中节点的索引
    setSelectedNodeIndex () {
      this.selectedNodeIndex = this.$refs.tree.getSelectedNodes()[0].nodeKey
    },
    // 点击节点时
    onSelect (selection) {
      const node = selection[0]
      this.selectedNodeIndex = node.nodeKey
      this.selectedNode = node
      if (!node.children) {
        // 选中配置项
        this.setCurrentConfig(node)
        this.updateEditingGroup({ show: false })
      } else {
        // 选中分组
        this.updateEditingGroup({ show: true, title: node.title === '未分组' ? '' : node.title })
      }
    },
    // flat分组
    flatNodeGroups (groups) {
      groups = groups || this.groupedNodes
      const flatArr = []
      groups.forEach(group => {
        flatArr.push(...group.children)
      })
      return flatArr
    },
    // 新增
    create () {
      const newConfig = new Config(this.selectedNode)
      newConfig.selected = false
      const clone = this.appConfig.configs.slice()
      clone.push(newConfig)
      this.updateConfigs(clone)
      this.selectedConfigIndex = this.appConfig.configs.length - 1
      this.$nextTick(() => {
        this.selectedNodeIndex = this.$refs.tree.flatState.findIndex(node => node.node.id === newConfig.id)
      })
    },
    // 删除分组
    removeGroup () {
      const clone = this.appConfig.configs.slice()
      this.updateConfigs(clone.filter(config => config.group !== this.selectedNode.title))
      this.selectedNodeIndex = 0
    },
    // 删除
    remove () {
      const clone = this.appConfig.configs.slice()
      const index = clone.findIndex(config => config.id === this.selectedNode.id)
      clone.splice(index, 1)
      this.updateConfigs(clone)
      if (clone.length === 0) {
        this.selectedNodeIndex = -1
      }
    },
    // 上/下移 direction = 1 上移 其它 下移
    updown (direction = 1) {
      const node = this.selectedNode
      const clone = this.groupedNodes.slice()
      if (node.children) {
        // 分组上/下移
        const index = this.groupedNodes.indexOf(node)
        clone.splice(index, 1)
        clone.splice(direction === 1 ? index - 1 : index + 1, 0, node)
      } else {
        // 节点上/下移
        let keyCount = 0
        for (let i = 0; i < clone.length; i++) {
          // 计算分组中的nodeKey累计
          keyCount = keyCount + clone[i].children.length + 1
          // 如果nodeKey总和大于选中节点的nodeKey或者为最后一个分组，则选中节点在该分组
          if (keyCount >= node.nodeKey || i === clone.length - 1) {
            const cloneChildren = clone[i].children.slice()
            const index = clone[i].children.indexOf(node)
            cloneChildren.splice(index, 1)
            cloneChildren.splice(direction === 1 ? index - 1 : index + 1, 0, node)
            clone[i].children = cloneChildren
            break
          }
        }
        direction === 1 ? this.selectedNodeIndex-- : this.selectedNode.nodeKey++
      }
      this.updateConfigs(this.flatNodeGroups(clone))
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.setSelectedNodeIndex()
    })
  }
}
</script>
<style lang="stylus">
@import '../../assets/styles/variable';
.panel-nodes
  width 12.5rem
  .empty-tree
    display flex
    justify-content center
    align-items center
  .node-tree
    border 1px solid $color-border
    border-radius 4px
    overflow-x hidden
    overflow-y auto
  .ivu-tree-children
    .ivu-tree-children
      .ivu-tree-arrow
        display none
</style>
