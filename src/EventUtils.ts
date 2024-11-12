module OpenAPI {
    /**
     * 事件工具
     */
    export class EventUtils {

        /**
         * 获取事件页名称
         * 
         * @param {string} eventPage - 事件页
         * 
         * @example
         * ```ts
         * const eventPage = OpenAPI.EventUtils.eventPageName('enentPage') // 返回设定的事件页名称
         * ```
         */
        static eventPageName(eventPage: string): string | null {
            return OpenAPI.Method.getFeDataMessage(eventPage);
        }
    }
}