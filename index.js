'use strict'

const path = require('path')
const binaryPath = process.platform === 'win32'
  ? path.join(__dirname, 'builds', 'windows', 'screenwire.node')
  : path.join(__dirname, 'builds', 'macos', 'screenwire.node')
const native = require(binaryPath)

module.exports = {
  start(outputPath, onStatus) {
    if (typeof outputPath !== 'string') throw new TypeError('outputPath must be a string')
    native.start(outputPath, onStatus)
  },

  stop(onStatus) {
    native.stop((status) => {
      if (onStatus) onStatus(status)
      if (
        status.startsWith('Saved') ||
        status === 'Recording stopped.' ||
        status.includes('failed') ||
        status.includes('cancelled')
      ) {
        native.unref()
      }
    })
  },

  isRecording() {
    return native.isRecording()
  },

  async startAsync(outputPath) {
    return new Promise((resolve, reject) => {
      this.start(outputPath, (status) => {
        try{
          resolve(status)
        } catch (error) {
          reject(error)
        }
      })
    })
  },

  async stopAsync() {
    return new Promise((resolve, reject) => {
      this.stop((status) => {
        try{
          resolve(status)
        } catch (error) {
          reject(error)
        }
      })
    })
  }
}
