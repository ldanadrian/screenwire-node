'use strict'

const { execFileSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const rootDir = path.join(__dirname, '..')
const windowsBuildDir = path.join(rootDir, 'builds', 'windows')
const windowsDllPath = path.join(windowsBuildDir, 'ScreenWireWindows.dll')

function run(command, args) {
  execFileSync(command, args, {
    cwd: rootDir,
    stdio: 'inherit'
  })
}

function buildWindowsDll() {
  run('dotnet', [
    'publish',
    '../../core/windows/ScreenWire.Windows/ScreenWire.Windows.csproj',
    '-c',
    'Release',
    '-r',
    'win-x64',
    '/p:NativeLib=Shared',
    '/p:SelfContained=true',
    '/p:PublishAot=true',
    '-o',
    'builds/windows'
  ])
}

switch (process.platform) {
  case 'darwin': {
    run('bash', ['scripts/build-swift.sh'])
    run('node-gyp', ['rebuild'])
    const src = path.join(rootDir, 'build', 'Release', 'screenwire.node')
    const dst = path.join(rootDir, 'builds', 'macos', 'screenwire.node')
    fs.copyFileSync(src, dst)
    console.log(`Copied screenwire.node → builds/macos/screenwire.node`)
    break
  }
  case 'win32': {
    if (!fs.existsSync(windowsDllPath)) {
      buildWindowsDll()
    }
    run('node-gyp', ['rebuild'])
    const src = path.join(rootDir, 'build', 'Release', 'screenwire.node')
    const dst = path.join(windowsBuildDir, 'screenwire.node')
    fs.copyFileSync(src, dst)
    console.log(`Copied screenwire.node → builds/windows/screenwire.node`)
    break
  }
  default:
    throw new Error(`screenwire is only supported on macOS and Windows. Current platform: ${process.platform}`)
}
