import {info} from "./logger.js";
import {hook_dlopen, hook_libart, log_tag, NativeFunction, stack_trace} from "./jni.js";
import {hook_java, JavaFunctions} from "./java.js";

const native_so = "libhello-jni.so";

const native_functions: NativeFunction[] = [
    {
        so: "libmyjni.so",
        targets: [
            {
                type: "export",
                label: "n2",
                onEnter: function (args) {
                    this.tag = log_tag();
                    info(`${this.tag} n2 entry`);
                    info(stack_trace(this.context, this.tag));
                    info(`${this.tag} n2 --args:${args[0]}, ${args[1]}, ${args[2]}`);
                },
                onLeave: function (retval) {
                    info(`${this.tag} n2 --return: ${retval}`);
                    info(`${this.tag} n2 leave`);
                }
            },
            {
                type: "offset",
                label: 0x000013B1, // 如果是32位的so，这里需要先+1
                onEnter: function () {
                    this.tag = log_tag();
                    info(`${this.tag} n1 entry`);
                    info(stack_trace(this.context, this.tag));
                },
                onLeave: function (retval) {
                    info(`${this.tag} n1 --return: ${retval}`);
                    info(`${this.tag} n1 leave`);
                }
            }
        ],
    }
];

const java_functions: JavaFunctions[] = [
    {
        class: "com.example.hellojni.HelloJni",
        method: "sign1",
        impl: function (str) {
            let tag = log_tag();
            info(`${tag} HelloJni.sign1 entry`);
            let retval = this["sign1"](str);
            info(`${tag} HelloJni.sign1--args: ${str} --retval: ${retval}`);
            info(`${tag} HelloJni.sign1 leave`);
            return retval;
        }
    }
];

setImmediate(() => {
    hook_libart(native_so);
    hook_dlopen(native_functions);
    hook_java(java_functions);
});
