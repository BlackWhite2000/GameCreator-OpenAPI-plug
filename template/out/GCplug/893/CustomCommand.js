(function (CommandExecute) {
    function customCommand_15006(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        var materials = [
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
        ];
        var num;
        if (p.numType === 0)
            num = p.num;
        if (p.numType === 1)
            num = Game.player.variable.getString(p.strVar);
        if (p.numType === 2)
            num = String(Game.player.variable.getVariable(p.numVar));
        if (!num)
            return trace('【立绘自动动画】启用立绘指令的立绘编号为空');
        var numbers = num.split(',');
        numbers.forEach(function (i) {
            var parsedNumber = Number.parseInt(i);
            if (Number.isNaN(parsedNumber)) {
                trace("\u3010\u7ACB\u7ED8\u81EA\u52A8\u52A8\u753B\u3011\u542F\u7528\u7ACB\u7ED8\u6307\u4EE4\u7684\u7ACB\u7ED8\u7F16\u53F7\u51FA\u73B0\u975E\u6570\u503C\u60C5\u51B5=>" + i);
                return;
            }
            var data = {
                passageID: Number(i),
                y: -WorldData.disable_y_AvatarAutoAnimation,
                time: WorldData.disable_time_AvatarAutoAnimation,
                trace: WorldData.disable_trans_AvatarAutoAnimation,
            };
            var is = {
                is_offsetY: 0,
            };
            AvatarAutoAnimationMain.DisableAnimation(Number(i), materials);
            AvatarAutoAnimationMain.AutoAnimation(data, is);
        });
    }
    CommandExecute.customCommand_15006 = customCommand_15006;
    function customCommand_15007(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        var materials = [
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
        ];
        var num;
        if (p.numType === 0)
            num = p.num;
        if (p.numType === 1)
            num = Game.player.variable.getString(p.strVar);
        if (p.numType === 2)
            num = String(Game.player.variable.getVariable(p.numVar));
        if (!num)
            return trace('【立绘自动动画】禁用立绘指令的立绘编号为空');
        var numbers = num.split(',');
        numbers.forEach(function (i) {
            var parsedNumber = Number.parseInt(i);
            if (Number.isNaN(parsedNumber)) {
                trace("\u3010\u7ACB\u7ED8\u81EA\u52A8\u52A8\u753B\u3011\u7981\u7528\u7ACB\u7ED8\u6307\u4EE4\u7684\u7ACB\u7ED8\u7F16\u53F7\u51FA\u73B0\u975E\u6570\u503C\u60C5\u51B5=>" + i);
                return;
            }
            var data = {
                passageID: Number(i),
                y: WorldData.disable_y_AvatarAutoAnimation,
                time: WorldData.disable_time_AvatarAutoAnimation,
                trace: WorldData.disable_trans_AvatarAutoAnimation,
            };
            var is = {
                is_offsetY: 0,
            };
            AvatarAutoAnimationMain.DisableAnimation(Number(i), materials);
            AvatarAutoAnimationMain.AutoAnimation(data, is);
        });
    }
    CommandExecute.customCommand_15007 = customCommand_15007;
    function customCommand_15008(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        if (Config.templateID === 182) {
            if (Game.player.variable.getSwitch(15004))
                return;
        }
        var num;
        if (p.numType === 0)
            num = p.num;
        if (p.numType === 1)
            num = Game.player.variable.getString(p.strVar);
        if (p.numType === 2)
            num = String(Game.player.variable.getVariable(p.numVar));
        if (!num)
            return trace('【立绘自动动画】表情气泡指令的立绘编号为空');
        var numbers = num.split(',');
        numbers.forEach(function (i) {
            var parsedNumber = Number.parseInt(i);
            if (Number.isNaN(parsedNumber)) {
                trace("\u3010\u7ACB\u7ED8\u81EA\u52A8\u52A8\u753B\u3011\u8868\u60C5\u6C14\u6CE1\u6307\u4EE4\u7684\u7ACB\u7ED8\u7F16\u53F7\u51FA\u73B0\u975E\u6570\u503C\u60C5\u51B5=>" + i);
                return;
            }
            if (AvatarAutoAnimationMain.Emoji_passageID === -1)
                AvatarAutoAnimationMain.Emoji_passageID = WorldData.emojiPassageID_AvatarAutoAnimation;
            else
                AvatarAutoAnimationMain.Emoji_passageID = AvatarAutoAnimationMain.Emoji_passageID + 1;
            var Emoji_passageID = AvatarAutoAnimationMain.Emoji_passageID;
            var emoji;
            if (p.emojiType === 0)
                emoji = p.emoji;
            else
                emoji = Game.player.variable.getVariable(p.emojiVar);
            var data = GameData.getModuleData(AvatarAutoAnimationMain.PLUGIN_SCENEOBJECT_MODULE_AvatarAutoAnimation_Emoji, emoji);
            var passageID = MathUtils.int(i);
            var a = GameImageLayer.getImageSprite(passageID);
            if (!a || !(a instanceof UIStandAvatar))
                return;
            var ui = new GUI_15001();
            var image;
            var x;
            var y;
            var width;
            var height;
            var animation;
            var scaleNumberY;
            var scaleNumberX;
            var aniFrame;
            var playFps;
            var playType;
            var showHitEffect;
            var silentMode;
            if (data.emojiType === 0) {
                image = data.emojiImg;
                x = a.x - (ui.avatar.x - ui.emojiImage.x);
                y = ui.emojiImage.y;
                width = ui.emojiImage.width;
                height = ui.emojiImage.height;
            }
            else {
                animation = data.emojiAni;
                x = a.x - (ui.avatar.x - ui.emojiAnimation.x);
                y = ui.emojiAnimation.y;
                scaleNumberY = ui.emojiAnimation.scaleNumberX;
                scaleNumberX = ui.emojiAnimation.scaleNumberY;
                aniFrame = ui.emojiAnimation.aniFrame;
                playFps = ui.emojiAnimation.playFps;
                playType = ui.emojiAnimation.playType;
                showHitEffect = ui.emojiAnimation.showHitEffect;
                silentMode = ui.emojiAnimation.silentMode;
            }
            if (data.is_attributeCalculation) {
                x = x + data.x_attributeCalculation;
                y = y + data.y_attributeCalculation;
            }
            if (data.is_actionID) {
                var avatarData = {
                    passageID: passageID,
                    actionID: data.actionID,
                };
                var is = {
                    is_actionID: true,
                };
                AvatarAutoAnimationMain.AutoAnimation(avatarData, is);
            }
            if (data.is_se)
                GameAudio.playSE(data.se);
            if (data.emojiType === 0) {
                var showEmojiData = {
                    passageID: Emoji_passageID,
                    image: image,
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                    time: data.time,
                    opacity: 0,
                    opacity2: 1,
                    move: data.is_time,
                };
                AvatarAutoAnimationMain.ShowEmojiImage(showEmojiData);
            }
            else {
                var showEmojiData = {
                    passageID: Emoji_passageID,
                    animation: animation,
                    x: x,
                    y: y,
                    scaleNumberY: scaleNumberY,
                    scaleNumberX: scaleNumberX,
                    aniFrame: aniFrame,
                    playFps: playFps,
                    playType: playType,
                    showHitEffect: showHitEffect,
                    silentMode: silentMode,
                    time: data.time,
                    opacity: 0,
                    opacity2: 1,
                    move: data.is_time,
                };
                AvatarAutoAnimationMain.ShowEmojiAnimation(showEmojiData);
            }
            var hideEmojiId = function () {
                AvatarAutoAnimationMain.Hide({ passageID: Emoji_passageID });
            };
            var is_space = false;
            var keyDownHandler = function (e) {
                if (e.keyCode === Keyboard.SPACE || Keyboard.CONTROL) {
                    is_space = true;
                    hideEmojiId();
                    stage.off(EventObject.KEY_DOWN, undefined, keyDownHandler);
                    stage.off(EventObject.KEY_UP, undefined, keyDownHandler);
                }
            };
            Game.layer.uiLayer.once(EventObject.CLICK, undefined, function () {
                hideEmojiId();
                is_space = true;
                stage.off(EventObject.KEY_DOWN, undefined, keyDownHandler);
                stage.off(EventObject.KEY_UP, undefined, keyDownHandler);
            });
            stage.on(EventObject.KEY_DOWN, undefined, keyDownHandler);
            stage.on(EventObject.KEY_UP, undefined, keyDownHandler);
            setTimeout(function () {
                if (!is_space) {
                    hideEmojiId();
                    stage.off(EventObject.KEY_DOWN, undefined, keyDownHandler);
                    stage.on(EventObject.KEY_UP, undefined, keyDownHandler);
                }
            }, data.emojiTime);
        });
    }
    CommandExecute.customCommand_15008 = customCommand_15008;
    function customCommand_15009(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        var num;
        if (p.numType === 0)
            num = p.num;
        if (p.numType === 1)
            num = Game.player.variable.getString(p.strVar);
        if (!num)
            return trace('【立绘自动动画】对齐立绘指令的立绘编号为空');
        var numData = [];
        var numbers = num.split(',');
        numbers.forEach(function (i) {
            var parsedNumber = Number.parseInt(i);
            if (Number.isNaN(parsedNumber)) {
                trace("\u3010\u7ACB\u7ED8\u81EA\u52A8\u52A8\u753B\u3011\u5BF9\u9F50\u7ACB\u7ED8\u6307\u4EE4\u7684\u7ACB\u7ED8\u7F16\u53F7\u51FA\u73B0\u975E\u6570\u503C\u60C5\u51B5=>" + i);
                return;
            }
            numData.push(i);
        });
        var ui = new GUI_15002();
        var numDataLen;
        if (p.modeType === 0)
            numDataLen = numData.length;
        else
            numDataLen = p.artificialIDType === 0 ? p.artificialID : Game.player.variable.getVariable(p.artificialIDVar);
        if (numData.length > AvatarAutoAnimationMain.AlignAvatarNumLen)
            return trace("\u3010\u7ACB\u7ED8\u81EA\u52A8\u52A8\u753B\u3011\u5BF9\u9F50\u7ACB\u7ED8\u6307\u4EE4\u7684\u5F53\u524D\u7F16\u53F7\u6570\u91CF\u4E3A " + numData.length + " \u8D85\u51FA\u4E86" + AvatarAutoAnimationMain.AlignAvatarNumLen + "\u4E2A, \u51FA\u4E8E\u67D0\u79CD\u6027\u80FD\u5B89\u5168\u7684\u8003\u8651\u9650\u5236\u4E86\u6570\u91CF, \u5982\u679C\u4F60\u771F\u7684\u6709\u66F4\u591A\u6570\u91CF\u7684\u9700\u6C42\u8BF7\u8054\u7CFB\u6211\u5E2E\u4F60\u4FEE\u6539\u66F4\u5927\u7684\u6570\u91CF\u3002");
        for (var z = 1; z <= numData.length; z++) {
            var uiAvatar = ui["avatar_" + numDataLen + "_" + z];
            if (!uiAvatar)
                return trace("\u3010\u7ACB\u7ED8\u81EA\u52A8\u52A8\u753B\u3011\u5BF9\u9F50\u7ACB\u7ED8\u6307\u4EE4\u4E2D\u540D\u4E3A avatar_" + numDataLen + "_" + z + " \u7684\u7ACB\u7ED8\u7EC4\u4EF6\u4E0D\u5B58\u5728");
            var data = {
                passageID: Number(numData[z - 1]),
                x: uiAvatar.x,
                time: WorldData.alignAvatar_time_AvatarAutoAnimation,
                y: uiAvatar.y,
                scaleNumberX: uiAvatar.scaleNumberX,
                scaleNumberY: uiAvatar.scaleNumberY,
                actionID: uiAvatar.actionID,
            };
            var is = {
                is_y: p.modeType === 1 ? p.artificialY : false,
                is_scale: p.modeType === 1 ? p.artificialScale : false,
                is_actionID: p.modeType === 1 ? p.artificialActionID : false,
            };
            AvatarAutoAnimationMain.AlignAvatar(data, is);
        }
    }
    CommandExecute.customCommand_15009 = customCommand_15009;
})(CommandExecute || (CommandExecute = {}));
//# sourceMappingURL=CustomCommand.js.map