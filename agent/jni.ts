import {err, info, warn} from "./logger.js";


export function log_tag(): string {
    return `[${Process.getCurrentThreadId()}] [${new Date().getTime()}]`;
}

export function stack_trace(context: CpuContext, tag: string): string {
    let content = Thread.backtrace(context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join('\n');
    return `\r\n${tag} =========================================\r\n${content}\r\n${tag}=========================================`;
}


export interface NativeFunction {
    so: string,
    targets: [{
        onEnter: (this: InvocationContext, args: InvocationArguments) => void,
        label: string,
        type: string,
        onLeave: (this: InvocationContext, retval: InvocationReturnValue) => void
    }, {
        onEnter: (this: InvocationContext, args: InvocationArguments) => void,
        label: number,
        type: string,
        onLeave: (this: InvocationContext, retval: InvocationReturnValue) => void
    }]
}


export function hook_dlopen(native_functions: NativeFunction[]) {
    let dlopen = Module.findExportByName(null, "dlopen");
    if (dlopen == null) {
        warn("dlopen is null");
        return;
    }

    let android_dlopen_ext = Module.findExportByName(null, "android_dlopen_ext");
    if (android_dlopen_ext == null) {
        warn("android_dlopen_ext is null");
        return;
    }

    Interceptor.attach(dlopen, {
        onEnter: function (args) {
            this.index = -1;
            let so = args[0].readCString();
            native_functions.forEach((hook, index) => {
                if (-1 !== so?.indexOf(hook.so)) {
                    info(`dlopen catch:${so}`);
                    this.index = index;
                }
            });
        },
        onLeave: function (retval) {
            if (this.index !== -1) {
                info(`dlopen--return: ${retval}`);
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
                    info(`android_dlopen_ext catch:${so}`);
                    this.index = index;
                }
            });
        },
        onLeave: function (retval) {
            if (this.index !== -1) {
                info(`android_dlopen_ext--return: ${retval}`);
                hook(this.index);
            }
            return retval;
        }
    });

    function hook(index: number) {
        if (index >= native_functions.length) {
            warn(`hook:${index} is out of range`);
            return;
        }
        // 读取指定的元素
        let hook = native_functions[index];
        info(`hook:${hook.so}, ${hook.targets.length}`);
        // 遍历数组
        for (let i = 0; i < hook.targets.length; i++) {
            let target = hook.targets[i];
            // 判断type
            switch (target.type) {
                case "export":
                    hook_export_functions(hook.so, <string>target.label, target.onEnter, target.onLeave);
                    break;
                case "offset":
                    hook_offset_functions(hook.so, <number>target.label, target.onEnter, target.onLeave);
                    break;
                default:
                    warn(`hook: array[${i}] type is not support`);
                    break;
            }
        }
    }

    function hook_export_functions(so: string, label: string, onEnter: ((args: any) => void) | (() => void), onLeave: (retval: any) => any) {
        let addr = Module.findExportByName(so, label);
        info(`hook_export_functions: ${label}:${addr}`);
        if (addr != null) {
            hook_attach(addr, onEnter, onLeave);
        }
    }

    function hook_offset_functions(so: string, label: number, onEnter: ((args: any) => void) | (() => void), onLeave: (retval: any) => any) {
        let base = Module.findBaseAddress(so);
        if (base == null) {
            warn(`hook_offset_functions:${so} is null`);
            return;
        }
        let offset = label | 0x1;

        let addr = base.add(ptr(label).sub(offset));
        info(`hook_offset_functions: ${label}:${addr}`);
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
                err(stack_trace(this.context, tag));
                for (let i = 0; i < count; i++) {
                    let offset = i * Process.pointerSize * count;
                    let name = methods.add(offset).readPointer().readCString();
                    let addr = methods.add(offset + Process.pointerSize).readPointer();
                    let pfn = methods.add(offset + Process.pointerSize * 2).readPointer();
                    let module_so = Process.findModuleByAddress(pfn);
                    (module_so != null)
                        ? info(`${tag} ${module_so.name}: class:${clazz}, method:${name}, addr:${addr}, pfn: ${pfn.sub(module_so.base)}`)
                        : info(`${tag} class:${clazz}, method:${name}, addr:${addr}, pfn:${pfn}`);
                }
            }
        });
    }

    function GetStringUTFCharsImpl(addr: NativePointerValue) {
        Interceptor.attach(addr, {
            onLeave: function (retval) {
                let module = Process.findModuleByAddress(this.returnAddress);
                if (module != null && module.name === so_name) {
                    info(`${log_tag()} GetStringUTFChars --retval:${retval.readCString()}，returnAddress:${this.returnAddress.sub(module.base)}`);
                }
            }
        });
    }

    function NewStringUTFImpl(addr: NativePointerValue) {
        Interceptor.attach(addr, {
            onEnter: function (args) {
                let module = Process.findModuleByAddress(this.returnAddress);
                if (module != null && module.name === so_name) {
                    info(`${log_tag()} NewStringUTF --args:${args[1].readCString()}, returnAddress:${this.returnAddress.sub(module.base)}`);
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
    warn(`libart.so is null`);
}