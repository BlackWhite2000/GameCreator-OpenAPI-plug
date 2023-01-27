module OpenAPI {

    /**
     * CryptoJS
     */
    export class CryptoJS {

        /**
         * AES加密
         * @param {string} data 需要加密的数据
         * @param {string} key 密钥 必须16字符, 不可泄漏
         * @param {string} iv iv 必须16字符, 必须随机生成
         */
        static AES(data: string, key: string, iv: string) {

            // 密钥
            let secretKey = OpenAPI_CryptoJS.enc.Utf8.parse(key);

            // iv
            let randomIv = OpenAPI_CryptoJS.enc.Utf8.parse(iv);

            // 加密CBC
            let encryptData = OpenAPI_CryptoJS.AES.encrypt(data, secretKey, {
                mode: OpenAPI_CryptoJS.mode.CBC,
                iv: randomIv,
                padding: OpenAPI_CryptoJS.pad.Pkcs7
            });

            return encryptData.toString();
        }

        /**
         * AES解密
         * @param {string} data 加密的数据
         * @param {string} key 密钥 必须16字符, 不可泄漏
         * @param {string} iv iv 必须16字符, 必须随机生成
         */
        static AES_DECRYPT(data: string, key: string, iv: string) {

            // 密钥
            let secretKey = OpenAPI_CryptoJS.enc.Utf8.parse(key);

            // iv
            let randomIv = OpenAPI_CryptoJS.enc.Utf8.parse(iv);

            // 加密CBC
            let encryptData = OpenAPI_CryptoJS.AES.decrypt(data, secretKey, {
                mode: OpenAPI_CryptoJS.mode.CBC,
                iv: randomIv,
                padding: OpenAPI_CryptoJS.pad.Pkcs7
            });

            return encryptData.toString(OpenAPI_CryptoJS.enc.Utf8)
        }
    }
}
module OpenAPI {

    /**
     * GameCreator相关API
     */
    export class GC {

        /**
         * GC平台相关API
         */
        static Cloud = {

            /**
             * 是否是GC平台
             */
            get isInGCCloud(): boolean {
                return window.location.href.indexOf("gamecreator") != -1;
            },

            /**
             * 游戏ID
             */
            get GameID(): number {
                if (!OpenAPI.GC.Cloud.isInGCCloud) return 0;
                let p = window.location.href.split("releaseProject/").pop().split("/").shift().split("_");
                return parseInt(p[1]);
            },

            /**
             * 游戏名称
             */
            get GameName(): string {
                if (!OpenAPI.GC.Cloud.isInGCCloud) return null;
                let name = document.querySelector('title').innerText;
                let p = document.querySelector('meta[name="keywords"]').getAttribute('content');
                let remove = name + " | ";
                if (p.startsWith(remove)) {
                    p = p.replace(remove, '');
                }
                return p;
            },

            /**
             * 当前版本号
             */
            get GameVersion(): number {
                if (!OpenAPI.GC.Cloud.isInGCCloud) return 0;
                let p = window.location.href.split("releaseProject/").pop().split("/");
                return parseInt(p[1]);
            },

            /**
             * 作者ID
             */
            get AuthorUID(): number {
                if (!OpenAPI.GC.Cloud.isInGCCloud) return 0;
                let p = window.location.href.split("releaseProject/").pop().split("/").shift().split("_");
                return parseInt(p[0]);
            },

            /**
             * 作者名称
             */
            get AuthorName(): string {
                if (!OpenAPI.GC.Cloud.isInGCCloud) return null;
                let p = document.querySelector('title').innerText;
                return p;
            }

        }

        /**
         * 如果是编辑器则弹窗, 如果是发布后则输出
         */
        static isCloudLog(text) {
            if (Config.RELEASE_GAME) {
                trace(text)
            } else {
                alert(text)
            }
        }
    }

}




module OpenAPI {

    /**
     * 通用API
     */
    export class Method {

        /**
         * 当前页面协议
         * @ "http://" : "https://"
         */
        static get Origin(): string {
            return window.location.protocol == "http:" ? "http://" : "https://";
        }

