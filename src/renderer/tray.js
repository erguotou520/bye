import { join } from 'path'
import { readFileSync } from 'fs'

const svgStr = readFileSync(join(__static, 'plane.svg'))
const trayImageWidth = 256

/**
 * 根据svg生成Tray的NativeImage
 * @param {String} mode 模式
 */
export default function generateTrayImage (mode) {
  return new Promise(resolve => {
    const base64Image = `data:image/svg+xml;base64,${btoa(svgStr)}`
    const img = new Image()
    const canvas = document.createElement('canvas')
    img.width = canvas.width = trayImageWidth
    img.height = canvas.height = trayImageWidth
    const ctx = canvas.getContext('2d')
    // ctx.fillStyle = '#fff'
    // ctx.fillRect(0, 0, trayImageWidth, trayImageWidth)
    img.src = base64Image
    img.onload = function () {
      ctx.drawImage(img, 0, 0, 280, 280)
      resolve(canvas.toDataURL())
    }
  })
}
