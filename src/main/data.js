import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/of'
import { readJson } from 'fs-extra'
import defaultConfig from './config'
import bootstrap, { appConfigPath } from './bootstrap'

export const appConfig$ = Observable.of(defaultConfig)

// 读取配置
async function setup () {
  await bootstrap
  const storedConfig = await readJson(appConfigPath) 
}

export default setup()
