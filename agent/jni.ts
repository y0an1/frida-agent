import {loge, logi, logw} from "./logger.js";


var libc_system_fptr: NativeFunction<number, [NativePointerValue]> | null = null;
var libc_fopen_fptr: NativeFunction<NativePointer, [NativePointerValue, NativePointerValue]> | null = null;
var libc_fread_fptr: NativeFunction<number, [NativePointerValue, number, number, NativePointerValue]> | null = null;

export function dumpLua(buff: NativePointer, size: number, name: string, save_dir:string) {
    let ptr = null;
    if (libc_system_fptr == null) {
        ptr = Module.findExportByName("libc.so", "system");
        if (ptr) libc_system_fptr = new NativeFunction(ptr, 'int', ['pointer']);
    }
    if (libc_fopen_fptr == null) {
        ptr = Module.findExportByName("libc.so", "fopen");
        if (ptr) libc_fopen_fptr = new NativeFunction(ptr, 'pointer', ['pointer', 'pointer']);
    }
    if (libc_fread_fptr == null) {
        ptr = Module.findExportByName("libc.so", "fread");
        if (ptr) libc_fread_fptr = new NativeFunction(ptr, 'long', ['pointer', 'long', 'long', 'pointer']);
    }

    let save_path = save_dir;
    let path_arr = name.split("/");
    for (let i = 0; i < path_arr.length - 1; ++i) {
        save_path = save_path + path_arr[i] + "/";
    }
    console.log('save path:', save_path)

    let native_str = Memory.allocUtf8String("mkdir -p " + save_path)
    console.log(`native_str:${native_str}`);
    if (libc_system_fptr) {
        libc_system_fptr(native_str);
        let file_name = save_dir + name + ".lua";
        let file_handle = new File(file_name, "wb+");
        if (file_handle && file_handle != null) {
            let script_data = buff.readByteArray(size);
            if (script_data) {
                file_handle.write(script_data);
            }
            file_handle.close();
            console.log("[save]:", file_name);
        }
        console.log("------------------------------------");
    }
}

export function log_tag(): string {
    return `[${Process.getCurrentThreadId()}] [${new Date().getTime()}]`;
}

