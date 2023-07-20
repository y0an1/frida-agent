import { logi } from "./logger.js";
import { hook_native, hook_libart, log_tag, MyNativeFunction, stack_trace, dumpLua } from "./jni.js";
import { hook_java, JavaFunctions } from "./java.js";

const HOOK_SO_NAME = "libtolua.so";
const LUA_SAVE_PATH = "/data/data/com.yokaverse.zzxy/lua/";

const NATIVE_FUNCS: MyNativeFunction[] = [
    {
        so: "libcocos2dlua.so",
        targets: [
            {
                mode: "function",
                type: "luaL_loadbuffer",
                onEnter: function (args) {
                    this.hook = true;
                    this.tag = log_tag() + "luaL_loadbuffer";
                    logi(`${this.tag} entry`);
                    // logi(stack_trace(this.context, this.tag));
                    const L = args[0];
                    const buff = args[1];
                    const size = args[2].toUInt32();
                    const name = args[3].readCString();
                    logi(`${this.tag} --args:${L}, ${buff}, ${size}, ${name}`);
                    if (name) {
                        dumpLua(buff, size, name, LUA_SAVE_PATH);
                    }
                    else {
                        console.error("name is null");
                    }
                },
                onLeave: function (retval) {
                    if (this.hook) {
                        logi(`${this.tag} --return: ${retval}`);
                        logi(`${this.tag} leave`);
                    }
                }
            },
            {
                mode: "function",
                type: "luaL_loadbufferx",
                onEnter: function (args) {
                    this.hook = true;
                    this.tag = log_tag() + "luaL_loadbufferx";
                    logi(`${this.tag} entry`);
                    // logi(stack_trace(this.context, this.tag));
                    const L = args[0];
                    const buff = args[1].readCString();
                    const size = args[2].toUInt32();
                    const name = args[3].readCString();
                    const mode = args[4].readCString();
                    logi(`${this.tag} --args:${L}, ${buff}, ${size}, ${name}, ${mode}`);
                    // if(buff) dumpLua(args[1], buff?.length+1, args[0].toString()+ "_buff", LUA_SAVE_PATH);
                    // if(name) dumpLua(args[1], name?.length+1, args[0].toString() + "_name", LUA_SAVE_PATH);
                },
                onLeave: function (retval) {
                    if (this.hook) {
                        logi(`${this.tag} --return: ${retval}`);
                        logi(`${this.tag} leave`);
                    }
                }
            }
        ]
    }
];

/* 重点
org.cocos2dx.sdk.NativeAgent.login(): void
    com.topsdk.user.TopSdkUserManager.login() : void
        com.topsdk.yoka.YokaSDK.login() : void
*/
const JAVA_METHODS: JavaFunctions[] = [
    {
        class: "org.cocos2dx.sdk.NativeAgent",
        method: "MTPLogin",
        // public static void MTPLogin(int v, int v1, String s, String s1)
        implementation: function (v, v1, s, s1) {
            const method = "MTPLogin";
            const tag = log_tag() + "org.cocos2dx.sdk.NativeAgent." + method;
            logi(`${tag} entry`);
            logi(`${tag} --args: ${v},${v1},${s},${s1}`);
            let retval = this[method](v, v1, s, s1);
            logi(`${tag} --retval: ${retval}`)
            logi(`${tag} leave`);
            return retval;
        }
    },
    {
        class: "org.cocos2dx.sdk.NativeAgent",
        method: "setGameEvent",
        //  public static void setGameEvent(String s)
        implementation: function (s) {
            const method = "setGameEvent";
            const tag = log_tag() + "org.cocos2dx.sdk.NativeAgent." + method;
            logi(`${tag} entry`);
            logi(`${tag} --args: ${s}`);
            this[method](s);
            logi(`${tag} leave`);
        }
    },
    {
        class: "org.cocos2dx.sdk.NativeAgent",
        method: "adTrackEvent",
        // public static void adTrackEvent(String s, String s1, String s2)
        implementation: function (s, s1, s2) {
            const method = "adTrackEvent";
            const tag = log_tag() + "org.cocos2dx.sdk.NativeAgent." + method;
            logi(`${tag} entry`);
            logi(`${tag} --args: ${s}, ${s1}, ${s2}`);
            this[method](s, s1, s2);
            logi(`${tag} leave`);
        }
    },
    {
        class: "org.cocos2dx.sdk.NativeAgent",
        method: "login",
        // public static void login()
        implementation: function () {
            const method = "login";
            const tag = log_tag() + "org.cocos2dx.sdk.NativeAgent." + method;
            logi(`${tag} entry`);
            this[method]();
            logi(`${tag} leave`);
        }
    },
    {
        class: "org.cocos2dx.sdk.NativeAgent",
        method: "AgentCallback",
        // public void AgentCallback(String s, int v, String s1)
        implementation: function (s, v, s1) {
            const method = "AgentCallback";
            const tag = log_tag() + "org.cocos2dx.sdk.NativeAgent." + method;
            logi(`${tag} entry`);
            logi(`${tag} --args: ${s}, ${v}, ${s1}`);
            this[method](s, v, s1);
            logi(`${tag} leave`);
        }
    }, {
        class: "com.topsdk.yoka.YokaSDK",
        method: "login",
        // public void login() 
        implementation: function () {
            const method = "login";
            const tag = log_tag() + "com.topsdk.yoka.YokaSDK." + method;
            logi(`--------------------${tag} entry`);
            this[method]();
            logi(`--------------------${tag} leave`);
        }
    }
];

setImmediate(() => {
    // hook_libart(HOOK_SO_NAME);
    hook_native(NATIVE_FUNCS);
    hook_java(JAVA_METHODS);
});
