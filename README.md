# screenwire

Native screen recording for Node.js and Electron.

- macOS backend: ScreenCaptureKit
- Windows backend: NativeAOT C# bridge scaffold, intended for Windows Graphics Capture + Media Foundation/WASAPI

## Requirements

- macOS 13.0 or newer for the current production backend
- Windows 10/11 for the in-progress Windows backend
- Node.js 18+
- Xcode command-line tools (`xcode-select --install`) on macOS
- .NET 8 SDK on Windows
- Bundled `ffmpeg.exe` shipped by the package on Windows
- Screen Recording permission granted to your app/terminal in System Settings on macOS

## Installation

```sh
npm install screenwire
```

The native addon is compiled from source during `npm install`.

- macOS: builds the Swift core and the Node addon
- Windows: uses a bundled NativeAOT DLL and bundled `ffmpeg.exe`, then builds only the Node addon wrapper

## Usage

### Callback

```js
const recorder = require('screenwire')
const path = require('path')

const outputPath = path.join(require('os').homedir(), 'Desktop', 'recording.mp4')

recorder.start(outputPath, (status) => {
  console.log('[status]', status)
})

setTimeout(() => {
  recorder.stop((status) => {
    console.log('[status]', status)
  })
}, 5000)
```

### Async / await

```js
const recorder = require('screenwire')
const path = require('path')

const outputPath = path.join(require('os').homedir(), 'Desktop', 'recording.mp4')
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function main() {
  const startStatus = await recorder.startAsync(outputPath)
  console.log('[status]', startStatus)

  await sleep(5000);

  const stopStatus = await recorder.stopAsync()
  console.log('[status]', stopStatus)
}

main()
```

### API

#### `recorder.start(outputPath, onStatus)`

Starts recording to the given `.mp4` file path. `onStatus` is called with progress/error strings.

#### `recorder.stop(onStatus)`

Stops the recording and finalizes the file. `onStatus` is called with the final status string (e.g. `"Saved recording to /path/to/file.mp4"`).

#### `recorder.startAsync(outputPath) → Promise<string>`

Promise version of `start`. Resolves with the first status string emitted after recording begins.

#### `recorder.stopAsync() → Promise<string>`

Promise version of `stop`. Resolves with the final status string once the file is saved.

#### `recorder.isRecording()`

Returns `true` if a recording is currently in progress.

## Status strings

| String | Meaning |
|---|---|
| `"Checking permissions..."` | Verifying screen recording permission |
| `"Preparing screen capture..."` | Setting up ScreenCaptureKit |
| `"Recording to /path/file.mp4"` | Recording is active |
| `"Stopping recording..."` | Stop was called, finalizing |
| `"Saved recording to /path/file.mp4"` | File successfully written |
| `"Recording stopped."` | Stopped with no output URL |
| `"Could not start recording: ..."` | Error during start |

## Windows status

The Windows path in this repo is scaffolded so the Node package can grow into a true cross-platform addon without changing the public JS API. The actual recorder pipeline for Windows is still to be implemented.

## Windows packaging

For Windows releases, build the DLL ahead of time and ship it inside the npm package:

```sh
npm run build:windows:dll
```

During `npm install` on Windows, the package expects `bindings/node/builds/windows/ScreenWireWindows.dll` to already exist and will only compile the Node addon wrapper.
The package also expects a bundled `ffmpeg.exe` at `bindings/node/builds/windows/ffmpeg/ffmpeg.exe`; it is not read from `PATH`.

## License

MIT
