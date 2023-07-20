import { logi,logw } from "./logger.js";
import Members = Java.Members;
import Wrapper = Java.Wrapper;

type MethodImplementation<This extends Members<This> = {}> = (this: Wrapper<This>, ...params: any[]) => any;

export interface JavaFunctions {
    class: string,
    method: string,
    implementation: MethodImplementation;
}

export function hook_java(fns: JavaFunctions[]) {
    if (Java.available) {
        Java.perform(() => {
            // logi("hook_java enter");
            fns.forEach((hook) => {
                let method = Java.use(hook.class)[hook.method];
                method.implementation = hook.implementation;
                logw(`hook class:${hook.class}, ${hook.method} ok!`);
            });
            // logi("hook_java leave");
        })
    }
}
