import { gson, Log, FridaHook } from "./helper.js"

let hook_so = "libpqul.so"
let time = 0
let method = ""
let g_authSessionID = ""

// global.iRpc = class RPC {
//     static call_aes_gcm_nopadding() {
//         const tag = "call_aes_gcm_nopadding"
//         Java.perform(function () {
//             const aes = Java.array('byte', [4, -23, 8, -72, 114, -7, 27, -15, -61, -59, -124, -72, -51, 30, 69, -93, -75, 48, -28, -72, -106, -89, 37, -5, -115, 41, -52, -109, -25, 49, 27, -26])
//             const gcm = Java.array('byte', [0, 0, 0, 0, 0, 0, 0, 29, 104, -91, 35, 54])
//             const aad = Java.array('byte', [117, 102, 53, 50, 55, 51, 56, 49, 52, 54, 97, 51, 51, 98, 57, 100, 97, 97, 101, 101, 52, 101, 49, 100, 48, 48, 48, 51, 50, 101, 100, 98, 48, 117, 50, 97, 56, 97, 56, 55, 50, 49, 49, 55, 51, 48, 55, 102, 101, 98, 56, 102, 57, 50, 51, 100, 49, 48, 54, 55, 56, 100, 100, 52, 54, 53, 0, 69, -93, -108, 0, 69, -76, 88, 0, 0, 0, 2, 0, 0, 0, 0])
//             const text = Java.array('byte', [123, 34, 116, 101, 120, 116, 34, 58, 34, 104, 101, 108, 108, 111, 34, 125])
//             const secretKeySpec = Java.use('javax.crypto.spec.SecretKeySpec').$new(aes, "AES")
//             Log.i(tag, `secretKeySpec:${secretKeySpec}`)
//             const gCMParameterSpec = Java.use('javax.crypto.spec.GCMParameterSpec').$new(128, gcm)
//             Log.i(tag, `gCMParameterSpec:${gCMParameterSpec}`)
//             const cipher = Java.use("javax.crypto.Cipher")['getInstance']("AES/GCM/NoPadding")
//             Log.i(tag, `cipher:${cipher}`)
//             cipher['init'](1, secretKeySpec, gCMParameterSpec)
//             cipher['updateAAD'](aad)
//             let r = cipher['doFinal'](text)
//             Log.i(tag, `r:${gson(r)}`)
//             // r:RTiACE1Izz02UxsZnvmBlY3ypuUOkrdWKC5/U8OJYkxtXdyr4R2BBx5dQ3X6SfN1
//         })
//     }

//     static call_encrypted() {
//         const tag = "call_encrypted"
//         Java.perform(function () {
//             const privateKey = Java.array('byte', [0x68, 0xb6, 0x57, 0x04, 0xeb, 0x86, 0x4e, 0x42, 0x2c, 0x62, 0x02, 0x1a, 0x4f, 0xb9, 0x26, 0x8d, 0x9c, 0x71, 0xc2, 0xe0, 0x15, 0xae, 0x9d, 0x27, 0x1d, 0x4f, 0x70, 0xe4, 0x05, 0xd8, 0x98, 0x6a])
//             const nonce = Java.array('byte', [0x87, 0x66, 0xa4, 0x84, 0x67, 0xe2, 0xef, 0x3d, 0xfe, 0x31, 0x46, 0x89, 0x45, 0x69, 0x6e, 0xef])
//             const exchangeKey = Java.array('byte', [0x2d, 0xb5, 0x30, 0xfe, 0x72, 0x2d, 0x70, 0x4e, 0x53, 0x18, 0x7d, 0x28, 0x63, 0x6d, 0x48, 0x42, 0xb9, 0x1f, 0x27, 0x92, 0xa6, 0x19, 0x95, 0xa9, 0xeb, 0x33, 0x04, 0x00, 0x7f, 0x96, 0x23, 0x35])
//             const exchangeNonce = Java.array('byte', [0xf6, 0xb6, 0x8a, 0xee, 0x10, 0xcb, 0x70, 0x94, 0x6b, 0xde, 0x3e, 0x58, 0xb9, 0x34, 0xb7, 0xc9])
//             const password = "Aa654321"
//             let vl0 = Java.use("com.google.android.gms.internal.ads.vl0")
//             let r = vl0['q'](privateKey, nonce, exchangeKey, exchangeNonce, password)
//             Log.i(tag, `r:${r}`)
//             // r:RTiACE1Izz02UxsZnvmBlY3ypuUOkrdWKC5/U8OJYkxtXdyr4R2BBx5dQ3X6SfN1
//         })
//     }

//     static call_key_pair() {
//         const tag = `call_key_pair`
//         Java.perform(() => {
//             let c = Java.use("i85.c")
//             let r = c["e"]()
//             let ins = Java.cast(r, Java.use("i85.c$a"))
//             Log.w(tag, `ins:${gson(ins)}`)
//             let pubKey = ins['a'].value
//             let priKey = ins['b'].value
//             Log.i(tag, `pubKey${pubKey.length}:${pubKey}`)
//             Log.i(tag, `priKey${priKey.length}:${priKey}`)
//         })
//     }

//     static call_base64_decode() {
//         const tag = `call_base64_decode`
//         Java.perform(() => {
//             let Base64 = Java.use("android.util.Base64")
//             let r = Base64['decode']("A/C0HeovB0F8ni/vimwPYA03U+h9YYH6HTpM9uChr2Q=", 2)
//             Log.i(tag, `r:${r}`)
//         })
//     }

//     static call_exchange_key_calc() {
//         const tag = "call_exchange_key_calc"
//         Java.perform(() => {
//             const Security = Java.use("i85.c")
//             const pubKey = Java.array('byte', [0, -55, -104, 94, 39, -115, 47, -113, 97, -106, 14, 80, 42, -33, -27, -80, -55, 123, -120, 63, 51, -113, -1, -97, -60, -116, -17, -5, -66, 30, -69, 95])
//             const priKey = Java.array('byte', [8, 53, -107, 94, 112, -64, 101, -40, -47, 121, -14, 71, -93, -76, -81, 70, 123, -79, 65, 91, 19, 99, -14, -54, -48, 39, -101, 32, 67, -46, 14, 95])
//             let r = Security["g"](priKey, pubKey)
//             Log.i(tag, `exchange key:${r}`)
//             // -99,57,45,-60,88,-83,60,11,-50,68,24,82,124,-58,-84,-118,-66,-105,47,-3,-44,122,-75,48,95,127,21,15,92,110,70,86

//             const MessageDigest = Java.use(`java.security.MessageDigest`)
//             const ins = MessageDigest.getInstance("SHA-256")
//             ins.update(r)
//             r = ins.digest()
//             Log.i(tag, `sha256:${r}`)
//         })
//     }

//     static call_aes_cbc_pkcs7padding() {
//         const tag = "call_aes_cbc_pkcs7padding"
//         Java.perform(() => {
//             let Security = Java.use("i85.c")
//             const keySpec = Java.array('byte', [-78, 48, -5, 91, -41, -42, 78, 103, -10, -128, -80, -126, -115, 112, -13, 49])
//             const ivSpec = Java.array('byte', [-105, 64, -96, -10, 92, -81, 124, -11, 94, -54, -50, -108, 34, -115, -71, 28])
//             const algorithm = "AES/CBC/PKCS7Padding"
//             const text = Java.array('byte', [65, 97, 54, 53, 52, 51, 50, 49])
//             let r = Security["b"](keySpec, ivSpec, algorithm, text)
//             Log.i(tag, `r:${r}`)
//             // -18,122,23,95,77,65,119,40,47,17,-102,58,47,11,-51,-23
//         })
//     }

//     static call_HmacSHA256() {
//         const tag = "call_HmacSHA256"
//         Java.perform(() => {
//             //  Mac mac = Mac.getInstance("HmacSHA256")
//             const Mac = Java.use("javax.crypto.Mac")
//             const ins = Mac.getInstance("HmacSHA256")
//             const keySpec = Java.array('byte', [-40, -6, -7, 96, -55, -103, 72, -54, -22, 113, -30, -12, -69, 108, 74, -34, 83, -50, -33, -81, -37, 115, 116, 40, -2, -107, -46, -89, -95, -86, -73, -92])
//             const text = Java.array('byte', [65, 97, 54, 53, 52, 51, 50, 49])
//             // new SecretKeySpec(sha2563, "HmacSHA256")
//             const SecretKeySpec = Java.use("javax.crypto.spec.SecretKeySpec")
//             const key = SecretKeySpec.$new(keySpec, "HmacSHA256")
//             Log.i(tag, `key:${key}`)
//             ins.init(key)
//             let r = ins['doFinal'](text)
//             Log.i(tag, `r:${r}`)
//             //r:44,8,-7,15,24,51,-37,25,84,5,-6,114,115,34,39,98,-16,-75,83,44,39,-39,90,66,-59,117,-2,-36,-63,71,-21,125
//         })
//     }

//     static call_getTalkServiceClientImpl() {
//         const tag = `jb5.x`
//         Java.perform(() => {
//             const x = Java.use("jb5.x")
//             const r = x["e"]()
//             Log.i(tag, `r:${r ? r.$className : r}`)
//         })
//     }

//     static call_encryptedAuthToken() {
//         const authToken = "u4847a3534bfdcbb4a5aa5c2f9741e8aa:ITjp2n8RKQZeSkd6gdEL";
//         const p4 = Java.use("com.google.android.gms.internal.vision.p4")
//         const r = p4['l'](authToken)
//         Log.r("call_encryptedAuthToken", `${r}`)
//     }
// };

