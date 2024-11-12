var AvatarAutoAnimationMain = (function () {
    function AvatarAutoAnimationMain() {
    }
    AvatarAutoAnimationMain.AutoAnimation = function (data, is) {
        var passageID = MathUtils.int(data.passageID);
        var a = GameImageLayer.getImageSprite(passageID);
        if (!a || !(a instanceof UIStandAvatar))
            return;
        var sign = 'gcStandAvatarMove';
        GameImageLayer.clearPassageFrameUpdate(passageID, sign);
        var newY;
        if ((is === null || is === void 0 ? void 0 : is.is_offsetY) === 1)
            newY = a.dpY - (data.y ? data.y : 0);
        else
            newY = a.dpY;
        var m = {
            time: data.time ? data.time : 1,
            curTime: 1,
            x: a.dpX,
            y: newY,
            z: a.dpZ,
            scaleX: a.dpScaleX,
            scaleY: a.dpScaleY,
            rotation: a.rotation1,
            opacity: a.opacity,
            avatarFrame: a.avatarFrame,
            x2: 0,
            y2: data.y ? data.y : 0,
            z2: 0,
            scaleX2: 0,
            scaleY2: 0,
            rotation2: 0,
            opacity2: 0,
            transData: data.trace ? GameUtils.getTransData(data.trace) : null,
            actionID: data.actionID ? data.actionID : a.actionID,
            changeExpression: is === null || is === void 0 ? void 0 : is.is_actionID,
            avatarFrame2: 0,
        };
        var thisPtr = {};
        GameImageLayer.regPassageFrameUpdate(passageID, this.gcStandAvatarMoveFrameUpdate, thisPtr, [a, m, passageID, sign], sign);
        this.gcStandAvatarMoveFrameUpdate.apply(thisPtr, [a, m, passageID, sign]);
    };
    AvatarAutoAnimationMain.DisableAnimation = function (id, materials) {
        var imagePassageID = id;
        var imagePassageInfos = { passageID: imagePassageID, materialSetting: materials };
        var a = GameImageLayer.getImageSprite(imagePassageID);
        if (!a || !(a instanceof GameSprite))
            return;
        var materialSetting = imagePassageInfos.materialSetting[0];
        var mData = materialSetting;
        mData.____timeInfo = {};
        var m = a.getMaterialByID(mData.id, 0);
        if (m)
            a.removeMaterial(mData, 0);
        a.addMaterial(mData, 0);
        a.setMaterialDirty();
    };
    AvatarAutoAnimationMain.ShowEmojiImage = function (data) {
        var passageID = MathUtils.int(data.passageID);
        GameImageLayer.deletePassage(passageID);
        var a = new UIBitmap();
        var sign = 'gcImageMove';
        GameImageLayer.setImageSprite(passageID, a);
        Game.layer.imageLayer.addChild(a);
        a.dpDisplayPriority = passageID;
        if (data.image)
            a.image = data.image;
        a.useDPCoord = true;
        if (data.x)
            a.dpX = data.x;
        if (data.y)
            a.dpY = data.y;
        a.dpZ = 100;
        if (data.width)
            a.dpWidth = data.width;
        if (data.height)
            a.dpHeight = data.height;
        a.opacity = data.opacity ? data.opacity : 1;
        a.dpCoordToRealCoord();
        if (data.move) {
            var m = {
                time: data.time ? data.time : 1,
                curTime: 1,
                x: a.dpX,
                y: a.dpY,
                z: a.dpZ,
                width: a.dpWidth,
                height: a.dpHeight,
                rotation: a.rotation1,
                opacity: data.opacity,
                x2: 0,
                y2: 0,
                z2: 0,
                width2: 0,
                height2: 0,
                rotation2: a.rotation1,
                opacity2: data.opacity2,
                pivotType2: 0,
                blendMode2: 0,
                flip2: 0,
                transData: null,
            };
            var thisPtr = {};
            GameImageLayer.regPassageFrameUpdate(passageID, this.gcImageMoveFrameUpdate, thisPtr, [a, m, passageID, sign], sign);
            this.gcImageMoveFrameUpdate.apply(thisPtr, [a, m, passageID, sign]);
        }
    };
    AvatarAutoAnimationMain.ShowEmojiAnimation = function (data) {
        var passageID = MathUtils.int(data.passageID);
        var animationID = data.animation;
        GameImageLayer.deletePassage(passageID);
        var sign = 'gcAnimationMove';
        var a = new UIAnimation();
        a.animation.syncLoadWhenAssetExist = true;
        a.useDPCoordScaleMode = true;
        a.dpDisplayPriority = passageID;
        a.animationID = animationID;
        GameImageLayer.setImageSprite(passageID, a);
        Game.layer.imageLayer.addChild(a);
        a.useDPCoord = true;
        a.dpX = data.x;
        a.dpY = data.y;
        a.dpZ = 100;
        a.dpScaleX = data.scaleNumberX;
        a.dpScaleY = data.scaleNumberY;
        a.rotation1 = 0;
        a.opacity = data.opacity ? data.opacity : 1;
        a.silentMode = data.silentMode ? data.silentMode : false;
        a.showHitEffect = data.showHitEffect ? data.showHitEffect : false;
        a.playFps = data.playFps ? data.playFps : Config.ANIMATION_FPS;
        a.aniFrame = data.aniFrame ? data.aniFrame : 1;
        a.playType = data.playType ? data.playType : 0;
        a.dpCoordToRealCoord();
        if (data.move) {
            var m = {
                time: data.time,
                curTime: 1,
                x: a.dpX,
                y: a.dpY,
                z: a.dpZ,
                scaleX: a.dpScaleX,
                scaleY: a.dpScaleY,
                rotation: a.rotation1,
                opacity: a.opacity,
                aniFrame: a.aniFrame,
                x2: 0,
                y2: 0,
                z2: 0,
                scaleX2: 0,
                scaleY2: 0,
                rotation2: a.rotation1,
                opacity2: data.opacity2,
                aniFrame2: data.aniFrame ? data.aniFrame : 1,
                transData: null,
            };
            var thisPtr = {};
            GameImageLayer.regPassageFrameUpdate(passageID, this.gcImageMoveFrameUpdate, thisPtr, [a, m, passageID, sign], sign);
            this.gcImageMoveFrameUpdate.apply(thisPtr, [a, m, passageID, sign]);
        }
    };
    AvatarAutoAnimationMain.AlignAvatar = function (data, is) {
        var passageID = MathUtils.int(data.passageID);
        var a = GameImageLayer.getImageSprite(passageID);
        if (!a || !(a instanceof UIStandAvatar))
            return;
        var sign = 'gcStandAvatarMove';
        GameImageLayer.clearPassageFrameUpdate(passageID, sign);
        var m = {
            time: data.time ? data.time : 1,
            curTime: 1,
            x: a.dpX,
            y: a.dpY,
            z: a.dpZ,
            scaleX: a.dpScaleX,
            scaleY: a.dpScaleY,
            rotation: a.rotation1,
            opacity: a.opacity,
            avatarFrame: a.avatarFrame,
            x2: data.x - a.dpX,
            y2: (is === null || is === void 0 ? void 0 : is.is_y) ? data.y - a.dpY : 0,
            z2: 0,
            scaleX2: (is === null || is === void 0 ? void 0 : is.is_scale) ? (data.scaleNumberX - a.dpScaleX) : 0,
            scaleY2: (is === null || is === void 0 ? void 0 : is.is_scale) ? (data.scaleNumberY - a.dpScaleY) : 0,
            rotation2: 0,
            opacity2: 0,
            transData: data.trace ? GameUtils.getTransData(data.trace) : null,
            actionID: (is === null || is === void 0 ? void 0 : is.is_actionID) ? data.actionID : a.actionID,
            changeExpression: is === null || is === void 0 ? void 0 : is.is_actionID,
            avatarFrame2: 0,
        };
        var thisPtr = {};
        GameImageLayer.regPassageFrameUpdate(passageID, this.gcStandAvatarMoveFrameUpdate, thisPtr, [a, m, passageID, sign], sign);
        this.gcStandAvatarMoveFrameUpdate.apply(thisPtr, [a, m, passageID, sign]);
    };
    AvatarAutoAnimationMain.Hide = function (data) {
        var passageID = data.passageID;
        passageID = MathUtils.int(passageID);
        GameImageLayer.deletePassage(passageID);
    };
    AvatarAutoAnimationMain.gcImageMoveFrameUpdate = function (a, m, passageID, sign) {
        if (m.curTime === 1) {
            a.pivotType = m.pivotType2;
            a.blendMode = [null, 'lighter', 'blend5-1', 'blend4-1', 'blend4-7', 'blend4-4'][m.blendMode2];
            a.flip = m.flip2;
        }
        var per = m.curTime / m.time;
        var value = GameUtils.getValueByTransData(m.transData, per);
        a.dpX = m.x2 * value + m.x;
        a.dpY = m.y2 * value + m.y;
        a.dpZ = m.z2 * value + m.z;
        a.dpWidth = m.width2 * value + m.width;
        a.dpHeight = m.height2 * value + m.height;
        a.rotation1 = m.rotation2 * value + m.rotation;
        a.opacity = m.opacity2 * value + m.opacity;
        m.curTime++;
        if (per === 1)
            GameImageLayer.clearPassageFrameUpdate(passageID, sign);
        a.dpCoordToRealCoord();
    };
    AvatarAutoAnimationMain.gcAnimationMoveFrameUpdate = function (a, m, passageID, sign, changeFrame) {
        var per = m.curTime / m.time;
        var value = GameUtils.getValueByTransData(m.transData, per);
        a.dpX = m.x2 * value + m.x;
        a.dpY = m.y2 * value + m.y;
        a.dpZ = m.z2 * value + m.z;
        a.dpScaleX = m.scaleX2 * value + m.scaleX;
        a.dpScaleY = m.scaleY2 * value + m.scaleY;
        a.rotation1 = m.rotation2 * value + m.rotation;
        a.opacity = m.opacity2 * value + m.opacity;
        if (changeFrame)
            a.aniFrame = m.aniFrame2 * value + m.aniFrame;
        a.dpCoordToRealCoord();
        m.curTime++;
        if (per === 1)
            GameImageLayer.clearPassageFrameUpdate(passageID, sign);
    };
    AvatarAutoAnimationMain.gcStandAvatarMoveFrameUpdate = function (a, m, passageID, sign) {
        if (m.curTime === 1) {
            if (m.changeExpression)
                a.actionID = m.actionID;
        }
        var per = m.curTime / m.time;
        var value = GameUtils.getValueByTransData(m.transData, per);
        a.dpX = m.x2 * value + m.x;
        a.dpY = m.y2 * value + m.y;
        a.dpZ = m.z2 * value + m.z;
        a.dpScaleX = m.scaleX2 * value + m.scaleX;
        a.dpScaleY = m.scaleY2 * value + m.scaleY;
        a.rotation1 = m.rotation2 * value + m.rotation;
        a.opacity = m.opacity2 * value + m.opacity;
        a.dpCoordToRealCoord();
        if (m.changeFrame)
            a.avatarFrame = m.avatarFrame2 * value + m.avatarFrame;
        m.curTime++;
        if (per === 1)
            GameImageLayer.clearPassageFrameUpdate(passageID, sign);
    };
    AvatarAutoAnimationMain.PLUGIN_SCENEOBJECT_MODULE_AvatarAutoAnimation_Emoji = 2;
    AvatarAutoAnimationMain.Emoji_passageID = -1;
    AvatarAutoAnimationMain.AlignAvatarNumLen = 20;
    return AvatarAutoAnimationMain;
}());
//# sourceMappingURL=Main.js.map