module OpenAPI {
    /**
     * 字符串操作工具
     */
    export class StringUtils {

        /**
         * 将字符串转换为蛇形命名法（snake_case）。
         *
         * 蛇形命名法是一种命名约定，其中每个单词都以小写字母书写，并用下划线（_）字符分隔。
         *
         * @param {string} str - 要转换为蛇形命名法的字符串。
         * @returns {string} - 转换后的蛇形命名法字符串。
         *
         * @example
         * const convertedStr1 = snakeCase('camelCase') // 返回 'camel_case'
         * const convertedStr2 = snakeCase('some whitespace') // 返回 'some_whitespace'
         * const convertedStr3 = snakeCase('hyphen-text') // 返回 'hyphen_text'
         * const convertedStr4 = snakeCase('HTTPRequest') // 返回 'http_request'
         */
        static snakeCase = (str: string): string => {
            const splitWords = str.match(OpenAPI.ConstantsUtils.CASE_SPLIT_PATTERN) || [];
            return splitWords.map(word => word.toLowerCase()).join('_');
        };

        /**
         * 随机字符串
         * 
         * @param {number} length - 字符串长度
         * @param {string} str - 随机的字符串
         * 
         * @example
         * const randomStr = randomString(10) // 返回 'a1b2c3d4e5'
         */
        static randomString = (length: number, str: string = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'): string => {
            return OpenAPI.Method.getRandomString(length, str);
        }

        /**
         * 随机颜色
         * 
         * @example
         * const randomColor = randomColor() // 返回 '#ffffff'
         */
        static get randomColor(): string {
            return OpenAPI.Method.getRandomColor();
        }

        /**
         * 解析文本内变量占位符数据, 可自定义获取数据的方法以及正则表达式
         * 
         * @param {string} text - 文本
         * @param {(((s: any) => number) | ((s: any) => string))[]} getData - 获取数据的方法
         * @param {RegExp[]} regex - 正则表达式
         * 
         * @example
         * const text = '你好, 我是[@s1], 今年[@v1]岁'
         * return parseVariableText(text) // 返回 '你好, 我是黑白, 今年18岁'
         */
        static parseVariableText = (text: string, getData: (((s: any) => number) | ((s: any) => string))[] | null = null, regex: RegExp[] | null = null): string => {
            return OpenAPI.Method.parseVarPlaceholderData(text, getData, regex);
        }

        /**
         * 解析文本内游戏变量占位符数据
         * 
         * @param {string} text - 文本
         * @param {any[]} gameData - 游戏数据
         * @param {RegExp[]} regex - 正则表达式
         * 
         * @example
         * const text = '你好, 我是[@gs0], 今年[@gv1]岁'
         * // gameData 需要从编辑器中获取, 例如游戏变量组件
         * return parseGameVariableText(text, gameData) // 返回 '你好, 我是黑白, 今年18岁'
         */
        static parseGameVariableText = (text: string, gameData: any[], regex: RegExp[] | null = null): string => {
            return OpenAPI.Method.parseGameVarPlaceholderData(text, gameData, regex);
        }

        /**
         * 解析文本内函数组合占位符数据
         * 
         * @param {string} text - 文本
         * @param {RegExp[]} regex - 正则表达式
         * 
         * @example
         * const text = 'max(1,100)' // 获取最大值
         * return parseFunctionText(text) // 返回 '100'
         * const text = 'min(1,100)' // 获取最小值
         * return parseFunctionText(text) // 返回 '1'
         * const text = 'random(1,100)' // 获取随机数
         * return parseFunctionText(text) // 返回 '18.1234...' 不会取整
         * const text = 'reduce(50,100)' // 获取平均值
         * return parseFunctionText(text) // 返回 '150'
         * const text = 'abs(-18)' // 获取绝对值
         * return parseFunctionText(text) // 返回 '18'
         * const text = 'sqrt(18)' // 获取开方
         * return parseFunctionText(text) // 返回 '4.2426...' 不会取整
         * const text = 'round(1.1234)' // 获取整数
         * return parseFunctionText(text) // 返回 '1'
         */
        static parseFunctionText = (text: string, regex: RegExp[] | null = null): string => {
            return OpenAPI.Method.parseCombinedFunctions(text, regex);
        }

        /**
         * 将阿拉伯数字转换为罗马数字的函数
         * 
         * @param {number} num - 阿拉伯数字
         * 
         * @example
         * const romanNum = arabicToRoman(2024) // 返回 'MMXXIV'
         */
        static arabicToRoman = (num: number): string => {
            return OpenAPI.Method.intToRoman(num);
        }
    }
}