function AntiAntiFrida() {
    start()
    function start() {
        const tag = `AntiAntiFrida.start`
        let addr = FridaHook.traceSOConstruct(hook_so);
        if (addr != null) {
            Interceptor.attach(addr, {
                onEnter() {
                    let so = Process.findModuleByName(hook_so)
                    // Log.i(tag, `${hook_so}:${so ? so.base : so}`)
                    if (so?.base) {
                        if (time === 0) {
                            let symbols = so.enumerateSymbols()
                            symbols.forEach(ele => {
                                if (ele.name.indexOf('startAntiFridaEv') !== -1) {
                                    // Log.i(tag, `${ele.name}:${addr}`)
                                    // mss::core::security::DebuggingService::startAntiFrida()
                                    // let startAntiFrida = new NativeFunction(addr, 'void', ['void'])
                                    Interceptor.replace(ele.address, new NativeCallback(() => {
                                        Log.i(tag, `patch startAntiFrida`)
                                    }, 'void', []))
                                }
                            })
                            time++
                        }
                    }
                },
                onLeave() {
                },
            })
        } else {
            throw new Error(`traceSOConstructors failed!`)
        }
        // const linker = Process.pointerSize === 4 ? Process.findModuleByName("linker") : Process.findModuleByName("linker64")
        // // Log.i(tag, `linker:${linker ? linker.name : linker}`)
        // if (linker) {
        //     const symbols = linker.enumerateSymbols()
        //     // Log.i(tag, `symbols:${symbols ? symbols.length : symbols}`)
        //     symbols.forEach(ele => {
        //         // if (ele.name.indexOf("call_") != -1) {
        //         //     Log.i(tag, `name:${ele.name}`)
        //         // }
        //         if (ele.name.indexOf("__dl__ZN6soinfo17call_constructorsEv") !== -1
        //             // || name.indexOf("__dl__ZN6soinfo26call_pre_init_constructorsEv") != -1
        //             // || name.indexOf("__dl__ZNSt3__111__call_onceERVmPvPFvS2_E") != -1
        //         ) {
        //             // Log.i(tag, `${ele.name}:${ele.address}`)
        //             hook()
        //         }

        //         function hook() {
        //             Interceptor.attach(ele.address, {
        //                 onEnter() {
        //                     let so = Process.findModuleByName(hook_so)
        //                     // Log.i(tag, `${hook_so}:${so ? so.base : so}`)
        //                     if (so?.base) {
        //                         if (time === 0) {
        //                             let symbols = so.enumerateSymbols()
        //                             symbols.forEach(ele => {
        //                                 if (ele.name.indexOf('startAntiFridaEv') !== -1) {
        //                                     // Log.i(tag, `${ele.name}:${ele.address}`)
        //                                     // mss::core::security::DebuggingService::startAntiFrida()
        //                                     // let startAntiFrida = new NativeFunction(ele.address, 'void', ['void'])
        //                                     Interceptor.replace(ele.address, new NativeCallback(() => {
        //                                         Log.i(tag, `patch startAntiFrida`)
        //                                     }, 'void', []))
        //                                 }
        //                             })
        //                             time++
        //                         }
        //                     }
        //                 },
        //                 onLeave() {
        //                 },
        //             })
        //         }
        //     })
        // }
    }
}

class FridaScript {
    static LineRegister() {
        // openSession()
        // exchangeEncryptionKey()
        setPassword()
        // b74()
        // w64()

        function w64() {
            Event()

            // 抓取 /tr/event 的数据
            function Event() {
                let b = Java.use("w64.e$b")
                b["a"].implementation = function (content: any) {
                    const tag = "Event.handleData"
                    Log.i(tag, `enter`)
                    Log.p(tag, `content: ${gson(content)}`)
                    // Log.stack(tag)
                    this["a"](content)
                    Log.i(tag, `leave`)
                }
            }
        }

        function b74() {
            HttpRequest()
            HttpError()

            function HttpRequest() {
                const HttpRequest = Java.use("b74.b")
                HttpRequest['$init'].implementation = function (urlHost, urlPath, headers, content) {
                    const tag = "HttpRequest.$init"
                    Log.i(tag, `enter`)
                    Log.p(tag, `urlHost:${urlHost}`)
                    Log.p(tag, `urlPath:${urlPath}`)
                    Log.p(tag, `headers:${headers}`)
                    Log.p(tag, `content:${content}`)
                    // Log.stack(tag)
                    this['$init'](urlHost, urlPath, headers, content)
                    Log.i(tag, `leave`)
                }
                HttpRequest['a'].implementation = function () {
                    const tag = "HttpRequest.deflater"
                    Log.i(tag, `enter`)
                    // Log.stack(tag)
                    this['a']()
                    Log.i(tag, `leave`)
                }
            }

            function HttpError() {
                const HttpError = Java.use("b74.c")
                HttpError['$init'].overload('int', 'java.util.Map', 'java.lang.String').implementation = function (code, header, message) {
                    const tag = "HttpError.$init"
                    Log.i(tag, `enter`)
                    Log.p(tag, `code:${code}`)
                    Log.p(tag, `header:${gson(header)}`)
                    Log.p(tag, `message:${message}`)
                    // Log.stack(tag)
                    this['$init'](code, header, message)
                    Log.i(tag, `leave`)
                }
            }
        }

        function setPassword() {
            // a()
            // ClientExchangeKey()
            vl0()
            // ArrayUtils()

            function a() {
                const a = Java.use("i85.a")
                a["b"].implementation = function (out: any, p1: any, p2: any) {
                    const tag = "i85.a.b"
                    Log.i(tag, `enter`)
                    Log.p(tag, `out:${out}`)
                    Log.p(tag, `p1:${p1}`)
                    Log.p(tag, `p2:${p2}`)
                    // Log.stack(tag)
                    this["b"](out, p1, p2)
                    Log.r(tag, `out:${gson(out)}`)
                    Log.i(tag, `leave`)
                }
            }

            function ClientExchangeKey() {
                const ClientExchangeKey = Java.use("gy3.g")
                ClientExchangeKey["a"].implementation = function (clientKeys: any, rawPassword: any, serverExchangeKey: any) {
                    const tag = "ClientExchangeKey.encrypted"
                    Log.p(tag, `clientKeys: ${gson(clientKeys)}`)
                    Log.p(tag, `rawPassword:${rawPassword}`)
                    Log.p(tag, `serverExchangeKey: ${gson(serverExchangeKey)}`)
                    // Log.stack(tag)
                    const password = this["a"](clientKeys, rawPassword, serverExchangeKey)
                    Log.r(tag, `${gson(password)}`)
                    return password
                }
            }

            function vl0() {
                let vl0 = Java.use("com.google.android.gms.internal.ads.vl0")
                vl0["q"].implementation = function (clientPrivateKey: any, clientNonce: any, serverPublicKey: any, serverNonce: any, plainText: any) {
                    const tag = "vl0.encrypted"
                    Log.p(tag, `clientPrivateKey: ${clientPrivateKey}`)
                    Log.p(tag, `clientNonce: ${clientNonce}`)
                    Log.p(tag, `serverPublicKey: ${serverPublicKey}`)
                    Log.p(tag, `serverNonce: ${serverNonce}`)
                    Log.p(tag, `plainText: ${plainText}`)
                    // Log.stack(tag)
                    let r = this["q"](clientPrivateKey, clientNonce, serverPublicKey, serverNonce, plainText)
                    Log.r(tag, `${r}`)
                    return r
                }
            }

            function ArrayUtils() {
                let ArrayUtils = Java.use("pc5.o")
                ArrayUtils["r"].implementation = function (p1: any, p2: any) {
                    const tag = "ArrayUtils.splice"
                    Log.p(tag, `p1: ${p1}`)
                    Log.p(tag, `p2: ${p2}`)
                    let r = this["r"](p1, p2)
                    Log.r(tag, `${r}`)
                    return r
                }
            }
        }

        function exchangeEncryptionKey() {
            // e()

            function e() {
                let e = Java.use("ty3.e")
                e["p7"].implementation = function (authSessionID: any, continuation: any) {
                    const tag = "e.handleExchangeEncryptionKey"
                    Log.p(tag, `authSessionID: ${authSessionID}`)
                    Log.p(tag, `continuation: ${continuation}`)
                    // Log.stack(tag)
                    const context = this["e"].value
                    const const_ins = Java.cast(context, Java.use("gy3.n"))
                    const clientExchangeKey = const_ins['_g'].value
                    const clientExchangeKey_ins = Java.cast(clientExchangeKey, Java.use("gy3.g"))
                    Log.i(tag, `clientExchangeKey:${gson(clientExchangeKey_ins)}`)
                    if (authSessionID === g_authSessionID) {
                        Log.e(tag, `catch call exchangeEncryptionKey`)
                        const keyPair = clientExchangeKey_ins['_a'].value
                        if (keyPair) {
                            Log.i(tag, `keyPari in not null`)
                            // Log.i(tag, `当前是固定值`)
                            // const keyPair_ins = Java.cast(keyPair, Java.use("i85.c$a"))
                            // let pubKey = Java.array('byte', [-75, -12, -64, 67, -73, 55, -40, 45, 6, 12, 121, 79, 74, 11, -126, 12, -93, -91, 18, -47, 87, -12, 85, 30, 83, -10, 82, 77, 7, 7, -97, 117])
                            // let priKey = Java.array('byte', [24, -105, -11, 32, -43, 122, -87, -102, -35, 90, -128, -79, -53, -74, -8, -126, -111, 105, -83, -30, -55, -41, -117, 110, -33, 49, -82, 85, -12, -118, -34, 100])
                            // let nonce = Java.array('byte', [38, 81, -18, -26, 20, -44, 78, 76, -51, -116, -117, -76, 7, -98, -17, -124])
                            // keyPair_ins['a'].value = pubKey
                            // keyPair_ins['b'].value = priKey
                            // clientExchangeKey_ins['_b'].value = nonce
                        } else {
                            Log.i(tag, `keyPair is null`)
                        }
                    }
                    let r = this["p7"](authSessionID, continuation)
                    Log.i(tag, `clientExchangeKey: ${gson(clientExchangeKey_ins)}`)
                    Log.r(tag, `${gson(r)}`)
                    return r
                }
            }
        }

        function openSession() {
            // opensession_args()
            // opensession_result()
            // opensession_args_StandardSchemeImpl()
            // opensession_args_TupleSchemeImpl()
            // opensession_result_StandardSchemeImpl()
            // opensession_result_TupleSchemeImpl()
            // sz_d()

            // 为了得到 opensession 中 request 中的 tags 的 timeout 的值
            function sz_d() {
                let d = Java.use("sz.d")
                d["e"].implementation = function (builder: any, val: any) {
                    const tag = "sz.d.e"
                    Log.p(tag, `builder:${builder}, val:${val}`)
                    // Log.stack(tag)
                    this["e"](builder, val)
                }
            }

            function opensession_result_TupleSchemeImpl() {
                const opensession_result_TupleSchemeImpl = Java.use("x12.o1$d")
                opensession_result_TupleSchemeImpl["b"].implementation = function (iprot: any, result: any) {
                    const tag = "opensession_result_TupleSchemeImpl.read"
                    Log.i(tag, `enter`)
                    // Log.p(tag, `"iprot": ${gson(iprot)}`)
                    // Log.p(tag, `"result": ${gson(result)}`)
                    // Log.stack(tag)
                    this["b"](iprot, result)
                    Log.i(tag, `leave`)
                }
            }

            function opensession_result_StandardSchemeImpl() {
                const opensession_result_StandardSchemeImpl = Java.use("x12.o1$b")
                opensession_result_StandardSchemeImpl["b"].implementation = function (iprot: any, result: any) {
                    const tag = "opensession_result_StandardSchemeImpl.read"
                    Log.i(tag, `enter`)
                    // Log.p(tag, `"iprot": ${gson(iprot)}`)
                    // Log.p(tag, `"result": ${gson(result)}`)
                    // Log.stack(tag)
                    this["b"](iprot, result)
                    Log.i(tag, `leave`)
                }
            }

            function opensession_args_TupleSchemeImpl() {
                const opensession_args_TupleSchemeImpl = Java.use("x12.n1$d")
                opensession_args_TupleSchemeImpl["a"].implementation = function (oprot: any, args: any) {
                    const tag = "opensession_args_TupleSchemeImpl.write"
                    Log.p(tag, `oprot: ${gson(oprot)}`)
                    Log.p(tag, `args: ${gson(args)}`)
                    // Log.stack(tag)
                    this["a"](oprot, args)
                }
            }

            function opensession_args_StandardSchemeImpl() {
                const opensession_args_StandardSchemeImpl = Java.use("x12.n1$b")
                opensession_args_StandardSchemeImpl["a"].implementation = function (oprot: any, args: any) {
                    const tag = "opensession_args_StandardSchemeImpl.write"
                    Log.p(tag, `oprot: ${gson(oprot)}`)
                    Log.p(tag, `args: ${gson(args)}`)
                    // Log.stack(tag)
                    this["a"](oprot, args)
                }
            }

            function opensession_result() {
                const opensession_result = Java.use('x12.o1')
                opensession_result["read"].implementation = function (p1: any) {
                    const tag = "opensession_result.read"
                    Log.p(tag, `p1: ${gson(p1)}`)
                    // Log.stack(tag)
                    this["read"](p1)
                }
                opensession_result["write"].implementation = function (p1: any) {
                    const tag = "opensession_result.write"
                    Log.p(tag, `p1: ${gson(p1)}`)
                    // Log.stack(tag)
                    this["write"](p1)
                }
            }

            function opensession_args() {
                const opensession_args = Java.use('x12.n1')
                opensession_args["read"].implementation = function (p1: any) {
                    const tag = "opensession_args.read"
                    Log.p(tag, `p1:${gson(p1)}`)
                    // Log.stack(tag)
                    this["read"](p1)
                }
                opensession_args["write"].implementation = function (p1: any) {
                    const tag = "opensession_args.write"
                    Log.p(tag, `p1:${gson(p1)}`)
                    // Log.stack(tag)
                    this["write"](p1)
                }
            }
        }
    }

