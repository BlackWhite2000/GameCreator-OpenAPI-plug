module OpenAPI {

    /**
     * 操作系统工具
     */
    export class OsUtils {

        /**
         * 获取当前操作系统的用户名称
         * 
         * 只支持Windows系统
         * 
         * @example
         * ```ts
         * const systemUserName = OpenAPI.OsUtils.systemUserName
         * ```
         */
        static get systemUserName(): string {
            const userInfo = OpenAPI.RunUtils.os.userInfo();
            if (userInfo == null) {
                return "";
            }
            if (userInfo.username == null) {
                return "";
            }

            try {
                let fullName = "";
                let buffer = OpenAPI.RunUtils.child_process.execSync(`wmic useraccount where name="${userInfo.username}" get fullname`, { encoding: 'buffer' });
                const langInfo = window.navigator.language;
                let decoder;
                if (langInfo == "zh-CN") {
                    decoder = new TextDecoder('gbk');
                }
                else {
                    decoder = new TextDecoder();
                }
                let info: string = decoder.decode(buffer);
                let fullNameInfo = info.split("\n")[1];
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
    }
}