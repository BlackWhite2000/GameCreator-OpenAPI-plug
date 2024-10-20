/**
 * Created by woziji00226 on 2024-07-31 14:13:45.
 */
class W26_TraceConsole {
    //当触发未捕捉事件时触发
    public static EVENT_ON_UNCAUGHTEXCEPTION = "W26_TraceConsole_EVENT_ON_UNCAUGHTEXCEPTION";

    private static _traceConsole: W26_TraceConsole;

    private ignoreArray = [
        ["TypeError: Failed to execute 'shaderSource' on 'WebGLRenderingContext': parameter 1 is not of type 'WebGLShader"],
        ["at Function.AssetManager.textureToBase64", "TypeError: Cannot read property 'buffer' of null"],
    ]

    private _logDirName: string = "logs";

    private _logDirPath: string;

    private fs: any;

    private path: any;

    private os: any;

    private process: any;

    private child_process: any;

    private _filePath: string;

    private win: any;

    private contents: string[] = [];

    private callbackUncaughtExceptionList: Callback[] = [];

    private syncTaskName: string = "w26_log_write"

    private systemInfo: {
        os: string,
        cpu: string,
        gpu: string,
        memory: string,
        board: string,
        soundDevice: string,
        network: string

    } = null;

    private gameSystemInfo: {
        name: string,
        ver: string
    } = null

    private gpuInfo: {
        info: string
    } = { info: "" } as any

    //一些预设

    //总是记录 即不管有没有报错都记录
    //private alwaysRecord: boolean = true;

    constructor() {

        //@ts-ignore fs文件模块
        this.fs = gcTop.require("fs");

        //@ts-ignore fs文件模块
        this.os = gcTop.require("os");

        //@ts-ignore path路径模块
        this.path = gcTop.require("path");

        //@ts-ignore path路径模块
        this.process = gcTop.require("process");

        //@ts-ignore path路径模块
        this.child_process = gcTop.require("child_process");

        //@ts-ignore
        this.win = gcTop.require('nw.gui').Window.get();

    }

    private onError() {
        if (WorldData.w26_traceControl_quiet) {
            this.uploadLog(() => {

            });
        }
        else {
            var select = confirm("该程序崩溃，不是演示效果，是否允许上传本次运行的log和error和硬件信息文件至远程服务器，让开发者检查错误？");
            if (select == true) {
                this.uploadLog(() => {
                    alert("上传成功！感谢您的支持");
                });
            }
            else {

            }
        }
    }

    private onErrorEvent() {
        if (!WorldData.w26_traceControl_upload) {
            return;
        }
        this.onError();
    }


    private uploadLog(callback: Function = null) {
        W26_TraceConsoleLogUpload.TraceConsoleLogUpload.uploadFile(this._filePath, () => {
            if (callback != null) {
                callback.apply(this);
            }
        });
    }

    /**
     * 重写console.log 使其写入log文件
     */
    private overrideConsoleLog() {
        var console_log = console.log;
        console.log = (...args) => {
            console_log.apply(this, [...args]);
            var out = this.outPut(args);
            this.appendLog("log", out);
            return out;
        }
    }

    /**
     * 重写console.error 使其写入log文件
     */
    private overrideConsoleError() {
        var console_error = console.error;
        console.error = (...args) => {
            console_error.apply(this, [...args]);
            var out = this.outPut(args);
            this.appendLog("error", out);
            return out;
        }
    }

    /**
     * 重写console.warn 使其写入log文件
     */
    private overrideConsoleWarn() {
        var console_warn = console.warn;
        console.warn = (...args) => {
            console_warn.apply(this, [...args]);
            var out = this.outPut(args);
            this.appendLog("warn", out);
            return out;
        }
    }

    /**
     * 重写trace 使其写入log文件
     */
    private overrideTrace() {
        var _trace = window.trace;
        window.trace = (...args) => {
            _trace.apply(console, args);
            var out = this.outPut(args);
            this.appendLog("trace", out);
            return out;
        }
    }

    /**
     * 获取log文件地址
     * @return [string] 
     */
    private getFilePath(): string {
        var filePath = "";
        var hostname = this.sanitizeFileName(this.os.hostname());
        filePath = this.path.join(this._logDirPath, hostname + "_" + this.getCurrentDateTime() + ".log");
        return filePath;
    }