    static LineUserProfileImage() {
        upload()

        function upload() {
            /* https://obs.line-apps.com/r/talk/p/u8552dbd617b897c0ec0772ffd0a35e6b
            * x-obs-params: eyJ2ZXIiOiIyLjAiLCJuYW1lIjoicHJvZmlsZV8xNjk3NzE2MjEzMDI5LmpwZyIsInJhbmdlIjoiYnl0ZXMgMC00NTU1MFwvNDU1NTEiLCJ0eXBlIjoiSU1BR0UifQ==
            *   这是一个base64编码的json数据, 解码后得到:{"ver":"2.0","name":"profile_1697716213029.jpg","range":"bytes 0-45550\/45551","type":"IMAGE"}
            *   构造点在: q95.b.a
            * x-talk-meta: eyJwcm9maWxlQ29udGV4dCI6eyJzdG9yeVNoYXJlIjpmYWxzZX19
            *   这是一个base64编码的json数据, 解码后得到:{"profileContext":{"storyShare":false}}
            *   沟在点在: i12.d$a.c
            * x-line-access: TTJv6nvh1NoakGatiG0gvi6qtoNdS1CSldU8etGtAOOSy1WOuNh0baDFCVTXtzDyVTrUN6lJgU0GTRqnQjAcsg9MbcpAgktP4Jo7tZ7OXHcsuhTQslWN9iR7CfVBhYng0mqD86zGMGoozjw9OrgWCKNfoRku2FIyRI/xDy0qKi98UkSGU1EzeW5nZp1OJL9YHyUCshuljh1Gr0VriT5ZNZUMsde9kLJC6G6nMVDNQQbijvwWGq7Bpcr4GxkOig1t1jukxS/q6runzdZTH9/tqt+ibjHDpTfvZje/IyaQSsefeGxHolrelFDGf3gv7ODrxu7YCeU6l3TEKtRt1hBojr8GheNBR63laoKU4jkXUEysSuzl9yrYEx+x69cSGMyWAJVFLc5eJwxXpjfQW12keTK6GS/tZ03/28lBPBD20c15bvmv1zjKP7Sc2UTki7v8kRQKtX9x2Cipir2zbrGJb3FEv0/ZqexaNUCpyqrKT41Ud6tHn+dkx0pwmPRnVmOGPeuaMj/J52UaFPYc8BKNIZj0Eg4N4ZDQ4hal1nN2qs7cUefo92fFcFHwq0VFWYFtOF3otaV1VdIkVJV8/m/ff4nD/ZFNqFm8wx+pQME+hT2IR0dya0Q/qVygrFAYCxUslmFypOYXlnz9PUs7i//ebc4+G00liDj5yR8gFlgF5LoI1QocxMpzFqwA3/3JBgU5VW1K4j6DbwNxBPtMsmLLsY/s4nuMqkgFVK9mZaj9IfNEvYrbmhYvTEbgcpQJO8shS9sPxvTCYigHAPMTHlrFU+KXw5I2mWeWaKOzfCadkVEKvetVV35VphGfiLPK3zzqJ4OmYK+S8cDcNoYpswu+Qqjmxx2ZHV2DjwI94EErxxKh8MrwBV7kG69pBzOBedX3WZ9tLDp5bZ8SsxgZnd6/ci9HcKEdRQJFpM652k86g9gGo/uk+VOTAUb1kc1l9BwJwdbazo9SS5N5VUKywZ3zDkSH7T5EnPkdX6KTuWJkMyjY6u9MBNhTwoqZa86xRwPK+xmnus0Co9lgJLoXBDrRUbqOVkoC/iSAVclLasi+s4b+Gcgm6mjiaFCHuGEpnsDiwVcCA5IbJT9E+uMQodLTIkUNGgJKR07ihLtr/N+Pc87q9FhSRMnpk9/UPeNKj03i0y0M9W+3UR0OvKYmJaUFp1k7Ukk0OttY6b/Yzr2WTlA6levbs79GG0HQLBS/ZLFyIGzM7k4VEMLjppHoHQjiAF+7ngn5bpbKVtbDeD+13umVDLHXvZCyQuhupzFQzUEGcFdzbR9Bwx4LAfzU3GBLPf/jOatQaF4wEAkBkOIwLxOnGDnt4K03AQUV53ci4BKORo9NACGdjTLYNfQ2QPEYOtdfW31Hd1FRTEcLqBKDrKQ=
            *   access_token 的加密数据
            *   构造点在: gm1.d.e
            * */

            em1()
            im1()
            // gm1()
            // q95()
            // am1()
            // p45()

            // 发送数据
            function em1() {
                c()

                function c() {
                    let HttpURLHandler = Java.use("em1.c")
                    HttpURLHandler['D'].implementation = function (data: any, p1: any, p2: any) {
                        const tag = `em1.HttpURLHandler.realHandleRequest`
                        Log.i(tag, `enter`)
                        let value = this['c'];
                        Log.i(tag, `connection: ${value}, class:${value.$className}`)
                        Log.p(tag, `data:${gson(data)}`)
                        Log.p(tag, `p1(${p1.$className}):${gson(p1)}`)
                        Log.p(tag, `p2(${p2 != null ? p2.$className : null}):${gson(p2)}`)
                        // Log.stack(tag)
                        let r = this['D'](data, p1, p2)
                        Log.r(tag, `${gson(r)}`)
                        Log.i(tag, `leave`)
                        return r
                    }

                    HttpURLHandler['$init'].implementation = function (urlStr) {
                        const tag = `em1.HttpURLHandler.init`
                        Log.i(tag, `enter`)
                        Log.p(tag, `urlStr:${urlStr}`)
                        // Log.stack(tag)
                        this['$new'](urlStr)
                        Log.i(tag, `leave`)
                    }
                }
            }

            // 抓取 x-line-access
            function p45() {
                c()

                function c() {
                    let c = Java.use(`p45.c`);
                    c['b'].implementation = function () {
                        const tag = `p45.c.getEncryptedAccessToken`;
                        Log.i(tag, `enter`);
                        const this_a = Java.cast(this['_a'].value, Java.use(`p45.b`))
                        Log.i(tag, `a type:${this_a['a'].value}`)
                        Log.i(tag, `e createTime:${this_a['e'].value}`)
                        Log.i(tag, `c encrytped_access_token:${this_a['c'].value}`)
                        Log.i(tag, `d interval:${this_a['d'].value}`)
                        // Log.stack(tag);
                        let r = this['b']();
                        Log.r(tag, `${r}`);
                        Log.i(tag, `leave`);
                        return r;
                    }
                }
            }

            function am1() {
                a()

                function a() {
                    let a = Java.use(`am1.a`)
                    a['c'].implementation = function () {
                        const tag = `am1.a.c`
                        Log.i(tag, `enter`)
                        // Log.stack(tag)
                        let r = this['c']()
                        Log.r(tag, `${r.$className}`)
                        Log.i(tag, `leave`)
                        return r
                    }
                }
            }

            // 抓取 x-talk-meta
            function q95() {
                b$c()

                function b$c() {
                    let b$c = Java.use("q95.b$c")
                    b$c["$init"].overload('java.io.InputStream', 'int', 'java.util.Map').implementation = function (is, fileSize, header) {
                        const tag = `q95.b$c.$init`
                        Log.i(tag, `enter`)
                        Log.p(tag, `inputStream:${is}`)
                        Log.p(tag, `fileSize:${fileSize}`)
                        Log.p(tag, `header:${gson(header)}`)
                        // Log.stack(tag)
                        /*  [10:58:39:971 - 19772 - error - ]  >>>>>	q95.b$c.$init 	start
                            [10:58:39:975 - 19772 - info - q95.b$c.$init] 	q95.b$c.<init>(Native Method)
                            [10:58:39:975 - 19772 - info - q95.b$c.$init] 	q95.j.b(Unknown Source:31)
                            [10:58:39:975 - 19772 - info - q95.b$c.$init] 	c25.e.c(Unknown Source:153)
                            [10:58:39:976 - 19772 - info - q95.b$c.$init] 	c25.e.f(Unknown Source:399)
                            [10:58:39:976 - 19772 - info - q95.b$c.$init] 	jp.naver.line.android.activity.imageviewer.ImageViewerActivity.onActivityResult(Unknown Source:36)
                            [10:58:39:978 - 19772 - error - ]  >>>>>	q95.b$c.$init 	end
                        */
                        this["$new"](is, fileSize, header)
                        Log.i(tag, `leave`)
                    }
                }
            }

            // 处理请求头
            function gm1() {
                d()

                function d() {
                    let d = Java.use("gm1.d")
                    d["g"].implementation = function (map: any) {
                        const tag = `gm1.d.addHeader`
                        Log.i(tag, `enter`)
                        Log.p(tag, `map:${map}`)
                        // Log.stack(tag)
                        Log.i(tag, `this:${this.$className}`)
                        this["g"](map)
                        Log.i(tag, `leave`)
                    }
                    d["e"].implementation = function (header: any, z: any) {
                        const tag = `gm1.d.handleHeader`
                        Log.i(tag, `enter`)
                        Log.p(tag, `headers:${gson(header)}`)
                        Log.p(tag, `z:${z}`)
                        // Log.stack(tag)
                        this["e"](header, z)
                        Log.i(tag, `leave`)
                        header = this['c']()
                        Log.i(tag, `header:${gson(header)}`)
                    }
                }
            }

            // 这里就是将头像数据发送出去的地方
            function im1() {
                l()
                d()

                function l() {
                    let l = Java.use("im1.l")
                    l["h"].implementation = function (inputStream: any, p2: any) {
                        const tag = `im1.l.handleRequest`
                        Log.i(tag, `enter`)
                        Log.p(tag, `inputStream:${inputStream}`)
                        Log.p(tag, `p2:${p2}`)
                        Log.p(tag, `this:${gson(this)}`)
                        // Log.stack(tag)
                        /*  [10:08:19:595 - 19891 - error - ]  >>>>>	im1.l.handleRequest 	start
                            [10:08:19:596 - 19891 - info - im1.l.handleRequest] 	im1.l.h(Native Method)
                            [10:08:19:596 - 19891 - info - im1.l.handleRequest] 	zl1.f.a(Unknown Source:40)
                            [10:08:19:596 - 19891 - info - im1.l.handleRequest] 	tl1.a.h(Unknown Source:38)
                            [10:08:19:596 - 19891 - info - im1.l.handleRequest] 	q95.b.a(Unknown Source:90)
                            [10:08:19:596 - 19891 - info - im1.l.handleRequest] 	q95.e.doInBackground(Unknown Source:15)
                            [10:08:19:598 - 19891 - error - ]  >>>>>	im1.l.handleRequest 	end
                        * */
                        let r = this["h"](inputStream, p2)
                        Log.r(tag, `${r}`)
                        Log.i(tag, `leave`)
                        return r
                    }

                    l["a"].implementation = function () {
                        const tag = `im1.l.openConnection`
                        Log.i(tag, `enter`)
                        let r = this['a']()
                        Log.r(tag, `${r}, className: ${r.$className}`)
                        Log.i(tag, `leave`)
                        return r
                    }

                    // l["$init"].implementation = function (url, fileSize, params, interface1, interface2, header, bool) {
                    //     const tag = `im1.l.init`
                    //     Log.i(tag, `enter`)
                    //     Log.p(tag, `url:${url}`)
                    //     Log.p(tag, `fileSize:${fileSize}`)
                    //     Log.p(tag, `params:${params}`)
                    //     Log.p(tag, `interface1:${interface1}, className: ${interface1.$className}`)
                    //     Log.p(tag, `interface2:${interface2}, className: ${interface2.$className}`)
                    //     Log.p(tag, `header:${header}`)
                    //     Log.p(tag, `bool:${bool}`)
                    //     Log.stack(tag)
                    //     this["$init"](url, fileSize, params, interface1, interface2, header, bool)
                    //     Log.i(tag, `leave`)
                    // }
                }

                function d() {
                    let d = Java.use("im1.d")
                    d["e"].implementation = function (p1: any, p2: any, p3: any) {
                        const tag = `im1.d.superHandleRequest`
                        Log.i(tag, `enter`)
                        Log.p(tag, `p1:${p1}`)
                        Log.p(tag, `p2:${p2}`)
                        Log.p(tag, `p3:${gson(p3)}`)
                        // Log.stack(tag)
                        let r = this["e"](p1, p2, p3)
                        Log.r(tag, `${gson(r)}`)
                        Log.i(tag, `leave`)
                        return r
                    }

                    d['a'].implementation = function () {
                        const tag = `im1.d.openHttpConnection`
                        Log.i(tag, `enter`)
                        let r = this['a']()
                        Log.r(tag, `${r.$className}`)
                        Log.i(tag, `leave`)
                        return r
                    }
                }
            }


            // 这个是 getProfile 才会用到
            function v95() {
                let OBSUrlBuilder = Java.use("v95.b")
                // public static final String g_buildUrl(OpType type, String serviceName, String objectStorageName, String objectId) {
                OBSUrlBuilder['g'].implementation = function (type: any, serviceName: any, objectStorageName: any, objectId: any) {
                    const tag = `v95.OBSUrlBuilder.buildUrl`
                    Log.i(tag, `enter`)
                    Log.p(tag, `type:${type}`)
                    Log.p(tag, `serviceName:${serviceName}`)
                    Log.p(tag, `objectStorageName:${objectStorageName}`)
                    Log.p(tag, `objectId:${objectId}`)
                    // Log.stack(tag)
                    let r = this['g'](type, serviceName, objectStorageName, objectId)
                    Log.r(tag, `${r}`)
                    Log.i(tag, `leave`)
                    return r
                }
                // public static String j(ObsUrlParameter param) {
                OBSUrlBuilder['j'].implementation = function (p: any) {
                    const tag = `v95.OBSUrlBuilder.j`
                    Log.i(tag, `enter`)
                    Log.p(tag, `ObsUrlParameter:${gson(p)}`)
                    // Log.stack(tag)
                    let r = OBSUrlBuilder['j'](p)
                    Log.r(tag, `${r}`)
                    Log.i(tag, `leave`)
                    return r
                }
            }
        }
    }

