'use strict'

const path = require('path')
const binaryPath = process.platform === 'win32'
  ? path.join(__dirname, 'builds', 'windows', 'screenwire.node')
  : path.join(__dirname, 'builds', 'macos', 'screenwire.node')
const native = require(binaryPath)

function resolveOptions(optionsOrCallback, maybeCallback) {
  if (typeof optionsOrCallback === 'function') {
    return { options: {}, onStatus: optionsOrCallback }
  }
  if (optionsOrCallback && typeof optionsOrCallback === 'object') {
    return { options: optionsOrCallback, onStatus: maybeCallback }
  }
  return { options: {}, onStatus: maybeCallback }
}

module.exports = {
  // start(outputPath, callback)
  // start(outputPath, options, callback)  — options: { audio?: boolean, microphone?: boolean }
  start(outputPath, optionsOrCallback, maybeCallback) {
    if (typeof outputPath !== 'string') throw new TypeError('outputPath must be a string')
    const { options, onStatus } = resolveOptions(optionsOrCallback, maybeCallback)
    const nativeOptions = {
      audio:      options.audio      !== false,
      microphone: options.microphone !== false,
    }
    native.start(outputPath, nativeOptions, onStatus)
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

  // startAsync(outputPath)
  // startAsync(outputPath, options)  — options: { audio?: boolean, microphone?: boolean }
  async startAsync(outputPath, options) {
    return new Promise((resolve, reject) => {
      this.start(outputPath, options ?? {}, (status) => {
        try {
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
        try {
          resolve(status)
        } catch (error) {
          reject(error)
        }
      })
    })
  }
}
