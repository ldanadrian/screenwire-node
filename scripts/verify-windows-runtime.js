'use strict'

const fs = require('fs')
const path = require('path')

const bindingRoot = path.join(__dirname, '..')
const requiredFiles = [
  path.join(bindingRoot, 'builds', 'windows', 'ScreenWireWindows.dll'),
  path.join(bindingRoot, 'builds', 'windows', 'ffmpeg', 'ffmpeg.exe')
]

const missing = requiredFiles.filter((filePath) => !fs.existsSync(filePath))

if (missing.length > 0) {
  const relativeMissing = missing.map((filePath) => path.relative(bindingRoot, filePath))
  throw new Error(
    `Missing bundled Windows runtime files:\n- ${relativeMissing.join('\n- ')}\n` +
    'Build/package them before publishing or testing the Windows package.'
  )
}

console.log('Windows runtime looks complete.')
