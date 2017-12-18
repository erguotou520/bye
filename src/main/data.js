import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/multicast'
import { readJson, writeJson } from 'fs-extra'
import bootstrap, { appConfigPath } from './bootstrap'
import { ipc$ } from './ipc'
import { getUpdatedKeys, configMerge } from '../shared/utils'

let promise
let currentConfig

// 读取配置
async function read () {
  return await readJson(appConfigPath)
}

// 应用起步后初始化
async function init () {
  await bootstrap
  return read()
}

// 支持多播
const subject = new Subject()
const source = Observable.create(observe => {
  // 初始化数据
  promise = init().then(data => {
    currentConfig = data
    // 第一个参数为当前配置对象，第二个参数为变更的字段数组
    observe.next([data, []])
    // ipc接收到数据更新后
    ipc$.subscribe(v => {
      const changedKeys = getUpdatedKeys(currentConfig, v)
      // 只有有数据变更才更新配置
      if (changedKeys.length) {
        configMerge(currentConfig, v)
        observe.next([currentConfig, changedKeys])
      }
    })
  })
})

export const appConfig$ = source.multicast(subject).refCount()

// 配置文件变化时
appConfig$.subscribe(data => {
  const [appConfig, changed] = data
  if (changed.length) {
    // 如果更新则写入配置文件
    writeJson(appConfigPath, appConfig)
  }
})

export default promise
