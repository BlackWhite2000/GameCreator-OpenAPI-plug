
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