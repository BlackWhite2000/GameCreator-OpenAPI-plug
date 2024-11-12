module OpenAPI {
    /**
     * 日期工具
     */
    export class DateUtils {

        /**
         * 日期转时间戳
         * 
         * @param {string} date - 日期
         * 
         * @example
         * ```ts
         * const timestamp = dateToTimestamp('2024-01-01') // 返回 1704038400000
         * const timestamp = dateToTimestamp('2024/01/01') // 返回 1704038400000
         * const timestamp = dateToTimestamp('2024-01-01 00:00:00') // 返回 1704038400000
         * const timestamp = dateToTimestamp('2024/01/01 00:00:00') // 返回 1704038400000
         * ```
         */
        static dateToTimestamp = (date: string): number => {
            return OpenAPI.Method.dateToTimestamp(date);
        };

        /**
         * 时间戳转日期
         * 
         * @param {number} timestamp - 时间戳
         * @param {string} data_type - 返回的数据类型 默认返回 '2024/01/01 00:00:00'
         * 
         * @example
         * ```ts
         * const date = timestampToDate(1704038400000) // 返回 '2024/01/01 00:00:00'
         * const date = timestampToDate(1704038400000, 'y') // 返回 '2024'
         * ```
         */
        static timestampToDate = (timestamp: number, data_type: '' | 'y' | 'm' | 'd' | 'h' | 'i' | 's' = ''): string | number | undefined => {
            return OpenAPI.Method.timestampToDate(timestamp, data_type);
        }
    }
}