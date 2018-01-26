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
    // 单位是 时
    const intervalTime = appConfig.subscribeUpdateInterval * 3600000
    try {
      const content = await readFile(subscribeUpdateFile, 'utf8')
      lastUpdateTime = new Date(content.toString())
      const nextUpdateTime = new Date(+lastUpdateTime + intervalTime)
      if (process.env.NODE_ENV === 'development') {
        console.log('next subscribe update time: %s', nextUpdateTime)
      }
      timeout(nextUpdateTime, intervalTime)
    } catch (e) {
      update()
    }
  }
}

// 间隔多久开始下一次更新，用下一次间隔时间减去当前时间
function timeout (nextUpdateTime, intervalTime) {
  _timeout = setTimeout(() => {
    update()
    interval(intervalTime)
  }, nextUpdateTime - new Date())
}

// 往后的更新都按照interval来进行
function interval (intervalTime) {
  _interval = setInterval(update, intervalTime)
}

// 保存最近一次的更新时间
async function saveUpdateTime () {
  const date = new Date()
  lastUpdateTime = date
  if (process.env.NODE_ENV === 'development') {
    console.log('last update time: %s', lastUpdateTime)
  }
  return await writeFile(subscribeUpdateFile, date)
}

// 结束更新任务
export function stopTask () {
  if (_timeout) {
    clearTimeout(_timeout)
  }
  if (_interval) {
    clearInterval(_interval)
  }
}

// 发起更新
async function update () {
  await saveUpdateTime()
  updateSubscribes()
}

// 更新订阅服务器
export function updateSubscribes () {
  sendData(EVENT_SUBSCRIBE_UPDATE_MAIN, true)
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
