EventUtils.addEventListener(ClientWorld, ClientWorld.EVENT_INITED, Callback.New(() => {
    if (!WorldData.is_AvatarAutoAnimation)
        return
    // 记录原函数
    const customCommand_3006_AvatarAutoAnimation = CommandExecute.customCommand_3006
    // 重写该函数
    CommandExecute.customCommand_3006 = function (commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_3006): void {
        // @ts-ignore 执行旧的函数，作用域和参数保证是当前调用的，可以任意修改调用的顺序，或者不执行该行时表示不执行任何旧逻辑
        // eslint-disable-next-line prefer-rest-params
        customCommand_3006_AvatarAutoAnimation.apply(this, arguments)
        const data = {
            passageID: cp.passageID,
            y: WorldData.y_AvatarAutoAnimation,
            time: WorldData.time_AvatarAutoAnimation,
            trace: WorldData.trans_AvatarAutoAnimation,
        }
        const is = {
            is_offsetY: 1,
        }
        AvatarAutoAnimationMain.AutoAnimation(data, is)
    }
}, null))
