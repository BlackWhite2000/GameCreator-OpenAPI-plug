
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
         * 日期转时间戳 1970年1月1日 00:00:00
         * @param {Date} date 日期
         */
        static dateToTimestamp(date: Date): number {
            return date.getTime();
        }

        /**
         * 时间戳转日期 1609459200
         * @param {number} timestamp 时间戳
         */
        static timestampToDate(timestamp: number): Date {
            return new Date(timestamp);
        }

        
        /**
         * 判断常量变量类型
         * @param {number} variable_index_constant 常量
         * @param {number} variable_index_variable 变量
         * @param {number} variable_type 类型
         */
        static JudgeTypeConstantVariable(variable_index_constant, variable_index_variable, variable_type) {
            let variable_value;
            if (variable_type == 0) {
                variable_value = variable_index_constant;
            } else {
                variable_value = Game.player.variable.getVariable(variable_index_variable);
            }
            return variable_value;
        }


    }

}