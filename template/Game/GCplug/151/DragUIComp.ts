/**
 * Created by JayLen on 2020-12-21 18:10:38.
 */
module CommandExecute {
    /**
     * 拖拽界面
     */
    export function customCommand_15005(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_15005): void {
        var uiID = p.selectData.uiID;
        var compID = p.selectData.compID;
        var ui = GameUI.get(uiID);
        if (ui) {
            var comp: UIBase = ui.compsIDInfo[compID];
            if (comp && comp instanceof UIBase) {
                // 若已存在监听则取消掉，以免多次对同一个界面注册拖拽事件
                if (comp["___dragMouseEvent"]) {
                    comp.off(EventObject.MOUSE_DOWN, ui, comp["___dragMouseEvent"]);
                }
                var __rect = null;
                if (p.limit) {
                    var __point = comp.localToGlobal(new Point(0, 0));
                    __rect = new Rectangle(__point.x + p.startx, __point.y + p.starty, p.limitW, p.limitH);
                }
                var f: Function;
                comp.on(EventObject.MOUSE_DOWN, ui, f = (e: EventObject) => {
                    comp.startDrag(__rect);
                    stage.once(EventObject.MOUSE_UP, ui, () => {
                        comp.stopDrag();
                    })
                })
                comp["___dragMouseEvent"] = f;
            }
        }
    }
}