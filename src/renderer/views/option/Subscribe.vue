<template>
  <div class="options-container px-2 pb-2 scroll-y">
    <div class="flex pb-1">
      <i-button type="primary" class="w-6r" @click="onCreate">添加</i-button>
      <i-button type="primary" class="w-6r ml-1" :disabled="selectedRows.length<1" @click="update">更新</i-button>
      <i-button type="warning" class="w-6r ml-1" @click="remove" :disabled="selectedRows.length<1">删除</i-button>
      <i-input v-show="showNewUrl" class="ml-auto url-input" :class="{'input-error': urlError}"
        v-model="url" placeholder="请输入合法的URL并回车" icon="plus" ref="input"
        @keyup.enter.native="save" @keyup.esc.native="cancel"/>
    </div>
    <i-table stripe border :columns="columns" :data="tableData" size="small"
      :loading="loading" no-data-text="暂无订阅服务器" height="252"
      @on-selection-change="selectRows" @on-row-dblclick="onRowDBClick"></i-table>
  </div>
</template>
<script>
import Base64 from 'urlsafe-base64'
import { mapState, mapActions } from 'vuex'
import { request } from '../../../shared/utils'
import { loadConfigsFromString } from '../../../shared/ssr'

const URL_REGEX = /^https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/
export default {
  data () {
    return {
      url: '',
      showNewUrl: false,
      urlError: false,
      loading: false,
      columns: [
        { type: 'selection', width: 54, align: 'center' },
        { title: '订阅地址', key: 'URL', render: (h, params) => {
          const self = this
          const isEditing = params.index === this.editingRowIndex
          let element
          if (isEditing) {
            element = h('i-input', {
              props: {
                value: this.editingRowUrl,
                placeholder: '请输入新的订阅服务器的URL'
              },
              nativeOn: {
                keyup (e) {
                  if (e.keyCode === 13) {
                    self.loading = true
                    if (URL_REGEX.test(self.editingRowUrl)) {
                      const url = self.editingRowUrl
                      self.requestSubscribeUrl(url).then(res => {
                        self.loading = false
                        const [valid, configs] = self.isSubscribeContentValid(res)
                        if (valid) {
                          const clone = self.appConfig.serverSubscribes.slice()
                          clone.splice(params.index, 1)
                          clone.splice(params.index, 0, { URL: url, Group: configs[0].group })
                          self.updateConfig({ serverSubscribes: clone, configs })
                        }
                      }).catch(() => {
                        self.loading = false
                      })
                      self.cancelEditing()
                    } else {
                      self.editingUrlError = true
                    }
                  } else if (e.keyCode === 27) {
                    self.cancelEditing()
                  }
                }
              }
            })
          } else {
            element = params.row.URL
          }
          return h('div', [element])
        } },
        { title: '组名', key: 'Group', width: 320 }
      ],
      selectedRows: [],
      editingRowIndex: -1,
      editingRowUrl: '',
      editingUrlError: false
    }
  },
  computed: {
    ...mapState(['appConfig']),
    tableData () {
      return this.appConfig.serverSubscribes
    }
  },
  watch: {
    url () {
      if (this.urlError) {
        this.urlError = false
      }
    },
    editingRowUrl () {
      if (this.editingUrlError) {
        this.editingUrlError = false
      }
    }
  },
  methods: {
    ...mapActions(['updateConfig', 'updateConfigs']),
    selectRows (rows) {
      this.selectedRows = rows
    },
    onRowDBClick (row, index) {
      if (this.editingRowIndex > -1) {
        // 有正在编辑项
        this.$refs.url.focus()
      } else {
        this.editingRowIndex = index
        this.editingRowUrl = row.URL
      }
    },
    update () {
      this.selectedRows.map(row => {
        return this.requestSubscribeUrl(row.URL).then(res => {
          const [valid, configs] = this.isSubscribeContentValid(res)
          if (valid) {
            this.updateSubscribedConfigs(configs)
          }
        })
      })
    },
    remove () {
      const removeGroup = this.selectedRows.map(row => row.Group)
      const clone = this.appConfig.serverSubscribes.filter(config => removeGroup.indexOf(config.Group) < 0)
      this.updateConfig({ serverSubscribes: clone })
      this.selectedRows = []
    },
    // 根据订阅返回值判断其是否为可用的订阅内容
    isSubscribeContentValid (content) {
      if (!content) {
        return [false]
      }
      const decoded = Base64.decode(content).toString('utf-8')
      const configs = loadConfigsFromString(decoded)
      if (!configs.length) {
        return [false]
      } else {
        const group = configs[0].group
        const inOneGroup = configs.slice(1).every(config => config.group === group)
        return [inOneGroup, inOneGroup ? configs : []]
      }
    },
    // 同时使用electron的net和fetch api请求
    requestSubscribeUrl (url) {
      return Promise.race([request(url, true), fetch(url).then(res => res.text())])
    },
    // 根据订阅返回的节点数据更新ssr配置项
    updateSubscribedConfigs (configs) {
      const group = configs[0].group
      const notInGroup = this.appConfig.configs.filter(config => config.group !== group)
      this.updateConfigs(notInGroup.concat(configs))
    },
    onCreate () {
      this.showNewUrl = true
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    cancel () {
      this.showNewUrl = false
      this.url = ''
      this.urlError = false
    },
    cancelEditing () {
      this.editingRowIndex = -1
      this.editingRowUrl = ''
      this.editingUrlError = false
    },
    save () {
      if (URL_REGEX.test(this.url)) {
        this.loading = true
        const url = this.url
        this.requestSubscribeUrl(url).then(res => {
          this.loading = false
          const [valid, configs] = this.isSubscribeContentValid(res)
          if (valid) {
            const clone = this.appConfig.serverSubscribes.slice()
            clone.push({ URL: url, Group: configs[0].group })
            this.updateConfig({ serverSubscribes: clone, configs })
          }
        }).catch(() => {
          this.loading = false
        })
        this.cancel()
      } else {
        this.urlError = true
      }
    }
  }
}
</script>
