import fs from 'fs'
import path from 'path'

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

/**
 * 判断选择的local.py的路径是否正确
 * @param {*String} path local.py所在的目录
 */
export function isSSRPathAvaliable (folderPath) {
  const localPyPath = path.join(folderPath, 'local.py')
  console.log(localPyPath)
  return fs.existsSync(localPyPath)
}

