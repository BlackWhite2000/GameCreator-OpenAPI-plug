module OpenAPI {
    /**
     * 事件工具
     */
    export class EventUtils {

        /**
         * 获取事件页名称
         * 
         * @example
         * 
         */
        static eventPageName(eventPage: string): string | null {
            return OpenAPI.Method.getFeDataMessage(eventPage);
        }
    }
}