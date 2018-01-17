import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/multicast'
import { readJson, writeJson } from 'fs-extra'
import bootstrap, { appConfigPath } from './bootstrap'
import { sendData } from './window'
import { EVENT_RX_SYNC_MAIN } from '../shared/events'
import { getUpdatedKeys, configMerge } from '../shared/utils'
import defaultConfig, { mergeConfig } from '../shared/config'

let promise
export let currentConfig

// 读取配置
async function read () {
  try {
    return await readJson(appConfigPath)
  } catch (e) {
    return Promise.resolve(defaultConfig)
  }
}

// 应用起步后初始化
async function init () {
  await bootstrap
  const stored = await read()
  mergeConfig(stored)
  return stored
}

// 支持多播
const subject = new Subject()
let _observe
const source = Observable.create(observe => {
  _observe = observe
  // 初始化数据
  promise = init().then(data => {
    currentConfig = data
    // 第一个参数为当前配置对象，第二个参数为变更的字段数组
    observe.next([data, []])
  })
})

/**
 * 统一使用该接口从外部更新应用配置
 * @param {Object} targetConfig 要更新的配置
 */
export function updateAppConfig (targetConfig) {
  const changedKeys = getUpdatedKeys(currentConfig, targetConfig)
  // 只有有数据变更才更新配置
  if (changedKeys.length) {
    configMerge(currentConfig, targetConfig)
    _observe.next([currentConfig, changedKeys])
  }
}

export const appConfig$ = source.multicast(subject).refCount()

// 配置文件变化时
appConfig$.subscribe(data => {
  const [appConfig, changed] = data
  if (changed.length) {
    // 如果更新则写入配置文件
    writeJson(appConfigPath, appConfig, { spaces: '\t' })
    sendData(EVENT_RX_SYNC_MAIN, appConfig)
  }
})

export default promise
