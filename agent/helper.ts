namespace Files {
    export const write = (path: string, data: any, mode: string) => {
        const file = new File(path, mode)
        console.log(`log file:${file} `)
        if (file) {
            console.log(`write log data ...`)
            file.write(data)
            file.flush()
            file.close()
            console.log(`write complete!`)
            return true
        }
        return false
    }
}

namespace Log {
    export const stack = (tag: string, context: CpuContext | null = null, path: string | null = null) => {
        Log.e(``, ` >>>>>\t${tag} \tstart`, path)
        if (context) {
            Log.i(tag, Thread.backtrace(context, Backtracer.FUZZY).map(DebugSymbol.fromAddress).join('\n'), path)
        } else {
            Java.perform(function () {
                const exception = Java.use("java.lang.Exception")
                const ins = exception.$new("Exception")
                const traces = ins['getStackTrace']()
                if (undefined !== traces) {
                    for (let i = 0; i < traces.length; i++) {
                        Log.i(tag, `\t${traces[i].toString()} `, path)
                    }
                }
                exception.$dispose()
            })
        }
        Log.e(``, ` >>>>>\t${tag} \tend`, path)
    }

    export const p = function (tag: string, msg: string, logPath: string | null = null) {
        Log.w(tag, `param-> ${msg}`, logPath)
    }

    export const r = function (tag: string, msg: string, logPath: string | null = null) {
        Log.w(tag, `return-> ${msg}`, logPath)
    }

    export const i = (tag: string, msg: string, path: string | null = null) => {
        Log.handle(1, Log.format(`info`, tag, msg), path)
    }

    export const d = (tag: string, msg: string, path: string | null = null) => {
        Log.handle(2, Log.format(`debug`, tag, msg), path)
    }

    export const w = (tag: string, msg: string, path: string | null = null) => {
        Log.handle(3, Log.format(`warn`, tag, msg), path)
    }

    export const e = (tag: string, msg: string, path: string | null = null) => {
        Log.handle(4, Log.format(`error`, tag, msg), path)
    }

    export const handle = (level: number, content: string, path: string | null = null) => {
        if (path == null) {
            switch (level) {
                case 1:
                    console.log(`${content} `)
                    break
                case 2:
                    console.debug(`${content} `)
                    break
                case 3:
                    console.warn(`${content} `)
                    break
                case 4:
                    console.error(`${content} `)
                    break
                default:
                    throw new Error(`level:${level} is not support!`)
            }
        } else if (!Files.write(path, `${content} \r\n`, "a+")) {
            console.error(`${path} open failed! ===========> [Logger.handle] ${content} `)
        }
    }

    export const format = (level: string, tag: string, msg: string) => {
        return `[${Log.tagTime()} - ${Log.tagThread()} - ${level} - ${tag}] ${msg} `
    }

    export const tagThread = () => {
        return Process.getCurrentThreadId().toString()
    }

    export const tagTime = () => {
        const date = new Date()
        const hour = date.getHours()
        const _hour = (hour < 10) ? "0" + hour : hour
        const minute = date.getMinutes()
        const _minute = (minute < 10) ? "0" + minute : minute
        const second = date.getSeconds()
        const _second = (second < 10) ? "0" + second : second
        const milli_sec = date.getMilliseconds()
        const _milli_sec = (milli_sec < 10) ? "00" + milli_sec : (milli_sec < 100) ? "0" + milli_sec : milli_sec
        return _hour + ":" + _minute + ":" + _second + ":" + _milli_sec
    }
}

class Gson {
    static ins: any;

    constructor() {
        if (!Java.available) {
            throw new Error('Java is not available')
        }
        Java.perform(() => {
            Java.openClassFile("/data/local/tmp/r0gson.dex").load()
            const gson = Java.use('com.r0ysue.gson.Gson')
            Gson.ins = gson.$new()
        })
        Log.i(`Gson`, `Gson.ins:${Gson.ins}`)
    }

    toJson(obj: any): string {
        return `${obj ? Gson.ins.toJson(obj) : obj}`
    }
}

namespace FridaHook {
    export const enumClassLoaders = (logPath: string | null = null) => {
        const tag = `enumClassLoaders`
        Java.perform(function () {
            Log.i(tag, `\ncurrent - loader - ${Java.classFactory.loader}`, logPath)
            Java.enumerateClassLoaders({
                onMatch: function (loader) {
                    Log.i(tag, `find loader - ${loader}`, logPath)
                },
                onComplete: function () {
                }
            })
        })
    }

