EventUtils.addEventListener(ClientWorld, ClientWorld.EVENT_INITED, Callback.New(function () {
    if (!WorldData.is_AvatarAutoAnimation)
        return;
    var customCommand_3006_AvatarAutoAnimation = CommandExecute.customCommand_3006;
    CommandExecute.customCommand_3006 = function (commandPage, cmd, trigger, triggerPlayer, playerInput, cp) {
        customCommand_3006_AvatarAutoAnimation.apply(this, arguments);
        var data = {
            passageID: cp.passageID,
            y: WorldData.y_AvatarAutoAnimation,
            time: WorldData.time_AvatarAutoAnimation,
            trace: WorldData.trans_AvatarAutoAnimation,
        };
        var is = {
            is_offsetY: 1,
        };
        AvatarAutoAnimationMain.AutoAnimation(data, is);
    };
}, null));
//# sourceMappingURL=addEventListener.js.map