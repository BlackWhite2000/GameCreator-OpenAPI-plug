module CommandExecute {

    export function customCommand_15006(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_15006): void {
        /**
         * 色调变更
         */
        const materials = [
            {
                r: 0,
                b: 0,
                g: 0,
                gray: 0,
                enable: true,
                id: 1,
                mb: 1,
                mg: 1,
                mr: 1,
                time: '',
                useTime: false,
                ____timeInfo: null,
            },
        ]
        let num
        if (p.numType === 0)
            num = p.num
        if (p.numType === 1)
            num = Game.player.variable.getString(p.strVar)
        if (p.numType === 2)
            num = String(Game.player.variable.getVariable(p.numVar))

        if (!num)
            return trace('【立绘自动动画】启用立绘指令的立绘编号为空')
        const numbers = num.split(',')
        numbers.forEach((i) => {
            const parsedNumber = Number.parseInt(i)
            if (Number.isNaN(parsedNumber)) {
                trace(`【立绘自动动画】启用立绘指令的立绘编号出现非数值情况=>${i}`)
                return
            }
            // OK
            const data = {
                passageID: Number(i),
                y: -WorldData.disable_y_AvatarAutoAnimation,
                time: WorldData.disable_time_AvatarAutoAnimation,
                trace: WorldData.disable_trans_AvatarAutoAnimation,
            }
            const is = {
                is_offsetY: 0,
            }
            AvatarAutoAnimationMain.DisableAnimation(Number(i), materials)
            AvatarAutoAnimationMain.AutoAnimation(data, is)
        })
    }

    export function customCommand_15007(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_15007): void {
        const materials = [
            {
                r: WorldData.disable_AvatarAutoAnimation.r,
                b: WorldData.disable_AvatarAutoAnimation.b,
                g: WorldData.disable_AvatarAutoAnimation.g,
                gray: WorldData.disable_AvatarAutoAnimation.gray,
                enable: true,
                id: 1,
                mb: WorldData.disable_AvatarAutoAnimation.mb,
                mg: WorldData.disable_AvatarAutoAnimation.mg,
                mr: WorldData.disable_AvatarAutoAnimation.mr,
                time: '',
                useTime: false,
                ____timeInfo: null,
            },
        ]
        let num
        if (p.numType === 0)
            num = p.num
        if (p.numType === 1)
            num = Game.player.variable.getString(p.strVar)
        if (p.numType === 2)
            num = String(Game.player.variable.getVariable(p.numVar))

        if (!num)
            return trace('【立绘自动动画】禁用立绘指令的立绘编号为空')
        const numbers = num.split(',')
        numbers.forEach((i) => {
            const parsedNumber = Number.parseInt(i)
            if (Number.isNaN(parsedNumber)) {
                trace(`【立绘自动动画】禁用立绘指令的立绘编号出现非数值情况=>${i}`)
                return
            }
            // OK
            const data = {
                passageID: Number(i),
                y: WorldData.disable_y_AvatarAutoAnimation,
                time: WorldData.disable_time_AvatarAutoAnimation,
                trace: WorldData.disable_trans_AvatarAutoAnimation,
            }
            const is = {
                is_offsetY: 0,
            }
            AvatarAutoAnimationMain.DisableAnimation(Number(i), materials)
            AvatarAutoAnimationMain.AutoAnimation(data, is)
        })
    }

    export function customCommand_15008(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_15008): void {
        if (Config.templateID === 182) {
            if (Game.player.variable.getSwitch(15004))
                return
        }

        let num
        if (p.numType === 0)
            num = p.num
        if (p.numType === 1)
            num = Game.player.variable.getString(p.strVar)
        if (p.numType === 2)
            num = String(Game.player.variable.getVariable(p.numVar))

        if (!num)
            return trace('【立绘自动动画】表情气泡指令的立绘编号为空')
        const numbers = num.split(',')
        numbers.forEach((i) => {
            const parsedNumber = Number.parseInt(i)
            if (Number.isNaN(parsedNumber)) {
                trace(`【立绘自动动画】表情气泡指令的立绘编号出现非数值情况=>${i}`)
                return
            }
            // OK

            // 表情编号
            if (AvatarAutoAnimationMain.Emoji_passageID === -1)
                AvatarAutoAnimationMain.Emoji_passageID = WorldData.emojiPassageID_AvatarAutoAnimation

            else
                AvatarAutoAnimationMain.Emoji_passageID = AvatarAutoAnimationMain.Emoji_passageID + 1

            const Emoji_passageID = AvatarAutoAnimationMain.Emoji_passageID
            // 表情数据
            let emoji: number
            if (p.emojiType === 0)
                emoji = p.emoji

            else
                emoji = Game.player.variable.getVariable(p.emojiVar)

            const data = GameData.getModuleData(AvatarAutoAnimationMain.PLUGIN_SCENEOBJECT_MODULE_AvatarAutoAnimation_Emoji, emoji)

            // 立绘数据
            const passageID = MathUtils.int(i)
            const a: UIStandAvatar = GameImageLayer.getImageSprite(passageID) as any
            if (!a || !(a instanceof UIStandAvatar))
                return

            // 表情气泡数据
            const ui = new GUI_15001()
            let image: string | undefined
            let x: number
            let y: number
            let width: number | undefined
            let height: number | undefined
            let animation: number
            let scaleNumberY: number
            let scaleNumberX: number
            let aniFrame: number
            let playFps: number
            let playType: number
            let showHitEffect: boolean
            let silentMode: boolean

            // 图片表情
            if (data.emojiType === 0) {
                image = data.emojiImg
                x = a.x - (ui.avatar.x - ui.emojiImage.x)
                y = ui.emojiImage.y
                width = ui.emojiImage.width
                height = ui.emojiImage.height
            }

            // 动画表情
            else {
                animation = data.emojiAni
                x = a.x - (ui.avatar.x - ui.emojiAnimation.x)
                y = ui.emojiAnimation.y
                scaleNumberY = ui.emojiAnimation.scaleNumberX
                scaleNumberX = ui.emojiAnimation.scaleNumberY
                aniFrame = ui.emojiAnimation.aniFrame
                playFps = ui.emojiAnimation.playFps
                playType = ui.emojiAnimation.playType
                showHitEffect = ui.emojiAnimation.showHitEffect
                silentMode = ui.emojiAnimation.silentMode
            }

            if (data.is_attributeCalculation) {
                x = x + data.x_attributeCalculation
                y = y + data.y_attributeCalculation
            }

            // 开始
            if (data.is_actionID) {
                const avatarData = {
                    passageID,
                    actionID: data.actionID,
                }
                const is = {
                    is_actionID: true,
                }
                AvatarAutoAnimationMain.AutoAnimation(avatarData, is)
            }
            if (data.is_se)
                GameAudio.playSE(data.se)

            if (data.emojiType === 0) {
                const showEmojiData = {
                    passageID: Emoji_passageID,
                    image,
                    x,
                    y,
                    width,
                    height,
                    time: data.time,
                    opacity: 0,
                    opacity2: 1,
                    move: data.is_time,
                }
                AvatarAutoAnimationMain.ShowEmojiImage(showEmojiData)
            }
            else {
                const showEmojiData = {
                    passageID: Emoji_passageID,
                    // @ts-ignore 忽略提示
                    animation,
                    x,
                    y,
                    // @ts-ignore 忽略提示
                    scaleNumberY,
                    // @ts-ignore 忽略提示
                    scaleNumberX,
                    // @ts-ignore 忽略提示
                    aniFrame,
                    // @ts-ignore 忽略提示
                    playFps,
                    // @ts-ignore 忽略提示
                    playType,
                    // @ts-ignore 忽略提示
                    showHitEffect,
                    // @ts-ignore 忽略提示
                    silentMode,
                    time: data.time,
                    opacity: 0,
                    opacity2: 1,
                    move: data.is_time,
                }
                AvatarAutoAnimationMain.ShowEmojiAnimation(showEmojiData)
            }
            const hideEmojiId = () => {
                AvatarAutoAnimationMain.Hide({ passageID: Emoji_passageID })
            }
            let is_space = false
            const keyDownHandler = (e: EventObject) => {
                if (e.keyCode === Keyboard.SPACE || Keyboard.CONTROL) {
                    // trace(1, new Date().getTime())
                    is_space = true
                    hideEmojiId()
                    stage.off(EventObject.KEY_DOWN, undefined, keyDownHandler)
                    stage.off(EventObject.KEY_UP, undefined, keyDownHandler)
                    // stage.on(EventObject.KEY_UP, undefined, keyDownHandler)
                }
            }

            Game.layer.uiLayer.once(EventObject.CLICK, undefined, () => {
                hideEmojiId()
                is_space = true
                stage.off(EventObject.KEY_DOWN, undefined, keyDownHandler)
                stage.off(EventObject.KEY_UP, undefined, keyDownHandler)
            })
            stage.on(EventObject.KEY_DOWN, undefined, keyDownHandler)
            stage.on(EventObject.KEY_UP, undefined, keyDownHandler)

            setTimeout(() => {
                if (!is_space) {
                    hideEmojiId()
                    stage.off(EventObject.KEY_DOWN, undefined, keyDownHandler)
                    stage.on(EventObject.KEY_UP, undefined, keyDownHandler)
                }
            }, data.emojiTime)
        })
    }

    export function customCommand_15009(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_15009): void {
        let num
        if (p.numType === 0)
            num = p.num
        if (p.numType === 1)
            num = Game.player.variable.getString(p.strVar)

        if (!num)
            return trace('【立绘自动动画】对齐立绘指令的立绘编号为空')
        const numData: any[] = []
        const numbers = num.split(',')
        numbers.forEach((i) => {
            const parsedNumber = Number.parseInt(i)
            if (Number.isNaN(parsedNumber)) {
                trace(`【立绘自动动画】对齐立绘指令的立绘编号出现非数值情况=>${i}`)
                return
            }
            numData.push(i)
        })
        const ui = new GUI_15002() as any
        let numDataLen
        if (p.modeType === 0)
            numDataLen = numData.length

        else
            numDataLen = p.artificialIDType === 0 ? p.artificialID : Game.player.variable.getVariable(p.artificialIDVar)

        if (numData.length > AvatarAutoAnimationMain.AlignAvatarNumLen)
            return trace(`【立绘自动动画】对齐立绘指令的当前编号数量为 ${numData.length} 超出了${AvatarAutoAnimationMain.AlignAvatarNumLen}个, 出于某种性能安全的考虑限制了数量, 如果你真的有更多数量的需求请联系我帮你修改更大的数量。`)
        for (let z = 1; z <= numData.length; z++) {
            // OK
            const uiAvatar = ui[`avatar_${numDataLen}_${z}`]
            if (!uiAvatar)
                return trace(`【立绘自动动画】对齐立绘指令中名为 avatar_${numDataLen}_${z} 的立绘组件不存在`)
            const data = {
                passageID: Number(numData[z - 1]),
                x: uiAvatar.x,
                time: WorldData.alignAvatar_time_AvatarAutoAnimation,
                y: uiAvatar.y,
                scaleNumberX: uiAvatar.scaleNumberX,
                scaleNumberY: uiAvatar.scaleNumberY,
                actionID: uiAvatar.actionID,
            }
            const is = {
                is_y: p.modeType === 1 ? p.artificialY : false,
                is_scale: p.modeType === 1 ? p.artificialScale : false,
                is_actionID: p.modeType === 1 ? p.artificialActionID : false,
            }
            AvatarAutoAnimationMain.AlignAvatar(data, is)
        }
    }

}
