/**
 * Created by woziji00226 on 2024-08-01 09:16:44.
 */
class W26_TraceConsoleLogUpload {

    private static traceConsoleLogUpload: W26_TraceConsoleLogUpload;

    private path: any;

    private fs: any;
    //process.env.NODE_TLS_REJECT_UNAUTHORIZED = “0”;
    //服务器
    private server: {
        host: string,//地址
        port: string,
        email: string,//转发目标email
    } = { host: "122.51.13.82", port: "80", email: "634953177@qq.com" }

    constructor() {
        //@ts-ignore path路径模块
        this.fs = gcTop.require("fs");
        //@ts-ignore path路径模块
        this.path = gcTop.require("path");

        this.server.host = WorldData.w26_traceControl_server_host;
        this.server.port = WorldData.w26_traceControl_server_port.toString();
        this.server.email = WorldData.w26_traceControl_server_email;

    }

    private checkFileSync(filePath) {
        try {
            this.fs.accessSync(filePath, this.fs.constants.F_OK);
            return true; // 文件存在且可访问
        } catch (err) {
            return false; // 文件不存在或不可访问
        }
    }

    /**
     * 上传文件
     * @param filePath 
     * @param toEmail 
     * @param targetUrl 
     * @param successCallback[可选] 默认值=null 
     * @param failCallback[可选] 默认值=null 
     */
    private uploadFileWithParams(filePath: string, extraParams: { toEmail: string }, targetUrl: string, successCallback: Function = null, failCallback: Function = null) {
        // 读取文件内容
        this.fs.readFile(filePath, { encoding: null }, (err, data) => {
            try {
                if (err) {
                    console.error('Error reading file:', err);
                    if (failCallback != null) failCallback.apply(this, []);
                    return;
                }

                // 创建新的XMLHttpRequest对象
                const xhr = new XMLHttpRequest();
                // 设置请求类型和URL
                xhr.open('POST', targetUrl, true);
                // 设置请求头

                // 定义onreadystatechange回调函数
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                        console.log('Server response:', xhr.responseText);
                    }
                };

                // 设置请求完成后的回调函数
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        console.log('文件上传成功');
                        console.log(xhr.responseText);
                        if (successCallback != null) successCallback.apply(this, []);
                    } else {
                        console.error('文件上传失败');
                        if (failCallback != null) failCallback.apply(this, []);
                    }
                };

                // 设置请求错误时的回调函数
                xhr.onerror = function (e) {
                    console.error('网络错误');
                    if (failCallback != null) failCallback.apply(this, []);
                };

                // 将Buffer转换为Blob
                const fileBlob = new Blob([data], { type: 'application/octet-stream' });

                // 创建formData对象
                const formData = new FormData();
                var gameProJectName = Config["gameProjectName"] == null ? "" : Config["gameProjectName"];
                formData.append('file', fileBlob, gameProJectName + "_" + this.path.basename(filePath)); // 文件名可以根据需要设置
                for (const [key, value] of Object.entries(extraParams)) {
                    //@ts-ignore
                    formData.append(key, value);
                }

                // 发送请求
                xhr.send(formData);
            }
            catch (e) {
                console.error(e);
                if (failCallback != null) failCallback.apply(this, []);
            }
        });

    }

    public uploadFile(filePath: string, callback: Function) {
        if (!this.checkFileSync(filePath)) {
            return;
        }
        var url = `http://${this.server.host}:${this.server.port}/upload`
        this.uploadFileWithParams(filePath, { toEmail: this.server.email }, url, callback);
    }

    public static get TraceConsoleLogUpload() {
        if (this.traceConsoleLogUpload == null) {
            this.traceConsoleLogUpload = new W26_TraceConsoleLogUpload();
        }
        return this.traceConsoleLogUpload;
    }
}


EventUtils.addEventListener(ClientWorld, ClientWorld.EVENT_INITED, Callback.New(() => {
    if (os.platform == 2) {

    }
}, this), true);