'use strict'

const { execFileSync } = require('child_process')
const path = require('path')

const rootDir = path.join(__dirname, '..')

execFileSync('dotnet', [
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
], {
  cwd: rootDir,
  stdio: 'inherit'
})
