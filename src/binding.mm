#include <napi.h>
#import "RecorderBridge.h"

static Napi::ThreadSafeFunction g_tsfn;

static void forwardStatus(const char* status) {
    if (!g_tsfn) return;
    std::string s(status);
    g_tsfn.NonBlockingCall([s](Napi::Env env, Napi::Function cb) {
        cb.Call({ Napi::String::New(env, s) });
    });
}

// start(outputPath, callback)
Napi::Value Start(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 2 || !info[0].IsString() || !info[1].IsFunction()) {
        Napi::TypeError::New(env, "expected (string, function)").ThrowAsJavaScriptException();
        return env.Undefined();
    }
    if (g_tsfn) g_tsfn.Release();
    g_tsfn = Napi::ThreadSafeFunction::New(env, info[1].As<Napi::Function>(), "screenwire", 0, 1);
    screenwire_start(info[0].As<Napi::String>().Utf8Value().c_str(), forwardStatus);
    return env.Undefined();
}

// stop(callback)
Napi::Value Stop(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsFunction()) {
        Napi::TypeError::New(env, "expected (function)").ThrowAsJavaScriptException();
        return env.Undefined();
    }
    if (g_tsfn) g_tsfn.Release();
    g_tsfn = Napi::ThreadSafeFunction::New(env, info[0].As<Napi::Function>(), "screenwire", 0, 1);
    screenwire_stop(forwardStatus);
    return env.Undefined();
}

Napi::Value IsRecording(const Napi::CallbackInfo& info) {
    return Napi::Boolean::New(info.Env(), screenwire_is_recording() != 0);
}

Napi::Value Unref(const Napi::CallbackInfo& info) {
    if (g_tsfn) g_tsfn.Unref(info.Env());
    return info.Env().Undefined();
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("start",       Napi::Function::New(env, Start));
    exports.Set("stop",        Napi::Function::New(env, Stop));
    exports.Set("isRecording", Napi::Function::New(env, IsRecording));
    exports.Set("unref",       Napi::Function::New(env, Unref));
    return exports;
}

NODE_API_MODULE(screenwire, Init)
