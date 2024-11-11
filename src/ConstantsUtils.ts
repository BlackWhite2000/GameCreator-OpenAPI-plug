module OpenAPI{
    /**
     * 常量操作工具
     */
    export class ConstantsUtils{
        /**
         * 蛇形命名法正则表达式
         */
        static CASE_SPLIT_PATTERN = /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;
        /**
         * 随机字符串范围
         */
        static RANDOM_STRING_RANGE = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
}