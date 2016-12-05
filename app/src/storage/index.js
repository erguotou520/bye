const storage = window.localStorage
const STORAGE_KEY = '__electron-ssr__'

export function getConfigs () {
  return JSON.parse(storage.getItem(STORAGE_KEY))
}

export function saveConfigs (configs) {
  storage.setItem(STORAGE_KEY, JSON.stringify(configs))
}
