{
  "targets": [{
    "target_name": "screenwire",
    "sources": [
      "src/binding.cc"
    ],
    "include_dirs": [
      "<(module_root_dir)/../../core/common",
      "<!@(node -p \"require('node-addon-api').include\")"
    ],
    "defines": ["NAPI_DISABLE_CPP_EXCEPTIONS"],
    "conditions": [
      ["OS==\"mac\"", {
        "sources": [
          "../../core/mac/RecorderBridge.mm"
        ],
        "include_dirs": [
          "<(module_root_dir)/builds/macos"
        ],
        "libraries": [
          "<(module_root_dir)/builds/macos/libScreenWireCore.dylib",
          "-framework ScreenCaptureKit",
          "-framework AVFoundation",
          "-framework CoreMedia",
          "-framework AppKit",
          "-framework CoreGraphics"
        ],
        "xcode_settings": {
          "CLANG_ENABLE_OBJC_ARC": "YES",
          "MACOSX_DEPLOYMENT_TARGET": "13.0",
          "OTHER_CPLUSPLUSFLAGS": ["-std=c++17", "-stdlib=libc++"],
          "OTHER_LDFLAGS": [
            "-rpath @loader_path",
            "-rpath @loader_path/../..",
            "-Wl,-reexport_library,<(module_root_dir)/builds/macos/libScreenWireCore.dylib"
          ]
        }
      }],
      ["OS==\"win\"", {
        "sources": [
          "../../core/windows/RecorderBridge.cc"
        ],
        "defines": [
          "NOMINMAX",
          "WIN32_LEAN_AND_MEAN"
        ]
      }]
    ]
  }]
}
