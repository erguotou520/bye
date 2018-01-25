/**
 * 订阅服务器
 */
import { readFile, writeFile } from './promisify'
import { subscribeUpdateFile } from './bootstrap'
import { appConfig$ } from './data'
import { sendData } from './window'
import { EVENT_SUBSCRIBE_UPDATE_MAIN } from '../shared/events'

// 上次更新时间
let lastUpdateTime
let _interval
let _timeout
export async function startTask (appConfig) {
  stopTask()
  if (appConfig.autoUpdateSubscribes) {
    const intervalTime = appConfig.subscribeUpdateInterval * 3600000
    try {
      const content = await readFile(subscribeUpdateFile, 'utf8')
      lastUpdateTime = new Date(content.toString())
      const nextUpdateTime = new Date(+lastUpdateTime + intervalTime)
      timeout(nextUpdateTime, intervalTime)
    } catch (e) {
      lastUpdateTime = new Date()
      interval(intervalTime)
    }
    saveLastUpdateTime()
  }
}

// 间隔多久开始下一次更新，用下一次间隔时间减去当前时间
function timeout (nextUpdateTime, intervalTime) {
  _timeout = setTimeout(() => {
    interval(intervalTime)
  }, nextUpdateTime - new Date())
}

// 往后的更新都按照interval来进行
function interval (intervalTime) {
  _interval = setInterval(updateSubscribes, intervalTime)
}

// 保存上次更新时间
async function saveLastUpdateTime () {
  if (lastUpdateTime) {
    return await writeFile(subscribeUpdateFile, lastUpdateTime)
  }
}

/**
 * 结束更新任务
 */
export function stopTask () {
  if (_timeout) {
    clearTimeout(_timeout)
  }
  if (_interval) {
    clearInterval(_interval)
  }
}

// 更新订阅服务器
export function updateSubscribes () {
  sendData(EVENT_SUBSCRIBE_UPDATE_MAIN)
}

// 监听配置变化
appConfig$.subscribe(data => {
  const [appConfig, changed] = data
  // 初始化
  if (changed.length === 0) {
    startTask(appConfig)
  } else {
    if (['autoUpdateSubscribes', 'subscribeUpdateInterval'].some(key => changed.indexOf(key) > -1)) {
      startTask(appConfig)
    }
  }
})