    static LineAccessToken() {
        accessToken()

        function accessToken() {
            LegacyTalkServiceClientImpl()

            function LegacyTalkServiceClientImpl() {
                const LegacyTalkServiceClientImpl = Java.use("jp.naver.line.android.thrift.client.impl.LegacyTalkServiceClientImpl")
                LegacyTalkServiceClientImpl.C1.implementation = function (type: any) {
                    const tag = "LegacyTalkServiceClientImpl.acquireEncryptedAccessToken"
                    Log.i(tag, `enter`)
                    Log.p(tag, `type:${type}`)
                    // Log.stack(tag)
                    let r = this["C1"](type)
                    Log.r(tag, `${r}`)
                    Log.i(tag, `leave`)
                    return r
                }
            }
        }
    }

    static LineContact() {
        // sz();
        fz();
        nt();
        p4();

        // 返回值就是 x-line-access
        function p4() {
            let p4 = Java.use("com.google.android.gms.internal.vision.p4")
            p4["l"].implementation = function (authToken: any) {
                const tag = `p4.encryptedAuthToken`
                Log.i(tag, `enter`)
                Log.p(tag, `authToken:${authToken}`)
                // Log.stack(tag)
                let r = this["l"](authToken)
                Log.r(tag, `${r}`)
                Log.i(tag, `leave`)
                return r
            }
        }

        function nt() {
            let v1TokenMigrationHelper = Java.use("nt.b")
            v1TokenMigrationHelper['d'].implementation = function () {
                const tag = "v1TokenMigrationHelper.getAccessToken"
                Log.i(tag, `enter`)
                const INSTANCE = Java.use("da5.a")["_a"].value;
                Log.i(tag, `INSTANCE(${INSTANCE.$className}):${gson(INSTANCE)}`)
                // Log.stack(tag)
                let r = this['d']()
                Log.r(tag, `${r}`)
                Log.i(tag, `leave`)
                return r
            }
        }

        function fz() {
            //fz.q.a
            let q = Java.use("fz.q")
            q["a"].implementation = function () {
                const tag = "fz.q.getAccessToken"
                Log.i(tag, `enter`)
                const v1TokenMigrationHelper = this["_a"].value;
                Log.i(tag, `v1TokenMigrationHelper(${v1TokenMigrationHelper.$className}):${v1TokenMigrationHelper}`)
                const credentialRepository = this["_c"].value
                Log.i(tag, `credentialRepository(${credentialRepository.$className}):${credentialRepository}`)
                const legyDebugConfig = this["_d"].value
                Log.i(tag, `legyDebugConfig(${legyDebugConfig.$className}):${legyDebugConfig}`)
                Log.i(tag, `isAuthTokenV1:${v1TokenMigrationHelper['a']()}`)
                Log.i(tag, `authToken:${Java.use("s55.b")["b"]()["getAuthToken"]()}`)
                // Log.stack(tag)
                let r = this["a"]()
                Log.r(tag, `${r}`)
                Log.i(tag, `leave`)
                return r
            }
        }

        // 为了获取 x-line-access 数据
        function sz() {
            let b = Java.use("sz.d$b");
            b["a"].overload('zg5.f').implementation = function (p1: any) {
                const tag = "sz.d$b.a"
                Log.i(tag, `enter`)
                Log.p(tag, `p1:${(p1)}`)
                // Log.stack(tag)
                let r = this["a"](p1)
                Log.r(tag, `${r}`)
                Log.i(tag, `leave`)
                return r
            }
        }
    }

