# screenwire

Native screen recording for Node.js and Electron — macOS and Windows.

- **macOS** — ScreenCaptureKit (macOS 13+, Apple Silicon)
- **Windows** — WASAPI loopback + GDI screen capture via NativeAOT C# bridge (Windows 10/11 x64)

Prebuilt binaries are included. No Xcode, no .NET SDK, no node-gyp required on the user's machine.

## Requirements

- Node.js 18 or newer
- macOS 13.0+ on Apple Silicon **or** Windows 10/11 x64
- Screen Recording permission granted in System Settings (macOS only — the OS will prompt on first run)

## Installation

```sh
npm install screenwire
```

No native compilation happens during install. The prebuilt `.node` addon and all native dependencies are bundled with the package.

## Usage

### Async / await (recommended)

```js
const recorder = require('screenwire')
const path = require('path')

const outputPath = path.join(require('os').homedir(), 'Desktop', 'recording.mp4')
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function main() {
  await recorder.startAsync(outputPath)

  await sleep(5000)

  const status = await recorder.stopAsync()
  console.log(status) // "Saved recording to /Users/.../recording.mp4"
}

main()
```

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
    console.log('[done]', status)
  })
}, 5000)
```

## API

#### `recorder.startAsync(outputPath) → Promise<string>`

Starts recording to the given `.mp4` file path. Resolves once recording is active.

#### `recorder.stopAsync() → Promise<string>`

Stops recording and finalizes the file. Resolves with the final status string once the file is saved.

#### `recorder.start(outputPath, onStatus)`

Callback version of `startAsync`. `onStatus(message)` is called with progress strings as recording proceeds.

#### `recorder.stop(onStatus)`

Callback version of `stopAsync`. `onStatus(message)` is called with the final status string.

#### `recorder.isRecording()`

Returns `true` if a recording is currently in progress.

## Status strings

| String | Meaning |
|---|---|
| `"Checking permissions..."` | Verifying screen recording permission (macOS) |
| `"Preparing screen capture..."` | Setting up the capture pipeline |
| `"Recording to /path/file.mp4"` | Recording is active |
| `"Stopping recording..."` | Stop called, finalizing the file |
| `"Saved recording to /path/file.mp4"` | File successfully written |

## Platform notes

**macOS** captures screen, system audio, and microphone using ScreenCaptureKit. The OS will show a permission prompt on first use — grant Screen Recording access to your terminal or app in System Settings → Privacy & Security.

**Windows** captures screen via GDI/ffmpeg and system audio via direct WASAPI loopback COM P/Invoke. Microphone is captured via NAudio if a device is present. All native DLLs and ffmpeg are bundled inside the package.

## License

MIT — built and maintained by [BreakingPoint](https://breakingpoint.ro)
