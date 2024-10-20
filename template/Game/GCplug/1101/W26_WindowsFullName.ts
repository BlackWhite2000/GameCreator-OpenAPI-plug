/**
 * Created by woziji00226 on 2024-08-02 14:12:20.
 */
class W26_WindowsFullName {
    private static windowsFullName: W26_WindowsFullName;

    private child_process: any;
    private os: any;

    constructor() {
        //@ts-ignore
        this.child_process = gcTop.require('child_process');
        //@ts-ignore
        this.os = gcTop.require('os');
    }


    public get fullName(): string {
        const userInfo = this.os.userInfo();
        if (userInfo == null) {
            return "";
        }
        if (userInfo.username == null) {
            return "";
        }

        try {
            var fullName = "";
            var buffer = this.child_process.execSync(`wmic useraccount where name="${userInfo.username}" get fullname`, { encoding: 'buffer' });
            const langInfo = window.navigator.language;
            var decoder;
            if (langInfo == "zh-CN") {
                decoder = new TextDecoder('gbk');
            }
            else {
                decoder = new TextDecoder();
            }
            var info: string = decoder.decode(buffer);
            var fullNameInfo = info.split("\n")[1];
            fullName = fullNameInfo.trim();
            if (fullName == "") {
                //如果是空的时候就用用户名
                fullName = userInfo.username;
            }
            return fullName;
        }
        catch (e) {
            console.error(e);
            return userInfo.username;
        }
    }


    public static get WindowsFullName() {
        if (this.windowsFullName == null) {
            this.windowsFullName = new W26_WindowsFullName();
        }
        return this.windowsFullName;
    }

}

module CustomGameString {
    /**
     * 自定义游戏数值
     * @param trigger 触发器，可能为空
     * @param p 自定义数值参数 
     */
    export function f9(trigger: CommandTrigger, p: CustomGameStringParams_9): string {
        return W26_WindowsFullName.WindowsFullName.fullName;
    }
}