    export const enumLoaderClasses = (klass: any, logPath: string | null = null) => {
        const tag = `enumLoaderClasses`
        let find = false
        Java.perform(function () {
            Java.enumerateLoadedClasses({
                onMatch: function (arg) {
                    if (arg.indexOf(klass) !== -1) {
                        find = true
                        Log.i(tag, `find ${klass}, info - ${arg}`, logPath)
                    }
                },
                onComplete: function () {
                    if (!find) {
                        Log.e(tag, `find not ${klass}`)
                    }
                }
            })
        })
    }

    export const enumIntent = (intent: any, logPath: string | null = null) => {
        Java.perform(function () {
            const bundle = Java.cast(intent, Java.use("android.content.Intent")).getExtras()
            if (bundle != null) {
                const keys = bundle['keySet']()
                const it = keys.iterator()
                while (it['hasNext']()) {
                    const key = it.next()
                    Log.i(`FridaJava.enumIntent`, `\tintent: key - ${key}, value - ${bundle.get(key)}`, logPath)
                }
            }
        })
    }

    export const enumMap = (map: any) => {
        const tag = "FridaJava.enumMap"
        if (map != null && map.$className.indexOf("Map") !== -1) {
            const _map = Java.cast(map, Java.use(map.$className))
            Log.i(tag, `map:${_map}`)
            const entries = Java.cast(_map['entrySet'](), Java.use("java.util.Set"))
            const it = entries["iterator"]();
            const itIns = Java.cast(it, Java.use("java.util.Iterator"))
            while (itIns["hasNext"]()) {
                const entry = itIns["next"]()
                const entryIns = Java.cast(entry, Java.use("java.util.Map$Entry"))
                const key = entryIns["getKey"]()
                const value = entryIns["getValue"]()
                Log.i(tag, `key(${key.$className}):${key}, value(${value.$className}):${value}`)
            }
            return
        }
        Log.i(tag, `map is null or not Map`)
    }

    export const bytes2Hex = (bytes: any) => {
        const buffer = Java.array('byte', bytes)
        let content = "length:" + buffer.length + " content:\r\n"
        Java.perform(function () {
            const Integer = Java.use("java.lang.Integer")
            let result = ""
            for (let i = 0; i < buffer.length; i++) {
                if (i === 16) {
                    result += "\r\n"
                }
                result += "0x" + Integer.toHexString(buffer[i] & 0xFF) + "\t"
            }
            content += result
            return content
        })
    }

    export const bytes2String = (bytes: any) => {
        const buf = Java.array('byte', bytes)
        let content = ""
        for (let i = 0; i < buf.length; i++) {
            if (buf[i] >= 32 && buf[i] <= 126) {
                content += (String.fromCharCode(buf[i] & 0xff))
            } else {
                content += "."
            }
        }
        return content
    }

    export const dumpSo = (soName: string, logPath: string | null = null) => {
        const tag = `dump ${soName}.so`
        if (Java.available) {
            Log.i(tag, "Java vm true", logPath)
            Java.perform(() => {
                Log.i(tag, "dump enter", logPath)
                let currentApplication = Java.use("android.app.ActivityThread").currentApplication()
                let dir = currentApplication['getApplicationContext']()['getFilesDir']()['getPath']()
                Log.i(tag, `out dir: ${dir}`, logPath)
                let module = Process.getModuleByName(soName)
                Log.i(tag, `name - ${module.name}, base - ${module.base}, size - ${module.size}, path - ${module.path}`, logPath)
                let path = dir + "/" + module.name + "_" + module.base + "_" + ptr(module.size) + ".so"
                Memory.protect(module.base, module.size, 'rwx')
                const byteArray = module.base.readByteArray(module.size)
                if (byteArray && !Files.write(path, byteArray, "wb")) {
                    Log.e(tag, `save2file failed!`, logPath)
                } else {
                    Log.w(tag, `readByteArray failed!`, logPath)
                }
            })
            Log.i(tag, "dump leave", logPath)
        } else {
            Log.e(tag, "Java vm false", logPath)
        }
    }

    export const dumpLuaV1 = (path: string, name: string, buff: any, size: number, logPath: string | null = null) => {
        const tag = `dumpLua`
        Log.i(tag, `dump lua script: ${path + name}`, logPath)
        const buffer = buff.readByteArray(size)
        if (buffer && !Files.write(path + name, buffer, "w+")) {
            Log.e(tag, `save2file failed!`, logPath)
            return
        }
        Log.w(tag, `readByteArray failed!`, logPath)
    }

    export const dumpLuaV2 = (path: string, buff: any, size: number, logPath: string | null = null) => {
        const tag = `dumpLua2`
        let data = buff.readByteArray(size)
        if (data && !Files.write(path, data, "w+")) {
            Log.e(tag, `${path} save2file failed!`, logPath)
            return
        }
        Log.w(tag, `readByteArray failed!`, logPath)
    }

