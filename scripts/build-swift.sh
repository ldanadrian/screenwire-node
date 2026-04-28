#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BINDING_DIR="$(dirname "$SCRIPT_DIR")"
CORE_MAC="$BINDING_DIR/../../core/mac"
BUILDS_DIR="$BINDING_DIR/builds"
BUILD_DIR="$BUILDS_DIR/macos"
MODULE_CACHE_DIR="$BINDING_DIR/.swift-module-cache"

mkdir -p "$BUILDS_DIR"
mkdir -p "$BUILD_DIR"
mkdir -p "$MODULE_CACHE_DIR"

SDK=$(xcrun --show-sdk-path --sdk macosx)
ARCH=$(uname -m)
TARGET="${ARCH}-apple-macosx13.0"

echo "Building ScreenWireCore Swift library for $TARGET..."

swiftc \
  -module-name ScreenWireCore \
  -module-cache-path "$MODULE_CACHE_DIR" \
  -emit-module \
  -emit-module-path "$BUILD_DIR/ScreenWireCore.swiftmodule" \
  -emit-objc-header \
  -emit-objc-header-path "$BUILD_DIR/ScreenWireCore-Swift.h" \
  -emit-library \
  -o "$BUILD_DIR/libScreenWireCore.dylib" \
  -target "$TARGET" \
  -sdk "$SDK" \
  "$CORE_MAC/Recorder.swift"

echo "Done: $BUILD_DIR/libScreenWireCore.dylib"
