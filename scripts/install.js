'use strict'

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const binary = path.join(__dirname, '..', 'build', 'Release', 'screenwire.node')
const windowsDll = path.join(__dirname, '..', 'builds', 'windows', 'ScreenWireWindows.dll')
const windowsFfmpeg = path.join(__dirname, '..', 'builds', 'windows', 'ffmpeg', 'ffmpeg.exe')

if (fs.existsSync(binary)) {
  process.exit(0)
}

if (process.platform === 'darwin') {
  execSync('node scripts/build.js', {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit'
  })
  process.exit(0)
}

if (process.platform === 'win32') {
  if (!fs.existsSync(windowsDll) || !fs.existsSync(windowsFfmpeg)) {
    throw new Error(
      'Missing bundled Windows runtime files in bindings/node/builds/windows. ' +
      'Expected ScreenWireWindows.dll and ffmpeg/ffmpeg.exe to be packaged with the library.'
    )
  }

  execSync('node-gyp rebuild', {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit'
  })
  process.exit(0)
}

throw new Error(`Unsupported platform: ${process.platform}`)