        /**
         * 随机字符串
         * @param {number} len 随机字符串的长度
         */
        static getRandomString(len: number) {
            let _charStr = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
                min = 0,
                max = _charStr.length - 1,
                _str = '';
            // 不允许为0的情况
            if (len == 0) {
                return;
            }
            // 循环生成字符串
            for (var i = 0, index; i < len; i++) {
                index = (function (randomIndexFunc, i) {
                    return randomIndexFunc(min, max, i, randomIndexFunc);
                })(function (min, max, i, _self) {
                    let indexTemp = Math.floor(Math.random() * (max - min + 1) + min),
                        numStart = _charStr.length - 10;
                    if (i == 0 && indexTemp >= numStart) {
                        indexTemp = _self(min, max, i, _self);
                    }
                    return indexTemp;
                }, i);
                _str += _charStr[index];
            }
            return _str;
        }

        /**
         * 日期转时间戳, 格式 1970/1/1 00:00:00
         * @param {string} date 日期
         */
        static dateToTimestamp(date: string): number {
            let time = new Date(Date.parse(date));
            return time.getTime();
        }

        /**
         * 时间戳转日期, 格式 1609459200。 支持获取特定时间 
         * @param {any} data 时间戳
         * @param {string} data_type 【可选】获取时间类型 y、m、d、h、i、s。如 s = 获取时间戳中的秒
         */
        static timestampToDate(data: number, data_type = "") {
            let _data = 0;
            if (String(data).length == 13) {
                _data = data
            } else {
                _data = data * 1000
            }
            let time = new Date(_data);
            let _time = 0;
            if (data_type == "y") {
                _time = time.getFullYear();
            }
            if (data_type == "m") {
                _time = time.getMonth() + 1;
            }
            if (data_type == "d") {
                _time = time.getDate();
            }
            if (data_type == "h") {
                _time = time.getHours();
            }
            if (data_type == "i") {
                _time = time.getMinutes();
            }
            if (data_type == "s") {
                _time = time.getSeconds();
            }
            if (data_type == "") {
                return _data;
            }
            return _time;
        }

        /**
         * 判断常量变量类型
         * @param {number} variable_index_constant 常量
         * @param {number} variable_index_variable 变量
         * @param {number} variable_index_type 选项类型
         * @param {number} variable_type 【默认数值】变量类型
         */
        static JudgeTypeConstantVariable(variable_index_constant: number, variable_index_variable: number, variable_index_type: number, variable_type = 0) {
            let variable_value;
            if (variable_index_type == 0) {
                variable_value = variable_index_constant;
            } else {
                // 数值
                if (variable_type == 0) {
                    variable_value = Game.player.variable.getVariable(variable_index_variable);
                }

                // 字符串
                if (variable_type == 1) {
                    variable_value = Game.player.variable.getString(variable_index_variable);
                }

                // 开关
                if (variable_type == 2) {
                    variable_value = Game.player.variable.getSwitch(variable_index_variable);
                }
            }
            return variable_value;
        }
    }
}
/**
 * 更多API插件
 * @author BlackWhite
 * @see https://www.gamecreator.com.cn/plug/det/641
 * @version 2.0
 */
module OpenAPI {

    /**
     * 插件的系统API
     */
    export class System {

        /**
         * 当前版本号
         */
        static Version = 2.0;

        /**
         * 是否安装本插件
         */
        static Installed = true;

    }

    // 输出
    if (typeof Config !== 'undefined' && typeof OpenAPI !== 'undefined') {
        if (!Config.RELEASE_GAME) {
          trace(`OpenAPI v${OpenAPI.System.Version.toFixed(1)} => OK`)
        } else {
          console.log(` %c OpenAPI v${OpenAPI.System.Version.toFixed(1)} %c https://www.gamecreator.com.cn/plug/det/641 `, "color: #fadfa3; background: #333; padding:8px;", "color: #111; background: #fadfa3; padding:8px;");
        }
      }

};


module OpenAPI {

    /**
     * 界面模块API
     */
    export class UI {

        /**
         * 界面列表组件数据初始化
         * @param {UIList} list 指定列表
         * @param {any} list_modelGUI 项模型数据,如：ListItem_1
         * @param {number} list_len 列表长度
         * @param {boolean} isFocus 【默认关闭】是否设置焦点
         */
        static listDataInit(list: UIList, list_modelGUI: any, list_len: number, isFocus = false) {
            let arr = [];
            for (let i = 1; i <= list_len; i++) {
                arr.push(new list_modelGUI());
            }
            list.items = arr;
            if (isFocus) {
                UIList.focus = list
            }
        }
    }
}