    static LineSendMessage() {
        LegacyTalkServiceClientImpl()
        e3()
        i85()
        oc5()
        pc5()

        function pc5() {
            const pc5_c0 = Java.use("pc5.c0")
            //pc5.c0.V
            pc5_c0['V'].implementation = function (index: any, list: any) {
                // public static final Object getListValueByIndex(int index, List list) {
                const tag = "pc5.c0.getListValueByIndex"
                Log.i(tag, `enter`)
                Log.p(tag, `index:${index}`)
                Log.p(tag, `list:${gson(list)}`)
                // Log.stack(tag)
                const r = pc5_c0['V'](index, list)
                if (r != null && r.$className.indexOf("ByteBuffer") !== -1) {
                    const ins = Java.cast(r, Java.use(r.$className));
                    Log.r(tag, `${gson(ins['array']())}`)
                } else {
                    Log.r(tag, `${gson(r)}`)
                }
                Log.i(tag, `leave`)
                return r
            }
        }

        function oc5() {
            const klass = Java.use("oc5.qe")
            klass['a'].implementation = function (byteBuffer: any) {
                const tag = "oc5.Message.addToChunks"
                Log.i(tag, `enter`)
                Log.p(tag, `byteBuffer:${gson(byteBuffer.array())}`)
                // Log.stack(tag)
                this['a'](byteBuffer)
                Log.i(tag, `leave`)
            }

        }

        function i85() {
            let i85_c = Java.use("i85.c")
            i85_c['g'].implementation = function (priKey: any, pubKey: any) {
                // public static byte[] calculateAgreement(byte[] arr_b, byte[] arr_b1) {
                const tag = "KeyPair.calculateAgreement"
                Log.i(tag, `enter`)
                Log.p(tag, `private key:${gson(priKey)}`)
                Log.p(tag, `public key:${gson(pubKey)}`)
                // Log.stack(tag)
                const r = i85_c['g'](priKey, pubKey)
                Log.r(tag, `${gson(r)}`)
                Log.i(tag, `leave`)
                return r
            }
            i85_c['d'].implementation = function (sharedKey: any, rnd16: any) {
                // public static byte[] sha256(byte[] bArr1, byte[] bArr2) throws NoSuchAlgorithmException {
                const tag = "KeyPair.sha256"
                Log.i(tag, `enter`)
                Log.i(tag, `enter`)
                Log.p(tag, `sharedKey:${gson(sharedKey)}`)
                Log.p(tag, `rnd16:${gson(rnd16)}`)
                // Log.stack(tag)
                const r = i85_c['d'](sharedKey, rnd16)
                Log.r(tag, `${gson(r)}`)
                Log.i(tag, `leave`)
                return r
            }

            let i85_k = Java.use("i85.k")
            i85_k['l'].implementation = function (keyId: any, mid: any) {
                //  public final E2EEPublicKey getE2EEPublicKeyByKeyIDAndMid(int keyId, String mid) throws Exception {
                const tag = "i85.k.getE2EEPublicKeyByKeyIDAndMid"
                Log.i(tag, `enter`)
                Log.p(tag, `keyId:${keyId}`)
                Log.p(tag, `mid:${mid}`)
                Log.stack(tag)
                const r = this['l'](keyId, mid)
                Log.r(tag, `${gson(r)}`)
                Log.i(tag, `leave`)
                return r
            }

            let i85_r = Java.use("i85.r")
            i85_r['a'].implementation = function (msg: any, key: any) {
                // public static final void decrypt(Message msg, E2EEKeyInfo key)
                const tag = "i85.r.decrypt"
                Log.i(tag, `enter`)
                Log.p(tag, `msg:${gson(msg)}`)
                Log.p(tag, `key:${gson(key)}`)
                // Log.stack(tag)
                i85_r['a'](msg, key)
                Log.r(tag, `${gson(msg)}`)
                Log.i(tag, `leave`)
            }
            i85_r['b'].implementation = function (myMid: any, msg: any, keyInfo: any, allowTypes: any, e2eeSpecVersion: any, sequenceNumber: any) {
                //public static final void handleMsgChunks(String myMid, Message msg, E2EEKeyInfo keyInfo, Set allowTypes, E2eeSpecVersion e2eeSpecVersion, long sequenceNumber) throws Exception {
                const tag = "i85.r.handleMsgChunks"
                Log.i(tag, `enter`)
                Log.p(tag, `myMid:${myMid}`)
                Log.p(tag, `msg:${gson(msg)}`)
                Log.p(tag, `keyInfo:${gson(keyInfo)}`)
                Log.p(tag, `allowTypes:${gson(allowTypes)}`)
                Log.p(tag, `e2eeSpecVersion:${gson(e2eeSpecVersion)}`)
                Log.p(tag, `sequenceNumber:${sequenceNumber}`)
                // Log.stack(tag)
                i85_r["b"](myMid, msg, keyInfo, allowTypes, e2eeSpecVersion, sequenceNumber)
                Log.i(tag, `leave`)
            }
            i85_r['c'].implementation = function (from: any, to: any, type: any, keyId01: any, keyId02: any, e2eeSpecVersion: any) {
                //public static byte[] toByteArray(String from, String to, ContentType type, int fromKeyId, int toKeyId, int e2eeSpecVersion) {
                const tag = "i85.r.toByteArray"
                Log.i(tag, `enter`)
                Log.p(tag, `from:${from}`)
                Log.p(tag, `to:${to}`)
                Log.p(tag, `type:${gson(type)}`)
                Log.p(tag, `keyId01:${keyId01}`)
                Log.p(tag, `keyId02:${keyId02}`)
                Log.p(tag, `ver:${e2eeSpecVersion}`)
                // Log.stack(tag)
                const result = i85_r['c'](from, to, type, keyId01, keyId02, e2eeSpecVersion)
                Log.r(tag, `${gson(result)}`)
                Log.i(tag, `leave`)
                return result
            }
            i85_r['e'].implementation = function (msg: any) {
                // public static final boolean checkE2EESpecVersion(Message message) {
                const tag = "i85.r.checkE2EESpecVersion"
                Log.i(tag, `enter`)
                Log.p(tag, `msg:${gson(msg)}`)
                // Log.stack(tag)
                const result = i85_r['e'](msg)
                Log.r(tag, `${result}`)
                Log.i(tag, `leave`)
                return result
            }
        }

        // za5.e3.i 创建消息
        function e3() {
            const e3 = Java.use("za5.e3")
            e3["i"].implementation = function () {
                const tag = `e3.createServerMessage`
                Log.i(tag, `enter`)
                Log.i(tag, `needNegotiate:${this['_o'].value}`)
                Log.i(tag, `this.j:${gson(this['_j'].value)}`)
                Log.i(tag, `i85.b.enableE2EE:${Java.use("i85.b")["a"]()}`)
                // Log.stack(tag)
                const r = this['i']()
                Log.r(tag, `${gson(r)}`)
                Log.i(tag, `leave`)
                return r
            }
        }

        // jp.naver.line.android.thrift.client.impl.LegacyTalkServiceClientImpl.G5
        function LegacyTalkServiceClientImpl() {
            const klass = Java.use("jp.naver.line.android.thrift.client.impl.LegacyTalkServiceClientImpl")
            //    public final void sendTextMessage(MessageContentType msgContentType, int reqSeq, Message msg, d3 d30, UserClient client, HashMap hashMap0, Map map0) throws TException {
            klass['H5'].implementation = function (msgContentType: any, reqSeq: any, msg: any, d30: any, client: any, hashMap: any, map: any) {
                // 这里是处理文本消息
                const tag = `LegacyTalkServiceClientImpl.sendTextMessage`
                Log.i(tag, `enter`)
                Log.p(tag, `msgContentType:${msgContentType}`)
                Log.p(tag, `reqSeq:${reqSeq}`)
                Log.p(tag, `msg:${gson(msg)}, chunks:${gson(msg['_o'].value)}`)
                Log.p(tag, `d30:${gson(d30)}`)
                Log.p(tag, `client:${client}，oprot:${client['_b'].value}, trans_:${client['_b'].value['_a'].value}`)
                Log.p(tag, `hashMap:${gson(hashMap)}`)
                Log.p(tag, `map:${gson(map)}`)
                // Log.stack(tag)
                this['H5'](msgContentType, reqSeq, msg, d30, client, hashMap, map)
                Log.i(tag, `leave`)
            }
            // public final void sendMessage(int reqSeq, Message msg, d3 d30, UserClient client, Map map) throws TException {
            klass['G5'].implementation = function (reqSeq: any, msg: any, d30: any, client: any, map: any) {
                // 这里是处理不压缩消息的地方
                const tag = `LegacyTalkServiceClientImpl.sendMessage`
                Log.i(tag, `enter`)
                Log.p(tag, `reqSeq:${reqSeq}`)
                Log.p(tag, `msg:${gson(msg)}`)
                Log.p(tag, `d30:${gson(d30)}`)
                Log.p(tag, `client:${client}`)
                Log.p(tag, `map:${gson(map)}`)
                // Log.stack(tag)
                this['G5'](reqSeq, msg, d30, client, map)
                Log.i(tag, `leave`)
            }
            //public final void handleMessage(int reqSeq, Message msg, HashMap hashMap0, Map map0, d3 d30) {
            klass['e0'].implementation = function (reqSeq: any, msg: any, hashMap: any, map: any, d30: any) {
                // 消息处理方法，后面从这里根据 msg 的不同再派发到不同的处理方法中
                const tag = `LegacyTalkServiceClientImpl.handleMessage`
                Log.i(tag, `enter`)
                Log.p(tag, `reqSeq:${reqSeq}`)
                Log.p(tag, `msg:${gson(msg)}`)
                Log.p(tag, `hashMap:${gson(hashMap)}`)
                Log.p(tag, `map:${gson(map)}`)
                Log.p(tag, `d30:${gson(d30)}`)
                // Log.stack(tag)
                this['e0'](reqSeq, msg, hashMap, map, d30)
                Log.i(tag, `leave`)
            }
        }
    }

