import fs from 'fs'
import path from 'path'
import { net } from 'electron'

const STRING_PROTOTYPE = '[object String]'
const NUMBER_PROTOTYPE = '[object Number]'
const REGEXP_PROTOTYPE = '[object RegExp]'
const DATE_PROTOTYPE = '[object Date]'
const BOOL_PROTOTYPE = '[object Boolean]'
const ARRAY_PROTOTYPE = '[object Array]'
const OBJECT_PROTOTYPE = '[object Object]'
const FUNCTION_PROTOTYPE = '[object Function]'

function protoString (obj) {
  return Object.prototype.toString.call(obj)
}

export function isString (str) {
  return protoString(str) === STRING_PROTOTYPE
}

export function isNumber (num) {
  return protoString(num) === NUMBER_PROTOTYPE
}

export function isRegExp (reg) {
  return protoString(reg) === REGEXP_PROTOTYPE
}

export function isBool (bool) {
  return protoString(bool) === BOOL_PROTOTYPE
}

export function isDate (date) {
  return protoString(date) === DATE_PROTOTYPE
}

export function isArray (arr) {
  return protoString(arr) === ARRAY_PROTOTYPE
}

export function isObject (obj) {
  return protoString(obj) === OBJECT_PROTOTYPE
}

export function isFunction (fn) {
  return protoString(fn) === FUNCTION_PROTOTYPE
}

/**
 * Vue data merge
 * @param  {Object} to      object that want to be merget to
 * @param  {Object} origins origin object sources
 */
export function merge (to, ...origins) {
  origins.forEach(from => {
    for (const key in from) {
      const value = from[key]
      // Just merge existed property in origin data
      if (to[key] !== undefined) {
        switch (protoString(value)) {
          case OBJECT_PROTOTYPE:
            merge(to[key], value)
            break
          default:
            to[key] = value
            break
        }
      }
    }
  })
}

/**
 * 合并应用配置对象
 * @param {Object} to 待合并的应用配置
 * @param {Object} from 用于合并的应用配置
 */
export function configMerge (to, from) {
  for (const key in from) {
    const value = from[key]
    switch (protoString(value)) {
      case OBJECT_PROTOTYPE:
        merge(to[key], value)
        break
      // 配置数组采用直接覆盖的形式
      case ARRAY_PROTOTYPE:
        to[key] = from[key]
        break
      default:
        to[key] = value
        break
    }
  }
}

/**
 * 获取应用配置对象中发生更新的字段
 * @param {Object} appConfig 当前的应用配置
 * @param {Object} targetConfig 新的应用配置
 */
export function getUpdatedKeys (appConfig, targetConfig) {
  return Object.keys(targetConfig).filter(key => {
    const value = targetConfig[key]
    switch (protoString(value)) {
      case OBJECT_PROTOTYPE:
        return getUpdatedKeys(appConfig[key], value).length
      // 配置数组对象，直接使用新的
      case ARRAY_PROTOTYPE:
        return true
      default:
        return appConfig[key] !== value
    }
  })
}

// deep assign
export function assign (to, ...origins) {
  origins.forEach(from => {
    if (!isObject(from)) {
      return
    }
    for (const key in from) {
      const value = from[key]
      switch (protoString(value)) {
        case OBJECT_PROTOTYPE:
          if (to[key] === undefined) {
            to[key] = {}
          }
          assign(to[key], value)
          break
        default:
          to[key] = value
          break
      }
    }
  })
  return to
}

// clone obj
export function clone (obj, deep = false) {
  if (obj === undefined || obj === null) {
    return
  }
  switch (protoString(obj)) {
    case DATE_PROTOTYPE:
      return new Date(obj)
    case REGEXP_PROTOTYPE:
      return new RegExp(obj)
    case ARRAY_PROTOTYPE:
      return !deep ? obj.slice(0) : obj.map(item => clone(item))
    case OBJECT_PROTOTYPE:
      const r = {}
      for (const key in obj) {
        r[key] = deep ? clone(obj[key]) : obj[key]
      }
      return r
    default:
      return obj
  }
}

// 生成随机ID
export function generateID () {
  const seed = 'ABCDEF01234567890'
  const arr = []
  for (let i = 0; i < 32; i++) {
    arr.push(seed[Math.floor(Math.random() * seed.length)])
  }
  return arr.join('')
}

// 为配置分组
export function groupConfigs (configs, selectedIndex) {
  const groups = {}
  const ungrouped = []
  configs.forEach((node, index) => {
    if (selectedIndex !== undefined) {
      node.checked = index === selectedIndex
    }
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
  return groups
}

/**
 * 判断选择的local.py的路径是否正确
 * @param {*String} path local.py所在的目录
 */
export function isSSRPathAvaliable (folderPath) {
  const localPyPath = path.join(folderPath, 'local.py')
  console.log(localPyPath, fs.existsSync(localPyPath))
  return fs.existsSync(localPyPath)
}

/**
 * 发起网络请求
 * @param {String} url 请求的路径
 */
export function request (url, fromRenderer) {
  let _net = net
  if (fromRenderer) {
    const { remote } = require('electron')
    const { net } = remote.require('electron')
    _net = net
  }
  return new Promise((resolve, reject) => {
    _net.request(url)
      .on('response', response => {
        const body = []
        response.on('data', chunk => {
          body.push(chunk.toString())
        })
        response.on('end', () => {
          const stringRes = body.join('')
          if (response.headers['content-type'] === 'application/json') {
            try {
              resolve(JSON.parse(stringRes))
            } catch (error) {
              resolve(stringRes)
            }
          } else {
            resolve(stringRes)
          }
        })
      })
      .on('error', reject)
      .end()
  })
}

/**
 * 发起ajax请求
 * @param {String} url 请求的地址
 */
export function ajax (url) {
  return new Promise((resolve, reject) => {
    const oReq = new XMLHttpRequest()
    oReq.onload = function () {
      resolve(this.responseText)
    }
    oReq.onerror = reject
    oReq.ontimeout = reject
    oReq.open('get', url, true)
    oReq.send()
  })
}
