import { desktopCapturer } from 'electron'
var { qrcode } = require('./qrcode')

/**
 * Create a screenshot of the entire screen using the desktopCapturer module of Electron.
 *
 * @param callback {Function} callback receives as first parameter the base64 string of the image
 * @param imageFormat {String} Format of the image to generate ('image/jpeg' or 'image/png')
 **/
export default function scanQrcode (callback, imageFormat = 'image/png') {
  function handleStream (stream) {
    // Create hidden video tag
    var video = document.createElement('video')
    video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;'
    // Event connected to stream
    video.onloadedmetadata = function () {
      // Set video ORIGINAL height (screenshot)
      video.style.height = this.videoHeight + 'px' // videoHeight
      video.style.width = this.videoWidth + 'px' // videoWidth

      // Create canvas
      var canvas = document.createElement('canvas')
      canvas.width = this.videoWidth
      canvas.height = this.videoHeight
      var ctx = canvas.getContext('2d')
      // Draw video on canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      if (callback) {
        // Save screenshot to base64
        // var base64 = canvas.toDataURL(imageFormat)
        qrcode.width = this.videoWidth
        qrcode.height = this.videoHeight
        qrcode.imagedata = ctx.getImageData(0, 0, qrcode.width, qrcode.height)
        try {
          var result = qrcode.process(ctx)
          console.log('qrcode process result:', result)
          callback(null, result)
        } catch (e) {
          console.error(e)
          callback(e)
        }
      } else {
        console.log('Need callback!')
      }
      // Remove hidden video tag
      video.remove()
      try {
        // Destroy connect to stream
        stream.getTracks()[0].stop()
      } catch (e) {}
    }
    video.src = window.URL.createObjectURL(stream)
    document.body.appendChild(video)
  }

  function handleError (e) {
    console.log(e)
  }

  // Filter only screen type
  desktopCapturer.getSources({ types: ['screen'] }, (error, sources) => {
    if (error) throw error
    // console.log(sources);
    for (let i = 0; i < sources.length; ++i) {
      // Filter: main screen
      if (sources[i].name === 'Entire screen') {
        navigator.webkitGetUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: sources[i].id,
              minWidth: 1280,
              maxWidth: 4000,
              minHeight: 720,
              maxHeight: 4000
            }
          }
        }, handleStream, handleError)
        return
      }
    }
  })
}