    //===================================================
    static JSON() {
        json()

        function json() {
            const klass = Java.use("org.json.JSONObject")
            // const originalToString = klass.toString;
            // klass['toString'].implementation = function () {
            //     const tag = "JSONObject.toString"
            //     Log.i(tag, `enter`)
            //     // Log.stack(tag)
            //     let r = originalToString.call(this)
            //     Log.r(tag, `${r}`)
            //     Log.i(tag, `leave`)
            //     return r
            // }
            klass['optString'].overload('java.lang.String').implementation = function (key: any) {
                const tag = `JSONObject.optString`

                if (key !== "text") {
                    return this['optString'](key)
                }

                Log.i(tag, `enter`)
                Log.p(tag, `key:${key}`)
                // Log.stack(tag)
                let r = this['optString'](key)
                Log.r(tag, `${r}`)
                Log.i(tag, `leave`)
                return r
            }
        }
    }

    static LegyRequest() {
        wz()

        function wz() {
            const klass = Java.use("wz.a")
            // public final void fetchOps(LegyDestination destination, LegyApiType apiType, URL url, String httpMethod, Map headerFields, LegyRequestData data, v option, n n0) throws Exception {
            klass['a'].implementation = function (destination: any, apiType: any, url: any, httpMethod: any, headerFields: any, data: any, option: any, n0: any) {
                const tag = "LineRequest.fetchOps"
                Log.i(tag, `enter`)
                Log.p(tag, `destination:${destination}`)
                Log.p(tag, `apiType:${apiType}`)
                Log.p(tag, `url:${url}`)
                Log.p(tag, `httpMethod:${httpMethod}`)
                Log.p(tag, `headerFields:${gson(headerFields)}`)
                Log.p(tag, `data:${gson(data)}`)
                Log.p(tag, `option:${gson(option)}`)
                Log.p(tag, `n0(${n0.$className}):${gson(n0)}`)
                Log.stack(tag)
                this['a'](destination, apiType, url, httpMethod, headerFields, data, option, n0)
                Log.i(tag, `leave`)
            }
        }
    }

