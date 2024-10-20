module OpenAPI {
    /**
     * 模块工具
     */
    export class ModuleUtils {

        /**
         * 获得模块数据
         * 
         * @param {number} id - 模块ID
         * @param {Callback} comp 回调
         * @param {number} length 类别长度 默认16
         * 
         * @example
         * const moduleData = getModuleData(1, (data) => {
         *     console.log(data)
         * }) // 返回 '模块数据'
         */
        static getModuleData = (id: number, comp: Callback, length: number = 16): void => {
            return OpenAPI.Method.getModuleData(id, comp, length);
        }
    }
}