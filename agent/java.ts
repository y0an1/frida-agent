import Members = Java.Members;
import Wrapper = Java.Wrapper;

type MethodImplementation<This extends Members<This> = {}> = (this: Wrapper<This>, ...params: any[]) => any;

export interface JavaFunctions {
    class: string,
    method: string,
    impl: MethodImplementation;
}

export function hook_java(fns: JavaFunctions[]) {
    if (Java.available) {
        Java.perform(() => {
            fns.forEach((hook) => {
                let method = Java.use(hook.class)[hook.method];
                method.implementation = hook.impl;
            });
        })
    }
}