    /**
     * 文件名去除不规范字符
     */
    private sanitizeFileName(fileName) {
        // 定义非法字符列表
        var invalidChars = /[<>:"/\\|?*\x00-\x1f]/g;
        // 使用空字符串替换所有非法字符
        var sanitizedFileName = fileName.replace(invalidChars, '');
        // 为了增加可读性，可以考虑用下划线或连字符替换非法字符
        //const safeFileName = sanitizedFileName.replace(invalidChars, '_');
        return sanitizedFileName;
    }

    /**
     * 将对象等，转换成string
     * @return [string] 
     */
    private outPut(...args): string {
        var maxCount = 10;
        var stackCount = 0;

        var handleOutPut = function (args: Array<any>) {
            var result = "";
            for (var i = 0; i < args.length; i++) {
                //深度不得超过10层
                stackCount = 0;
                result += handle(args[i]);
            }
            return result;
        }

        var handle = function (arg: any): string {
            if (typeof arg === 'object') {
                try {
                    stackCount += 1;
                    if (stackCount >= maxCount) {
                        return "... ..."
                    }
                    var keys = Object.getOwnPropertyNames(arg);
                    var newObject = {};
                    for (var j = 0; j < keys.length; j++) {
                        newObject[keys[j]] = handle(arg[keys[j]]);
                    }
                    return JSON.stringify(newObject, null, 2); // 对于对象，使用JSON.stringify转换
                } catch (e) {
                    try {
                        return String(arg);
                    }
                    catch (ex) {
                        return '[Object with circular reference]';
                    }
                }
            }
            else if (typeof arg === 'string') {
                return arg;
            }
            else {
                return String(arg);
            }
        }

        var res = handleOutPut(args);

        res = res.replace(/[\r\n]/g, '\r\n');
        res = res.replace(/\\r/g, "\r\n");
        res = res.replace(/\\n/g, "\r\n");

        return res;
    }


    /**
     * 追加log
     * @param _type 
     * @param content 
     */
    private appendLog(_type: string, content: string) {

        //检查是否需要记录log
        if (_type == "log" || _type == "trace") {
            if (!WorldData.w26_traceControl_record_log) return;
        }

        //检查是否需要记录warn
        if (_type == "warn") {
            if (!WorldData.w26_traceControl_record_warn) return;
        }

        //检查是否需要记录error
        if (_type == "error") {
            if (!WorldData.w26_traceControl_record_error) return;
        }

        var text = "{类型: " + _type + " \r\n" + content + "\r\n" + "当前时间: " + this.getCurrentDateTime() + "}\r\n";

        //总是记录时，将其记录在文件里
        this.appendToFile(this._filePath, text);

        //this.appendToFile(this._filePath, text);
    }

    /**
     * 获取当前内存的使用信息
     */
    private getCurrentMemoryUseInfo(): string {
        return (((this.os.totalmem() / (1024 * 1024 * 1024)).toFixed(2)).toString() + ' GB') + "(总内存)  " + (((this.os.freemem() / (1024 * 1024 * 1024)).toFixed(2)).toString() + ' GB(剩余内存)');
    }

    /**
     * 记录GPU 使用情况
     */
    private appendGPUInfo() {

        //英伟达显卡
        new SyncTask(this.syncTaskName, () => {

            this.child_process.exec('nvidia-smi --query-gpu=name,memory.total,memory.used,memory.free --format=csv', (error, stdout, stderr) => {
                //debugger;
                try {

                    if (error) {
                        throw new Error("错误");
                    }

                    if (stderr) {
                        throw new Error("错误");
                    }

                    // 解析输出
                    const lines = stdout.trim().split('\n');
                    const headers = lines[0].split(',');
                    const gpus = [];

                    for (let i = 1; i < lines.length; i++) {
                        const values = lines[i].split(',').map(value => value.trim());
                        const gpu = {};

                        for (let j = 0; j < headers.length; j++) {
                            gpu[headers[j].trim()] = values[j].trim();
                        }
                        gpus.push(gpu);
                    }

                    var info = "";

                    for (var i = 0; i < gpus.length; i++) {
                        var gpu = gpus[i];
                        info += `\r\n`;
                        info += `GPU ${i + 1}: Name: ${gpu["name"]} Memory Total: ${gpu["memory.total [MiB]"]} MiB Memory Used: ${gpu["memory.used [MiB]"]} MiB Memory Free: ${gpu["memory.free [MiB]"]} MiB`
                        info += '\r\n';
                    }

                    this.gpuInfo.info = info;
                    // SyncTask.taskOver(this.syncTaskName);
                }
                catch (e) {

                }
                finally {
                    SyncTask.taskOver(this.syncTaskName);
                }
            });

        });

        new SyncTask(this.syncTaskName, () => {
            //debugger;
            this.writeToFileEnd(this._filePath, this.gpuInfo.info, () => {
                SyncTask.taskOver(this.syncTaskName);
            })
        });

    }

    /**
     * 读取一些基本信息
     */
    private loadSystemInfo() {
        var handleInfo = function (info) {
            var result = "";
            var array = info.split("\n");
            //debugger;
            for (var i = 0; i < array.length; i++) {
                if (array[i].replace(" ", "") == "") {

                }
                else if (array[i] == "\n" || array[i] == "\r" || array[i] == "\r\n" || array[i] == "\r\r") {

                }
                else {
                    result += array[i];
                    result += "\r\n";
                }
            }

            return result;
        }

        const langInfo = window.navigator.language;
        var decoder;
        if (langInfo == "zh-CN") {
            decoder = new TextDecoder('gbk');
        }
        else {
            decoder = new TextDecoder();
        }
        var info: string = "";
        var buffer = null;

        this.systemInfo.os = this.os.type() + ' ' + this.os.release() + ' ' + this.os.arch();
        this.systemInfo.memory = this.getCurrentMemoryUseInfo();

        new SyncTask(this.syncTaskName, () => {
            //获取系统版本 教育版 专业版 家庭版。。。
            this.child_process.exec('wmic os get Caption', { encoding: 'buffer' }, (error, buffer, stderr) => {
                //debugger;
                if (error) {
                    this.systemInfo.os += "错误"
                    SyncTask.taskOver(this.syncTaskName);
                    return;
                }
                if (stderr.length > 0) {
                    this.systemInfo.os += "错误"
                    SyncTask.taskOver(this.syncTaskName);
                    return;
                }


                info = decoder.decode(buffer);
                this.systemInfo.os += " " + handleInfo(info);
                SyncTask.taskOver(this.syncTaskName);
            });
        })

        new SyncTask(this.syncTaskName, () => {
            //获取CPU型号
            this.child_process.exec('wmic cpu get Name', { encoding: 'buffer' }, (error, buffer, stderr) => {
                if (error) {
                    this.systemInfo.cpu = "错误"
                    SyncTask.taskOver(this.syncTaskName);
                    return;
                }
                if (stderr.length > 0) {
                    this.systemInfo.cpu = "错误"
                    SyncTask.taskOver(this.syncTaskName);
                    return;

                }
                info = decoder.decode(buffer);
                this.systemInfo.cpu = handleInfo(info);
                SyncTask.taskOver(this.syncTaskName);
            });
        })

        new SyncTask(this.syncTaskName, () => {
            //获取GPU型号
            this.child_process.exec('wmic path Win32_VideoController get Name', { encoding: 'buffer' }, (error, buffer, stderr) => {
                if (error) {
                    this.systemInfo.gpu = "错误"
                    SyncTask.taskOver(this.syncTaskName);
                    return;
                }
                if (stderr.length > 0) {
                    this.systemInfo.gpu = "错误"
                    SyncTask.taskOver(this.syncTaskName);
                    return;

                }
                info = decoder.decode(buffer);
                this.systemInfo.gpu = handleInfo(info);
                SyncTask.taskOver(this.syncTaskName);
            });
        })

        new SyncTask(this.syncTaskName, () => {
            //获取主板型号
            this.child_process.exec('wmic baseboard get product', { encoding: 'buffer' }, (error, buffer, stderr) => {
                if (error) {
                    this.systemInfo.board = "错误"
                    SyncTask.taskOver(this.syncTaskName);
                    return;
                }
                if (stderr.length > 0) {
                    this.systemInfo.board = "错误"
                    SyncTask.taskOver(this.syncTaskName);
                    return;
                }
                info = decoder.decode(buffer);
                this.systemInfo.board = handleInfo(info);
                SyncTask.taskOver(this.syncTaskName);
            });
        })

        new SyncTask(this.syncTaskName, () => {
            //获取内存型号
            this.child_process.exec('wmic memorychip get Manufacturer, PartNumber, Speed, Capacity', { encoding: 'buffer' }, (error, buffer, stderr) => {
                if (error) {
                    this.systemInfo.memory += "错误"
                    SyncTask.taskOver(this.syncTaskName);
                    return;
                }
                if (stderr.length > 0) {
                    this.systemInfo.memory += "错误"
                    SyncTask.taskOver(this.syncTaskName);
                    return;
                }
                info = decoder.decode(buffer);
                this.systemInfo.memory += "\r\n" + handleInfo(info);
                SyncTask.taskOver(this.syncTaskName);
            });
        })

        new SyncTask(this.syncTaskName, () => {
            //获取声卡型号
            this.child_process.exec('wmic path Win32_SoundDevice get Name, Manufacturer', { encoding: 'buffer' }, (error, buffer, stderr) => {
                if (error) {
                    this.systemInfo.soundDevice = "错误"
                    SyncTask.taskOver(this.syncTaskName);
                    return;
                }
                if (stderr.length > 0) {
                    this.systemInfo.soundDevice = "错误"
                    SyncTask.taskOver(this.syncTaskName);
                    return;

                }
                info = decoder.decode(buffer);
                this.systemInfo.soundDevice = handleInfo(info);
                SyncTask.taskOver(this.syncTaskName);
            });
        })

        new SyncTask(this.syncTaskName, () => {
            //获取网卡型号
            this.child_process.exec(`wmic path Win32_NetworkAdapter where "MACAddress<>'' and NetEnabled=TRUE" get Name, Manufacturer, MACAddress, DeviceID`, { encoding: 'buffer' }, (error, buffer, stderr) => {
                if (error) {
                    this.systemInfo.network = "错误"
                    SyncTask.taskOver(this.syncTaskName);
                    return;
                }
                if (stderr.length > 0) {
                    this.systemInfo.network = "错误"
                    SyncTask.taskOver(this.syncTaskName);
                    return;

                }
                info = decoder.decode(buffer);
                this.systemInfo.network = handleInfo(info);
                SyncTask.taskOver(this.syncTaskName);
            });
        })

    }
    /**
     * 得到系统信息
     */
    private getSystemInfo(): string {
        var result = `系统:\r\n${this.systemInfo.os}主板:\r\n${this.systemInfo.board}内存:\r\n${this.systemInfo.memory}CPU:\r\n${this.systemInfo.cpu}GPU:\r\n${this.systemInfo.gpu}声卡:\r\n${this.systemInfo.soundDevice}网卡:\r\n${this.systemInfo.network}`;
        return result;
    }

    /**
     * 获得游戏信息
     * @return [string] 
     */
    private getGameSystemInfo(): string {
        var result = `游戏名: ${this.gameSystemInfo.name}\r\n\r\n当前版本: ${this.gameSystemInfo.ver}\r\n\r\n`;
        return result;
    }

    private appendGameSystemInfo() {
        if (this.gameSystemInfo == null) {
            this.gameSystemInfo = {
                name: Config["gameProjectName"],
                ver: Config["gameVersion"]
            }
        }

        new SyncTask(this.syncTaskName, () => {
            this.writeToFileEnd(this._filePath, this.getGameSystemInfo(), () => {
                SyncTask.taskOver(this.syncTaskName);
            })
        });
    }

    /**
     * 添加系统信息到文件末尾
     */
    private appendSystemInfo() {
        if (!WorldData.w26_traceControl_record_systemInfo) {
            return;
        }

        if (this.systemInfo == null) {
            this.systemInfo = {
                os: "",
                cpu: "",
                gpu: "",
                memory: "",
                board: "",
                soundDevice: "",
                network: ""
            }
            this.loadSystemInfo();
        }

        new SyncTask(this.syncTaskName, () => {
            this.writeToFileEnd(this._filePath, this.getSystemInfo(), () => {
                SyncTask.taskOver(this.syncTaskName);
            })
        });

    }

    private writeToFileEnd(filePath, content, callBack = null) {
        var finish = false;

        var log = this.fs.createWriteStream(filePath, { flags: 'a' });
        log.write(content, 'utf8');
        log.end();

        log.on('finish', () => {
            if (!finish) {
                finish = true;
                if (callBack != null) callBack.apply(this);
            }
        })

        log.on('error', (err) => {
            if (!finish) {
                finish = true;
                if (callBack != null) callBack.apply(this);
            }
        });

        log.on('close', () => {
            if (!finish) {
                finish = true;
                if (callBack != null) callBack.apply(this);
            }
        });
    }


    /**
     * 向指定文件追加内容。
     * @param {string} filePath - 文件的路径。
     * @param {string} content - 要写入的内容。
     */
    private appendToFile(filePath, content) {
        if (this.gameSystemInfo == null) {
            this.appendGameSystemInfo();
        }

        if (this.systemInfo == null && WorldData.w26_traceControl_record_systemInfo) {
            this.appendSystemInfo();
        }

        new SyncTask(this.syncTaskName, this.writeToFileEnd, [filePath, content, () => {
            SyncTask.taskOver(this.syncTaskName);
        }], this);
    }




    /**
     * 获取当前日期和时间，并格式化为 "年_月_日_小时_分钟_秒" 的形式。
     * @returns {string} 格式化的日期时间字符串。
     */
    private getCurrentDateTime() {
        const now = new Date();
        // 获取年、月、日、小时、分钟、秒
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的，所以加1
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        // 拼接字符串
        return `${year}_${month}_${day}_${hours}_${minutes}_${seconds}`;
    }


    /**
     * 确保指定的目录存在，如果不存在则创建它。
     * @param {string} dirPath - 目录的路径。
     */
    private ensureDirExists(dirPath) {
        // 检查目录是否存在
        this.fs.access(dirPath, this.fs.constants.F_OK, (err) => {
            if (err) {
                // 如果目录不存在，则尝试创建它
                this.fs.mkdir(dirPath, { recursive: true }, (mkdirErr) => {
                    if (mkdirErr) {
                        //console.error(`Failed to create directory: ${dirPath}`);
                        //throw mkdirErr;
                    }
                    //console.log(`Directory created: ${dirPath}`);
                });
            } else {
                //console.log(`Directory already exists: ${dirPath}`);
            }
        });
    }



    /**
    * 获得路径
    * @param filePath 
    * @param isAbsolute[可选] 默认值=false 
    * @return [string] 
    */
    private getPath(filePath: string, isAbsolute: boolean = false): string {
        var path = filePath;
        if (!isAbsolute) {
            if (!Config.RELEASE_GAME) {
                //@ts-ignore
                path = decodeURIComponent(Laya.URL.formatURL(filePath));
            }
            else {
                //@ts-ignore
                path = FileUtils.nativePath + "/" + filePath;
            }
        }
        return path;
    }

    /**
     * 获得保存log文件夹路径
     * @param dirname 
     */
    private getDirPath(dirname: string) {
        if (WorldData.w26_traceControl_userApp) {
            var userFolder = this.path.join(this.os.homedir(), 'Documents', WorldData.w26_traceControl_gameName, dirname);
            return this.getPath(userFolder, true);
        }
        else {
            return this.getPath(dirname);
        }
    }

    /**
     * 检查文件是否能读取
     */
    private checkFileSync(filePath) {
        try {
            this.fs.accessSync(filePath, this.fs.constants.F_OK);
            return true; // 文件存在且可访问
        } catch (err) {
            return false; // 文件不存在或不可访问
        }
    }

    /**
     * 注册自定义 log记录。在游戏触发未捕捉异常的时候，将其记录
     * @param callBack 返回一个字符串，该字符串将记录
     * @param thisPtr
     * @param arg 
     */
    private registerCustomLogOnUncaughtException(callback: Callback) {
        this.callbackUncaughtExceptionList.push(callback);
    }

    /**
     *处理那些自定义的log
     */
    private handleCustomLog() {
        for (var i = 0; i < this.callbackUncaughtExceptionList.length; i++) {
            var callback = this.callbackUncaughtExceptionList[i];
            console.log(callback.run());
        }
    }

    /**
     * 用于测试错误
     */
    private test() {
        throw new Error("这是一个测试错误");
    }

    /**
     * 该错误应该被忽视
     * @param message 
     * @return [boolean] 
     */
    private isIgnore(message: string): boolean {
        for (var i = 0; i < this.ignoreArray.length; i++) {
            var res = true;
            for (var j = 0; j < this.ignoreArray[i].length; j++) {
                //数个条件都存在时 这条记录才允许 被忽视
                if (message.indexOf(this.ignoreArray[i][j]) == -1) {
                    res = false;
                    break;
                }
            }
            //得出结果
            if (res == true) {
                return true;
            }
        }

        for (var i = 0; i < WorldData.w26_traceControl_ignore.length; i++) {
            if (-1 != message.indexOf(WorldData.w26_traceControl_ignore[i])) {
                return true;
            }
        }

        return false;
    }

    /**
     * 全异常可以上传
     * @return [boolean] 
     */
    private isUploadAllException(): boolean {
        if (!WorldData.w26_traceControl_event_error_upload) {
            return true;
        }
        return false;
    }

    /**
     * 开始 log记录
     */
    public start() {
        console.log("启动 log记录");

        this._logDirPath = this.getDirPath(this._logDirName);
        this.ensureDirExists(this._logDirPath);
        this._filePath = this.getFilePath();
        this.overrideConsoleLog();
        this.overrideConsoleError();
        this.overrideConsoleWarn();
        this.overrideTrace();

        var self = this;

        //发生异常时
        window.onerror = (message, source, lineno, colno, error) => {
            var errorStr: string = console.error(error.stack, "内存: " + this.getCurrentMemoryUseInfo()) as any;
            this.appendGPUInfo();
            this.handleCustomLog();
            EventUtils.happen(W26_TraceConsole, W26_TraceConsole.EVENT_ON_UNCAUGHTEXCEPTION, [error]);
            new SyncTask(this.syncTaskName, () => {
                if (!this.isIgnore(errorStr)) {
                    if (this.isUploadAllException()) {
                        //所有异常都上传
                        this.onErrorEvent();
                    }
                }
                SyncTask.taskOver(this.syncTaskName);
            })
        };

        //当遇到没有捕捉的错误时记录并退出
        this.process.on('uncaughtException', (err) => {
            var errorStr: string = console.error(err, "内存: " + this.getCurrentMemoryUseInfo()) as any;
            this.appendGPUInfo();
            this.handleCustomLog();
            EventUtils.happen(W26_TraceConsole, W26_TraceConsole.EVENT_ON_UNCAUGHTEXCEPTION, [err]);
            new SyncTask(this.syncTaskName, () => {
                if (!this.isIgnore(errorStr)) {
                    if (this.isUploadAllException()) {
                        //所有异常都上传
                        this.onErrorEvent();
                    }
                }
                SyncTask.taskOver(this.syncTaskName);
            })
        });

        //当遇到没有捕捉的promise错误时记录并退出
        this.process.on('unhandledRejection', (reason, promise) => {
            //只在报错的时候记录
            var errorStr: string = console.error(reason, "内存: " + this.getCurrentMemoryUseInfo()) as any;
            this.appendGPUInfo();
            this.handleCustomLog();
            EventUtils.happen(W26_TraceConsole, W26_TraceConsole.EVENT_ON_UNCAUGHTEXCEPTION, [reason]);
            new SyncTask(this.syncTaskName, () => {
                if (!this.isIgnore(errorStr)) {
                    if (this.isUploadAllException()) {
                        //所有异常都上传
                        this.onErrorEvent();
                    }
                }
                SyncTask.taskOver(this.syncTaskName);
            })
        });

        var self = this;

        var commandpage_event = CommandPage["executeEvent"];
        CommandPage["executeEvent"] = function (trigger, playerInput) {
            if (self.isUploadAllException()) {
                //上传全部异常时，按以前的做法
                commandpage_event.apply(this, arguments);
            }
            else {

                try {
                    commandpage_event.apply(this, arguments);
                } catch (err) {

                    var errorStr: string = console.error(err, "内存: " + self.getCurrentMemoryUseInfo()) as any;
                    self.appendGPUInfo();
                    self.handleCustomLog();
                    EventUtils.happen(W26_TraceConsole, W26_TraceConsole.EVENT_ON_UNCAUGHTEXCEPTION, [errorStr]);

                    if (!WorldData.w26_traceControl_quiet) {
                        //非静默时弹出框提示该错误
                        alert(err.stack);
                    }

                    new SyncTask(self.syncTaskName, () => {
                        if (!self.isIgnore(errorStr)) {
                            self.onErrorEvent();
                        }
                        SyncTask.taskOver(self.syncTaskName);
                    })


                }
            }
        };
    }

    public static get TraceConsole() {
        if (this._traceConsole == null) {
            this._traceConsole = new W26_TraceConsole();
        }
        return this._traceConsole;
    }

}

EventUtils.addEventListener(ClientWorld, ClientWorld.EVENT_INITED, Callback.New(() => {
    if (os.platform == 2) {
        //在windows环境下使用
        Callback.New(() => {
            var enable = false;
            if (Config.RELEASE_GAME) {
                enable = true;
            }
            else if (WorldData.w26_traceControl_debugger) {
                enable = true;
            }

            if (enable) {
                if (WorldData.w26_traceControl_enable) {
                    W26_TraceConsole.TraceConsole.start();
                }
            }
        }, this).delayRun(100);
    }
}, this), true);