    static LineThrift() {
        // TTransportImpl()
        RegisterClient()

        // PersonClient()

        function TTransportImpl() {
            const TTransportRegister = Java.use("ib5.e")
            TTransportRegister["m"].implementation = function (p1: any, map: any) {
                const tag = "TTransportRegister.headerFields"
                Log.p(tag, `p1: ${gson(p1)}`)
                Log.p(tag, `map:${gson(map)}`)
                // Log.stack(tag)
                let r = this["m"](p1, map)
                Log.r(tag, `${r}`)
                return r
            }
        }

        function call_exchange_key_calc() {
            const tag = "call_exchange_key_calc"
            Java.perform(() => {
                const Security = Java.use("i85.c")
                const priKey = Java.array('byte', [40, 23, -105, 56, 40, -37, 14, 72, 79, -39, 93, -40, -8, -42, -1, 62, -49, -32, 93, 24, 67, -86, -128, 73, -92, -69, -101, 13, -113, 110, 8, 83])
                const pubKey = Java.array('byte', [-12, -112, -26, 29, 86, 40, 59, 27, 25, 73, 2, 64, -103, -70, -96, -15, -2, -1, 117, 125, 6, -121, -104, -40, -113, -104, 81, 104, -117, 45, -50, 115])
                let r = Security["g"](priKey, pubKey)
                Log.i(tag, `exchange key:${r}`)
                // -99,57,45,-60,88,-83,60,11,-50,68,24,82,124,-58,-84,-118,-66,-105,47,-3,-44,122,-75,48,95,127,21,15,92,110,70,86

                const MessageDigest = Java.use(`java.security.MessageDigest`)
                const ins = MessageDigest.getInstance("SHA-256")
                ins.update(r)
                r = ins.digest()
                Log.i(tag, `sha256:${r}`)
            })
        }

        function hook_Security(){
            const Security = Java.use("i85.c")
            Security["g"].implementation = function (priKey: any, pubKey: any) {
                const tag = "Security.calculateAgreement"
                Log.p(tag, `priKey:${gson(priKey)}`)
                Log.p(tag, `pubKey:${gson(pubKey)}`)
                // Log.stack(tag)
                let r = this["g"](priKey, pubKey)
                Log.r(tag, `${r}`)
                return r
            }
        }

        function call_encrypted() {
            const tag = "call_encrypted"
            Java.perform(function () {
                const privateKey = Java.array('byte', [40, 23, -105, 56, 40, -37, 14, 72, 79, -39, 93, -40, -8, -42, -1, 62, -49, -32, 93, 24, 67, -86, -128, 73, -92, -69, -101, 13, -113, 110, 8, 83])
                const nonce = Java.array('byte', [121, -18, -19, 114, -34, -114, 89, -26, -11, -99, -105, -94, 109, 125, 56, 63])
                const srvPubKey = Java.array('byte', [-12, -112, -26, 29, 86, 40, 59, 27, 25, 73, 2, 64, -103, -70, -96, -15, -2, -1, 117, 125, 6, -121, -104, -40, -113, -104, 81, 104, -117, 45, -50, 115])
                const srvNonce = Java.array('byte', [55, -29, 115, 41, -89, 2, -32, -35, -14, -108, 126, -59, 95, -29, -52, 58])
                const password = "123456aA"
                let vl0 = Java.use("com.google.android.gms.internal.ads.vl0")
                let r = vl0['q'](privateKey, nonce, srvPubKey, srvNonce, password)
                Log.i(tag, `r:${r}`)
                // r:RTiACE1Izz02UxsZnvmBlY3ypuUOkrdWKC5/U8OJYkxtXdyr4R2BBx5dQ3X6SfN1
            })
        }

        // 猜测所有与注册相关的函数调用请求都是从这里发出的
        function RegisterClient() {
            const RegisterClient = Java.use("x12.i0")
            RegisterClient["r"].implementation = function (request: any) {
                const tag = "RegisterClient.openSession"
                hook_Security()
                call_exchange_key_calc()
                call_encrypted()
                method = "openSession"
                Log.p(tag, `"request": ${gson(request)}`)
                // Log.stack(tag)
                let r = this["r"](request)
                g_authSessionID = r
                Log.r(tag, `${r}`)
                return r
            }
            RegisterClient["g"].implementation = function (authSessionId: any, result: any) {
                const tag = "RegisterClient.getCountryInfo"
                method = "getCountryInfo"
                Log.p(tag, `authSessionId:${authSessionId}`)
                Log.p(tag, `"result":${gson(result)}`)
                // Log.stack(tag)
                let r = this["g"](authSessionId, result)
                Log.r(tag, `${gson(r)}`)
                return r
            }
            RegisterClient["o"].implementation = function (request: any) {
                const tag = "RegisterClient.lookupAvailableEap"
                method = "lookupAvailableEap"
                Log.p(tag, `request: ${gson(request)}`)
                // Log.stack(tag)
                let r = this["o"](request)
                Log.r(tag, `${r["toString"]()}`)
                return r
            }
            RegisterClient["c"].implementation = function (authSessionId: any, countryCode: any) {
                const tag = "RegisterClient.getAllowedRegistrationMethod"
                method = "getAllowedRegistrationMethod"
                Log.p(tag, `authSessionId:${authSessionId}`)
                Log.p(tag, `countryCode: ${gson(countryCode)}`)
                // Log.stack(tag)
                let r = this["c"](authSessionId, countryCode)
                Log.r(tag, `${gson(r)}`)
                return r
            }
            RegisterClient["h"].implementation = function (request: any) {
                const tag = "RegisterClient.getPhoneVerifMethodForRegistration"
                method = "getPhoneVerifMethodForRegistration"
                Log.p(tag, `request: ${gson(request)}`)
                // Log.stack(tag)
                let r = this["h"](request)
                Log.r(tag, `${gson(r)}`)
                return r
            }
            RegisterClient["u"].implementation = function (request: any) {
                const tag = "RegisterClient.requestToSendPhonePinCode"
                method = "requestToSendPhonePinCode"
                Log.p(tag, `request: ${gson(request)}`)
                // Log.stack(tag)
                let r = this["u"](request)
                Log.r(tag, `${gson(r)}`)
                return r
            }
            RegisterClient["z"].implementation = function (request: any) {
                const tag = "RegisterClient.verifyPhonePinCode"
                method = "verifyPhonePinCode"
                Log.p(tag, `request: ${gson(request)}`)
                // Log.stack(tag)
                let r = this["z"](request)
                Log.r(tag, `${gson(r)}`)
                return r
            }
            RegisterClient["e"].implementation = function (authSessionID: any, accountIdentifier: any) {
                const tag = "RegisterClient.getAcctVerifMethod"
                method = "getAcctVerifMethod"
                Log.p(tag, `authSessionID:${authSessionID}`)
                Log.p(tag, `accountIdentifier: ${gson(accountIdentifier)}`)
                // Log.stack(tag)
                let r = this["e"](authSessionID, accountIdentifier)
                Log.r(tag, `${gson(r)}`)
                return r
            }
            RegisterClient["c"].implementation = function (authSessionID: any, request: any) {
                const tag = "RegisterClient.exchangeEncryptionKey"
                method = "exchangeEncryptionKey"
                Log.p(tag, `authSessionID:${authSessionID}`)
                Log.p(tag, `request: ${gson(request)}`)
                // Log.stack(tag)
                let r = this["c"](authSessionID, request)
                Log.r(tag, `${gson(r)}`)
                return r
            }
            RegisterClient["v"].implementation = function (authSessionID: any, encryptedPassword: any) {
                const tag = "RegisterClient.setPassword"
                method = "setPassword"
                Log.p(tag, `authSessionID:${authSessionID}`)
                Log.p(tag, `encryptedPassword: ${gson(encryptedPassword)}`)
                // Log.stack(tag)
                let r = this["v"](authSessionID, encryptedPassword)
                Log.r(tag, `${gson(r)}`)
                return r
            }
            RegisterClient["t"].implementation = function (authSessionID: any) {
                const tag = "RegisterClient.registerPrimaryUsingPhoneWithTokenV3"
                method = "registerPrimaryUsingPhoneWithTokenV3"
                Log.p(tag, `authSessionID: ${authSessionID}}`)
                // Log.stack(tag)
                let r = this["t"](authSessionID)
                Log.r(tag, `${gson(r)}`)
                return r
            }
            RegisterClient["e"].implementation = function (str: any, accountIdentifier: any) {
                const tag = "RegisterClient.getAcctVerifMethod"
                Log.i(tag, `enter`)
                Log.p(tag, `str:${str}`)
                Log.p(tag, `accountIdentifier:${gson(accountIdentifier)}`)
                let r = this["e"](str, accountIdentifier)
                Log.r(tag, `${gson(r)}`)
                return r
            }
        }

        // 猜测所有跟用户相关的函数调用请求都是从这里发出的
        function PersonClient() {
            // let PersonClient = Java.use("oc5.ui")
        }
    }

    static AndroidPackage() {
        Context()
        ContentResolver()

        function Context() {
            // android.content.Context.getContentResolver
            const Context = Java.use("android.content.Context")
            Context["getContentResolver"].implementation = function () {
                const tag = "Context.getContentResolver"
                Log.i(tag, `enter`)
                // Log.stack(tag)
                let r = this["getContentResolver"]()
                Log.r(tag, `${r}`)
                Log.i(tag, `leave`)
                return r
            }
        }

        function ContentResolver() {
            const ApplicationContentResolver = Java.use("android.app.ContextImpl$ApplicationContentResolver")
            ApplicationContentResolver["query"].overload('android.net.Uri', '[Ljava.lang.String;', 'java.lang.String', '[Ljava.lang.String;', 'java.lang.String').implementation = function (uri: any, projection: any, selection: any, selectionArgs: any, sortOrder: any) {
                const tag = "ApplicationContentResolver.query"
                Log.i(tag, `enter`)
                let b = uri.toString().indexOf("contacts") !== -1
                if (b) {
                    Log.p(tag, `uri:${uri}`)
                    Log.p(tag, `projection:${projection}`)
                    Log.p(tag, `selection:${selection}`)
                    Log.p(tag, `selectionArgs:${selectionArgs}`)
                    Log.p(tag, `sortOrder:${sortOrder}`)
                    // Log.stack(tag)
                }
                let r = this["query"](uri, projection, selection, selectionArgs, sortOrder)
                if (b) {
                    Log.r(tag, `${r}`)
                }
                Log.i(tag, `leave`)
                return r
            }
        }
    }

    static JavaPackage() {
        HttpsURLConnection()
        HttpURLConnection()
        URL()

        function HttpsURLConnection() {
            const HttpsURLConnection = Java.use("javax.net.ssl.HttpsURLConnection")
            HttpsURLConnection["setSSLSocketFactory"].implementation = function (sslSocketFactory: any) {
                const tag = "HttpsURLConnection.setSSLSocketFactory"
                Log.i(tag, `enter`)
                Log.p(tag, `sslSocketFactory: ${gson(sslSocketFactory)}`)
                // Log.stack(tag)
                let r = this["setSSLSocketFactory"](sslSocketFactory)
                Log.r(tag, `${r}`)
                Log.i(tag, `leave`)
                return r
            }
        }


        function HttpURLConnection() {
            const HttpURLConnection = Java.use("java.net.HttpURLConnection")
            HttpURLConnection["setRequestMethod"].implementation = function (method: any) {
                const tag = "HttpURLConnection.setRequestMethod"
                Log.i(tag, `enter`)
                Log.p(tag, `method:${method}`)
                // Log.stack(tag)
                this["setRequestMethod"](method)
                Log.i(tag, `leave`)
            }
        }

        function URL() {
            const URL = Java.use("java.net.URL")
            init()
            openConnection()

            function init() {
                //overload('java.lang.String')
                URL["$init"].overload('java.lang.String').implementation = function (url) {
                    const tag = "URL.$init(String)"
                    if (url)
                        Log.i(tag, `enter`)
                    Log.p(tag, `url:${url}`)
                    // Log.stack(tag)
                    this["$init"](url)
                    Log.i(tag, `leave`)
                }
                //overload('java.net.URL', 'java.lang.String')
                URL["$init"].overload('java.net.URL', 'java.lang.String').implementation = function (url, spec) {
                    const tag = "URL.$init(URL, String)"
                    Log.i(tag, `enter`)
                    Log.p(tag, `url:${gson(url)}`)
                    Log.p(tag, `spec:${spec}`)
                    // Log.stack(tag)
                    this["$init"](url, spec)
                    Log.i(tag, `leave`)
                }
            }

            function openConnection() {
                const tag = "URL.openConnection"
                URL["openConnection"].overload().implementation = function () {
                    Log.i(tag, `enter`)
                    // Log.stack(tag)
                    let r = this["openConnection"]()
                    Log.r(tag, `${r}`)
                    Log.i(tag, `leave`)
                    return r
                }
            }
        }
    }

