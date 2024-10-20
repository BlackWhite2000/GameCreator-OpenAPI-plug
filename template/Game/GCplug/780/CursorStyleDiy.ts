
module OpenAPI {

    /**
     * 光标自定义plus
     */
    export class CursorStyleDiy {

        /**
         * 当前版本号
         */
        static Version = 1.0;

        /**
         * 是否安装本插件
         */
        static Installed = true;

        /**
         * OpenAPI要求最低版本
         */
        static OpenAPI_MinVersion = 2.0;

        /**
         * 光标样式模块
         */
        static PLUGIN_MODULE_TYPE_CursorStyleDiyNum: number = 2;
    }
}

module CommandExecute {
    export function customCommand_15011(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_15011): void {
        //** 是否安装OpenAPI*/
        if (typeof OpenAPI == 'undefined' || typeof OpenAPI.System == 'undefined' || OpenAPI.System.Version < OpenAPI.CursorStyleDiy.OpenAPI_MinVersion) {
            alert(`【光标自定义plus】 \n请安装前置插件 OpenAPI 大于等于 v${OpenAPI.CursorStyleDiy.OpenAPI_MinVersion.toFixed(1)} 版本`)
            return;
        }

        //**指定值 */
        let cursorStyle_value = p.cursorStyle_Model;
        //**不存在0的情况 */
        if (cursorStyle_value == 0) return;
        //**操作索引 */
        let cursorStyle_index = 0;
        //**查询 */
        for (let i = 0; i < WorldData.cursorStyle_Bind.length; i++) {
            if (WorldData.cursorStyle_Bind[i].cursorBind == cursorStyle_value) {
                cursorStyle_index = i;
                break;
            }
        }
        //**指定光标 */
        let cursorStyle = WorldData.cursorStyle_Bind[cursorStyle_index]
        //**系统样式名称 */
        let cursorStyle_SystemStyleName = OpenAPI.Method.cursorSystemStyleName_spliceName(['auto'])
        //**光标绑定 */
        if (cursorStyle.isCursorSystemStyle) {
            os.setCursor(cursorStyle_SystemStyleName[cursorStyle.cursorSystemStyleBind])
        } else {
            os.setCursor(`url(./${cursorStyle.cursorStyleBind}), auto`)
        }

    }
}