export function stack_trace(context: CpuContext, tag: string): string {
    let content = Thread.backtrace(context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join('\n');
    return `\r\n${tag} =========================================\r\n${content}\r\n${tag}=========================================`;
}

export interface MyNativeFunction {
    so: string,
    targets: NativeHookStruct[]
}

export interface NativeHookStruct {
    onEnter: (this: InvocationContext, args: InvocationArguments) => void,
    mode: string,
    type: string |number,
    onLeave: (this: InvocationContext, retval: InvocationReturnValue) => void
}


export function hook_native(native_functions: MyNativeFunction[]) {
    let dlopen = Module.findExportByName(null, "dlopen");
    if (dlopen == null) {
        logw("dlopen is null");
        return;
    }

    let android_dlopen_ext = Module.findExportByName(null, "android_dlopen_ext");
    if (android_dlopen_ext == null) {
        logw("android_dlopen_ext is null");
        return;
    }

    Interceptor.attach(dlopen, {
        onEnter: function (args) {
            this.index = -1;
            let so = args[0].readCString();
            native_functions.forEach((hook, index) => {
                if (-1 !== so?.indexOf(hook.so)) {
                    logi(`dlopen catch:${so}`);
                    this.index = index;
                }
            });
        },
        onLeave: function (retval) {
            if (this.index !== -1) {
                logi(`dlopen--return: ${retval}`);
                hook(this.index);
            }
            return retval;
        }
    });

    Interceptor.attach(android_dlopen_ext, {
        onEnter: function (args) {
            this.index = -1;
            let so = args[0].readCString();
            native_functions.forEach((hook, index) => {
                if (-1 !== so?.indexOf(hook.so)) {
                    logi(`android_dlopen_ext catch:${so}`);
                    this.index = index;
                }
            });
        },
        onLeave: function (retval) {
            if (this.index !== -1) {
                logi(`android_dlopen_ext --return: ${retval}`);
                hook(this.index);
            }
            return retval;
        }
    });

    function hook(index: number) {
        if (index >= native_functions.length) {
            logw(`hook:${index} is out of range`);
            return;
        }
        // 读取指定的元素
        let hook = native_functions[index];
        logi(`hook:${hook.so}, count:${hook.targets.length}`);
        // 遍历数组
        for (let i = 0; i < hook.targets.length; i++) {
            let target = hook.targets[i];
            // 判断type
            switch (target.mode) {
                case "function":
                    hook_function(hook.so, <string>target.type, target.onEnter, target.onLeave);
                    break;
                case "offset": // 如果是32位的so，这里需要先+1
                    hook_offset(hook.so, <number>target.type, target.onEnter, target.onLeave);
                    break;
                default:
                    logw(`hook: array[${i}] type is not support`);
                    break;
            }
        }
    }

    function hook_function(so: string, label: string, onEnter: ((args: any) => void) | (() => void), onLeave: (retval: any) => any) {
        let addr = Module.findExportByName(so, label);
        logi(`hook_function: ${so}:${Module.findBaseAddress(so)}, ${label}:${addr}`);
        if (addr != null) {
            hook_attach(addr, onEnter, onLeave);
        }
    }

    function hook_offset(so: string, label: number, onEnter: ((args: any) => void) | (() => void), onLeave: (retval: any) => any) {
        let base = Module.findBaseAddress(so);
        if (base == null) {
            logw(`hook_offset:${so} is null`);
            return;
        }
        let offset = label | 0x1;

        let addr = base.add(ptr(label).sub(offset));
        logi(`hook_offset: ${so}:${base},${label}:${addr}`);
        hook_attach(addr.add(offset), onEnter, onLeave);
    }

    function hook_attach(addr: NativePointerValue, onEnter: ((args: any) => void) | null, onLeave: ((retval: any) => any) | null) {
        if (onEnter != null && onLeave != null) {
            Interceptor.attach(addr, {
                onEnter: onEnter,
                onLeave: onLeave
            });
        } else if (onEnter != null) {
            Interceptor.attach(addr, {
                onEnter: onEnter,
            });
        } else if (onLeave != null) {
            Interceptor.attach(addr, {
                onLeave: onLeave
            });
        }
    }
}


export function hook_libart(so_name: string | null) {
    function RegisterNativesImpl(addr: NativePointerValue) {
        Interceptor.attach(addr, {
            onEnter: function (args) {
                let clazz = Java.vm.tryGetEnv().getClassName(args[1]);
                let methods = args[2];
                let count = args[3].toInt32();
                let tag = log_tag();
                loge(stack_trace(this.context, tag));
                for (let i = 0; i < count; i++) {
                    let offset = i * Process.pointerSize * count;
                    let name = methods.add(offset).readPointer().readCString();
                    let addr = methods.add(offset + Process.pointerSize).readPointer();
                    let pfn = methods.add(offset + Process.pointerSize * 2).readPointer();
                    let module_so = Process.findModuleByAddress(pfn);
                    (module_so != null)
                        ? logi(`${tag} ${module_so.name}: class:${clazz}, method:${name}, addr:${addr}, pfn: ${pfn.sub(module_so.base)}`)
                        : logi(`${tag} class:${clazz}, method:${name}, addr:${addr}, pfn:${pfn}`);
                }
            }
        });
    }

    function GetStringUTFCharsImpl(addr: NativePointerValue) {
        Interceptor.attach(addr, {
            onLeave: function (retval) {
                let module = Process.findModuleByAddress(this.returnAddress);
                if (module != null && module.name === so_name) {
                    logi(`${log_tag()} GetStringUTFChars --retval:${retval.readCString()}，returnAddress:${this.returnAddress.sub(module.base)}`);
                }
            }
        });
    }

    function NewStringUTFImpl(addr: NativePointerValue) {
        Interceptor.attach(addr, {
            onEnter: function (args) {
                let module = Process.findModuleByAddress(this.returnAddress);
                if (module != null && module.name === so_name) {
                    logi(`${log_tag()} NewStringUTF --args:${args[1].readCString()}, returnAddress:${this.returnAddress.sub(module.base)}`);
                }
            }
        });
    }

    let libart = Process.findModuleByName("libart.so");
    if (libart != null) {
        libart.enumerateSymbols().forEach((symbol) => {
            let name = symbol.name;
            let addr = symbol.address;
            if (name.indexOf("JNIILb0") !== -1) {
                if (name.indexOf("RegisterNatives") !== -1) {
                    RegisterNativesImpl(addr);
                } else if (name.indexOf("GetStringUTFChars") !== -1) {
                    GetStringUTFCharsImpl(addr);
                } else if (name.indexOf("NewStringUTF") !== -1) {
                    NewStringUTFImpl(addr);
                }
            }
        });
        return;
    }
    logw(`libart.so is null`);
}