    static OkHttp() {
        OkHttpClient()
        // Request()
        // Request_Builder()

        // HttpURL_Builder()

        function OkHttpClient() {
            const OkHttpClient = Java.use("ug5.x")
            OkHttpClient["a"].implementation = function (request: any) {
                const tag = "Okhttp3Client.newCall"
                Log.i(tag, `enter`)
                // Log.e(tag, `certificatePinner:${gson(this['v'].value)}`)
                // Log.e(tag, `proxy:${gson(this['m'].value)}`)
                // Log.e(tag, `x509TrustManager:${gson(this['r'].value)}`)
                // Log.e(tag, `sslSocketFactory:${gson(this['q'].value)}`)
                // Log.e(tag, `socketFactory:${gson(this['p'].value)}`)
                // Log.e(tag, `hostnameVerifier:${gson(this['u'].value)}`)
                Log.p(tag, `request:${parseRequest(request)}`)
                // Log.stack(tag)
                let r = this["a"](request)
                // Log.r(tag, `${gson(r)}`)
                Log.i(tag, `leave`)
                return r
            }

            function parseRequest(request: any) {
                const tag = `OkHttp.parseRequest`
                const ins = Java.cast(request, Java.use("ug5.z"))
                let url = ins["_a"].value
                url = parseHttpURL(url)
                const method = ins["_b"].value
                const headers = ins["c"].value
                let body = ins["d"].value
                if (body != null && body.$className === "wz.a$b") {
                    body = parseRequestBody(Java.cast(body, Java.use("wz.a$b"))["a"].value)
                } else if (body != null) {
                    Log.w(tag, `body is not null, but not wz.a$b, body:${body}`)
                }
                const tags = ins["e"].value
                return `Request:(url:${url}, method:${method}, headers:${gson(headers)}, body:${body}, tags:${gson(tags)})`

                function parseHttpURL(url: any) {
                    const ins = Java.cast(url, Java.use("ug5.s"))
                    const scheme = ins["_a"].value
                    const username = ins["_b"].value
                    const password = ins["_c"].value
                    const host = ins["_d"].value
                    const port = ins["_e"].value
                    const pathSegments = ins["_f"].value
                    const queryNamesAndValues = ins["_g"].value
                    const fragment = ins["_h"].value
                    const url_ = ins["_i"].value
                    const isHttps = ins["_j"].value
                    return `instance:(scheme:${scheme}, username:${username}, password:${password}, host:${host}, port:${port}, pathSegments:${gson(pathSegments)}, queryNamesAndValues:${gson(queryNamesAndValues)}, fragment:${fragment}, url:${url_}, isHttps:${isHttps})`
                }

                function parseRequestBody(body: any) {
                    const ins = Java.cast(body, Java.use("jz.l"))
                    const len = ins["a"].value
                    const data = ins["b"].value
                    const shouldUseSecureConnection = ins["c"].value
                    return `RequestBody:(len:${len}, data:${gson(data)}, shouldUseSecureConnection:${shouldUseSecureConnection})`
                }
            }
        }

        function Request() {
            const Request = Java.use("ug5.z")
            // Request["$init"].implementation = function (url, method, headers, requestBody, tags) {
            //     const tag = "Okhttp3.Request.$init"
            //     Log.p(tag, `url: ${url}`)
            //     Log.p(tag, `method: ${method}`)
            //     Log.p(tag, `headers: ${headers}`)
            //     Log.p(tag, `requestBody: ${gson(requestBody)}`)
            //     Log.p(tag, `tags: ${gson(tags)}`)
            //     // Log.stack(tag)
            //     this["$init"](url, method, headers, requestBody, tags)
            // }

            Request["b"].implementation = function (type: any) {
                const tag = "Okhttp3.Request.tag"
                Log.i(tag, `enter`)
                Log.p(tag, `type: ${type}`)
                // Log.stack(tag)
                let r = this["b"](type)
                Log.r(tag, `${r}`)
                Log.i(tag, `leave`)
                return r
            }
        }

        function Request_Builder() {
            const Builder = Java.use("ug5.z$a")
            // public final Request build() {
            Builder["b"].implementation = function () {
                const tag = "Okhttp3.Request.Builder.build"
                Log.i(tag, `enter`)
                // Log.stack(tag)
                let r = this["b"]()
                Log.r(tag, `${gson(r)}`)
                Log.i(tag, `leave`)
                return r
            }
        }

        function HttpURl() {
            // const HttpURL = Java.use("ug5.s")
        }

        function HttpURL_Builder() {
            const Builder = Java.use("ug5.s$a")
            // public final HttpUrl build() {
            Builder["b"].implementation = function () {
                const tag = "Okhttp3.HttpUrl.Builder.build"
                Log.p(tag, `${tag} enter`)
                // Log.stack(tag)
                let r = this["b"]()
                Log.r(tag, `${gson(r)}`)
                return r
            }
        }
    }

    static Thrift() {
        // TProtol()
        // TCompactProtocol()
        TServiceClient()

        function TProtol() {
            const TProtocol = Java.use("vh5.e")
            TProtocol["c"].implementation = function () {
                const tag = "TProtocol.getScheme"
                // Log.stack(tag)
                let r = this["c"]()
                Log.r(tag, `${gson(r)}`)
                return r
            }
        }

        function TCompactProtocol() {
            const klass = Java.use("org.apache.thrift.protocol.a")
            // klass["$init"].overload('xh5.d').implementation = function (p1) {
            //     const tag = "TCompactProtocol.init(p1)"
            //     Log.i(tag, `enter`)
            //     Log.p(tag, `p1: ${gson(p1)}`)
            //     // Log.stack(tag)
            //     this["$init"](p1)
            //     Log.i(tag, `leave`)
            // }
            // klass["$init"].overload('xh5.d', 'long', 'long').implementation = function (p1, p2, p3) {
            //     const tag = "TCompactProtocol.init(p1,p2,p3)"
            //     Log.i(tag, `enter`)
            //     Log.p(tag, `p1: ${gson(p1)}`)
            //     Log.p(tag, `p2:${p2}`)
            //     Log.p(tag, `p3:${p3}`)
            //     // Log.stack(tag)
            //     this["$init"](p1, p2, p3)
            //     Log.i(tag, `leave`)
            // }
            klass["U"].implementation = function (type: any) {
                const tag = "TCompactProtocol.getTType"
                Log.i(tag, `enter`)
                Log.p(tag, `type:${type}`)
                // Log.stack(tag)
                let r = this["U"](type)
                Log.r(tag, `${r}`)
                Log.i(tag, `leave`)
                return r
            }
            klass["f"].implementation = function () {
                const tag = "TCompactProtocol.readByte"
                Log.i(tag, `enter`)
                // Log.stack(tag)
                let r = this["f"]()
                Log.r(tag, `${r}`)
                Log.i(tag, `leave`)
                return r
            }
            klass["A"].implementation = function (val: any) {
                const tag = `TCompactProtocol.writeByte`
                Log.i(tag, `enter`)
                Log.p(tag, `byte:${val}`)
                // Log.stack(tag)
                this["A"](val)
                Log.i(tag, `leave`)
            }
            klass["G"].implementation = function (val: any) {
                const tag = `TCompactProtocol.writeI32`
                Log.i(tag, `enter`)
                Log.p(tag, `int:${val}`)
                // Log.stack(tag)
                this["G"](val)
                Log.i(tag, `leave`)
            }
            klass["y"].implementation = function (val: any) {
                const tag = `TCompactProtocol.writeBinary`
                Log.i(tag, `enter`)
                Log.p(tag, `binary:${val}`)
                // Log.stack(tag)
                this["y"](val)
                Log.i(tag, `leave`)
            }

            // const factory = Java.use("org.apache.thrift.protocol.a$a")
            // factory["H1"].implementation = function (p1) {
            //     const tag = "TCompactProtocolFactory.getProtocol"
            //     Log.i(tag, `enter`)
            //     Log.p(tag, `p1: ${gson(p1)}`)
            //     // Log.stack(tag)
            //     this["H1"](p1)
            //     Log.i(tag, `leave`)
            // }
        }

        function TServiceClient() {
            const TServiceClient = Java.use("org.apache.thrift.n")
            TServiceClient["a"].implementation = function (methodName: string, result: any) {
                const tag = `TServiceClient.receiveBase`
                Log.p(tag, `methodname: ${methodName}`)
                Log.p(tag, `result: ${gson(result)}`)
                Log.i(tag, `seqid: ${this["c"].value}`)
                Log.stack(tag)
                this["a"](methodName, result)
                Log.r(tag, `methodname: ${methodName}, result: ${gson(result)}, seqid: ${this["c"].value}`)
            }
            TServiceClient["b"].implementation = function (methodName: string, args: any) {
                const tag = `TServiceClient.sendBase`
                // const oprot_ = this["_b"].value
                // const trans_ = oprot_["_a"].value
                // const seqid = this["c"].value
                // Thrift.log_tprotocol(this)
                // Log.e(tag, `oprot_: ${(oprot_)}`)
                // Log.e(tag, `trans_: ${(trans_)}`)
                Log.p(tag, `methodname:${methodName}`)
                Log.p(tag, `args: ${gson(args)}`)
                Log.stack(tag)
                this["b"](methodName, args)
            }
        }

        function logTprotocol(client: any) {
            const tag = `logTprotocol`
            const iprot_ = client["_a"].value
            const trans_ = iprot_["_a"].value
            const data = Java.cast(trans_, Java.use("ib5.e"))["c"].value
            // Log.i(tag, `tprotocol: ${ gson(iprot_) }`)
            Log.i(tag, `transprot: ${gson(trans_)}`)
            Log.i(tag, `transprot_data: ${gson(data)}`)
        }
    }
}

setImmediate(() => {
    AntiAntiFrida()
    if (Java.available) {
        Java.perform(() => {
            FridaScript.LineThrift()
            FridaScript.JavaPackage()
            FridaScript.OkHttp()
            FridaScript.Thrift()
            // FridaScript.AndroidPackage()
            FridaScript.LegyRequest()
            FridaScript.JSON()

            FridaScript.LineRegister()
            // FridaScript.LineUserProfileImage()
            // FridaScript.LineAccessToken()
            // FridaScript.LineContact()
            FridaScript.LineSendMessage()
        })
    }
})