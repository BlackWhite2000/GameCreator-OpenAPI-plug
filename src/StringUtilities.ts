module OpenAPI {
    /**
     * 字符串操作工具
     */
    export class StringUtilities {

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
            const splitWords = str.match(OpenAPI.ConstantsUtilities.CASE_SPLIT_PATTERN) || [];
            return splitWords.map(word => word.toLowerCase()).join('_');
        };
    }
}