    export const traceMethod = (method: string, bTraceStack: boolean, logPath: string | null = null) => {
        const tag = `TraceMethod.${method}`
        Java.perform(function () {
            const delim = method.lastIndexOf(".")
            if (delim === -1) {
                return
            }
            const clazz = method.slice(0, delim)
            const target = method.slice(delim + 1, method.length)
            const hook = Java.use(clazz)
            const overloadCount = hook[target].overloads.length
            Log.i(tag, `traceMethod("${method}"["${overloadCount}" overload(s)]`, logPath)
            for (let i = 0; i < overloadCount; i++) {
                hook[target].overloads[i].implementation = function () {
                    const retval = this[target].apply(this, arguments)
                    Log.w(tag, `\n *** entered ${method}`, logPath)
                    for (let j = 0; j < arguments.length; j++) {
                        Log.i(tag, `arg[${j}]: ${arguments[j]}`, logPath)
                    }
                    Log.i(tag, "\nretval: " + retval, logPath)
                    Log.i(tag, `\nretval: ${retval}`, logPath)
                    FridaHook.bytes2Hex(retval)
                    if (bTraceStack) {
                        Log.stack(tag, null, logPath)
                    }
                    Log.w(tag, "\n*** exiting " + method, logPath)
                    return retval
                }
            }
        })
    }

    export const traceClass = (classes: any, logPath: string | null = null) => {
        const tag = `TraceClass.${classes}`
        Java.perform(() => {
            Java.enumerateLoadedClassesSync().forEach(function (cur) {
                classes.forEach((klass: any) => {
                    if (cur.indexOf(klass) >= 0)
                        Log.i(tag, `class name: ${cur}`, logPath)
                })
            })
        })
    }

    export const traceFunction = (funcNames: string[], logPath: string | null = null) => {
        const tag = `traceFunction.${funcNames} `
        Process.enumerateModules().forEach((module) => {
            module.enumerateExports().forEach((symbol) => {
                funcNames.forEach((func: any) => {
                    if (symbol.name.indexOf(func) >= 0)
                        Log.i(tag, `module:${JSON.stringify(module)}, symbol:${JSON.stringify(symbol)} `, logPath)
                })
            })
        })
    }

    export const traceArt = (funcName: string) => {
        let addr = null
        Process.enumerateModules()
            .filter((module) => {
                return module['path'].toLowerCase().indexOf('libart.so') !== -1
            })
            .forEach((m) => {
                // Logger.info(JSON.stringify(tag, m, null, '  '))
                let symbols = m.enumerateSymbols()
                let map = new Map()
                let fns = [
                    "GetStringUTFChars", "NewStringUTF", "FindClass", "GetMethodID",
                    "GetMethodID", "GetStaticMethodID", "GetFieldID", "GetStaticFieldID",
                    "RegisterNatives", "GetObjectClass"
                ]
                symbols.forEach((symbol) => {
                    if (symbol.name.indexOf("art") >= 0
                        && symbol.name.indexOf("JNI") >= 0
                        && symbol.name.indexOf("CheckJNI") < 0) {
                        fns.forEach((fnc) => {
                            if (symbol.name.indexOf(fnc) >= 0)
                                map.set(fnc, symbol.address)
                        })
                    }
                })
                addr = map.get(funcName)
            })
        return addr
    }

    export const traceSOConstruct = (soName: string, logPath: string | null = null): NativePointer | null => {
        const tag = `traceSOConstructors.${soName}`
        const linker = Process.pointerSize === 4 ? Process.findModuleByName("linker") : Process.findModuleByName("linker64")
        let addr = null;
        if (linker) {
            const symbols = linker.enumerateSymbols()
            Log.i(tag, `symbols:${symbols ? symbols.length : symbols}`, logPath)
            symbols.forEach(ele => {
                // if (ele.name.indexOf("call_") != -1) {
                //     Logger.info(tag, `name:${ele.name}`)
                // }
                if (ele.name.indexOf("__dl__ZN6soinfo17call_constructorsEv") !== -1
                    // || name.indexOf("__dl__ZN6soinfo26call_pre_init_constructorsEv") != -1
                    // || name.indexOf("__dl__ZNSt3__111__call_onceERVmPvPFvS2_E") != -1
                ) {
                    // Logger.info(tag, `${ele.name}:${ele.address}`)
                    addr = ele.address
                }
            })
        }
        return addr
    }
}

const gson = new Gson().toJson

export {
    gson, Log, FridaHook, Files
}