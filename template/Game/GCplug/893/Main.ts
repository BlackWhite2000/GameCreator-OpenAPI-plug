class AvatarAutoAnimationMain {
    /**
     * 模块编号
     */
    static PLUGIN_SCENEOBJECT_MODULE_AvatarAutoAnimation_Emoji: number = 2

    static Emoji_passageID = -1

    /**
     * 对齐立绘上限
     */
    static AlignAvatarNumLen = 20

    static AutoAnimation(
        data: { passageID: number; y?: number; time?: number; trace?: string; actionID?: number },
        is?: { is_offsetY?: number; is_actionID?: boolean }) {
        // 获取通道
        const passageID = MathUtils.int(data.passageID)
        // 获取通道显示对象
        const a: UIStandAvatar = GameImageLayer.getImageSprite(passageID) as any
        if (!a || !(a instanceof UIStandAvatar))
            return
        // 标识：用于注册图像层帧刷时的标识，以便可用此标识取消该类型帧刷
        const sign = 'gcStandAvatarMove'
        // 清理同一个通道的移动图像效果
        GameImageLayer.clearPassageFrameUpdate(passageID, sign)

        // 获取过渡方式
        // let trans = '{ "transType": 1, "loopType": 0, "timeType": 0, "timeUnit": 1, "totalTime": 2, "tweenType": 4, "tweenTypeName": "backInOut", "curveData": [[0, 0, 0, 99, 1, 1, 1, 3], [0, 100, 100]], "refreshInterval": 16 }';
        let newY: number
        if (is?.is_offsetY === 1)
            newY = a.dpY - (data.y ? data.y : 0)

        else
            newY = a.dpY

        const m = {
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
            changeExpression: is?.is_actionID,
            avatarFrame2: 0,
        }
        const thisPtr = {}
        GameImageLayer.regPassageFrameUpdate(passageID, this.gcStandAvatarMoveFrameUpdate, thisPtr, [a, m, passageID, sign], sign)
        // 立刻开始执行一帧
        this.gcStandAvatarMoveFrameUpdate.apply(thisPtr, [a, m, passageID, sign])
    }

    static DisableAnimation(id: number, materials: any) {
        const imagePassageID = id
        const imagePassageInfos = { passageID: imagePassageID, materialSetting: materials }
        // 获取通道显示对象
        const a: GameSprite = GameImageLayer.getImageSprite(imagePassageID) as any
        if (!a || !(a instanceof GameSprite))
            return

        const materialSetting = imagePassageInfos.materialSetting[0]
        const mData: MaterialData = materialSetting
        mData.____timeInfo = {}
        const m = a.getMaterialByID(mData.id, 0)
        // 如果已存在的话需要移除掉，替换新的同ID材质
        if (m)
            a.removeMaterial(mData, 0)
        a.addMaterial(mData, 0)
        a.setMaterialDirty()
    }

    static ShowEmojiImage(data: { passageID: number; image?: string; x?: number; y?: number; width?: number; height?: number; move?: boolean; time?: number; opacity?: number; opacity2?: number }) {
        // 获取通道
        const passageID = MathUtils.int(data.passageID)
        // 清理通道
        GameImageLayer.deletePassage(passageID)
        // 创建显示对象
        const a = new UIBitmap()
        // 标识：用于注册图像层帧刷时的标识，以便可用此标识取消该类型帧刷
        const sign = 'gcImageMove'
        // 设置通道由该显示对象占用
        GameImageLayer.setImageSprite(passageID, a)
        Game.layer.imageLayer.addChild(a)
        a.dpDisplayPriority = passageID
        if (data.image)
            a.image = data.image
        a.useDPCoord = true
        if (data.x)
            a.dpX = data.x
        if (data.y)
            a.dpY = data.y
        a.dpZ = 100
        if (data.width)
            a.dpWidth = data.width
        if (data.height)
            a.dpHeight = data.height
        a.opacity = data.opacity ? data.opacity : 1
        a.dpCoordToRealCoord()
        if (data.move) {
            // 下一帧开始移动 1/MAX
            const m = {
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
            }

            const thisPtr = {}
            GameImageLayer.regPassageFrameUpdate(passageID, this.gcImageMoveFrameUpdate, thisPtr, [a, m, passageID, sign], sign)
            // 立刻开始执行一帧
            this.gcImageMoveFrameUpdate.apply(thisPtr, [a, m, passageID, sign])
        }
    }

    static ShowEmojiAnimation(data: { passageID: number; animation: number; x: number; y: number; scaleNumberY: number; scaleNumberX: number; aniFrame: number; playFps: number; playType: number; showHitEffect: boolean; silentMode: boolean; time?: number; opacity?: number; opacity2?: number; move?: boolean }) {
        // 获取通道
        const passageID = MathUtils.int(data.passageID)
        const animationID = data.animation
        // 清理通道
        GameImageLayer.deletePassage(passageID)
        const sign = 'gcAnimationMove'
        // 创建图片显示对象
        const a = new UIAnimation()
        a.animation.syncLoadWhenAssetExist = true
        a.useDPCoordScaleMode = true
        a.dpDisplayPriority = passageID
        a.animationID = animationID
        // 设置通道由该显示对象占用
        GameImageLayer.setImageSprite(passageID, a)
        Game.layer.imageLayer.addChild(a)
        a.useDPCoord = true
        a.dpX = data.x
        a.dpY = data.y
        a.dpZ = 100
        a.dpScaleX = data.scaleNumberX
        a.dpScaleY = data.scaleNumberY
        a.rotation1 = 0
        a.opacity = data.opacity ? data.opacity : 1
        a.silentMode = data.silentMode ? data.silentMode : false
        a.showHitEffect = data.showHitEffect ? data.showHitEffect : false
        a.playFps = data.playFps ? data.playFps : Config.ANIMATION_FPS
        a.aniFrame = data.aniFrame ? data.aniFrame : 1
        a.playType = data.playType ? data.playType : 0
        // 刷新坐标
        a.dpCoordToRealCoord()
        if (data.move) {
            // 下一帧开始移动 1/MAX
            const m = {
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
            }
            const thisPtr = {}
            GameImageLayer.regPassageFrameUpdate(passageID, this.gcImageMoveFrameUpdate, thisPtr, [a, m, passageID, sign], sign)
            // 立刻开始执行一帧
            this.gcImageMoveFrameUpdate.apply(thisPtr, [a as any, m, passageID, sign])
        }
    }

    static AlignAvatar(
        data: { passageID: number; x?: number; y?: number; time?: number; actionID?: number; trace?: string; scaleNumberX?: number; scaleNumberY?: number },
        is?: { is_y?: boolean; is_actionID?: boolean; is_scale?: boolean }) {
        // 获取通道
        const passageID = MathUtils.int(data.passageID)
        // 获取通道显示对象
        const a: UIStandAvatar = GameImageLayer.getImageSprite(passageID) as any
        if (!a || !(a instanceof UIStandAvatar))
            return
        // 标识：用于注册图像层帧刷时的标识，以便可用此标识取消该类型帧刷
        const sign = 'gcStandAvatarMove'
        // 清理同一个通道的移动图像效果
        GameImageLayer.clearPassageFrameUpdate(passageID, sign)

        // 获取过渡方式
        // let trans = '{ "transType": 1, "loopType": 0, "timeType": 0, "timeUnit": 1, "totalTime": 2, "tweenType": 4, "tweenTypeName": "backInOut", "curveData": [[0, 0, 0, 99, 1, 1, 1, 3], [0, 100, 100]], "refreshInterval": 16 }';
        const m = {
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
            x2: data.x as any - a.dpX,
            y2: is?.is_y ? data.y as any - a.dpY : 0,
            z2: 0,
            scaleX2: is?.is_scale ? (data.scaleNumberX as any - a.dpScaleX) : 0,
            scaleY2: is?.is_scale ? (data.scaleNumberY as any - a.dpScaleY) : 0,
            rotation2: 0,
            opacity2: 0,
            transData: data.trace ? GameUtils.getTransData(data.trace) : null,
            actionID: is?.is_actionID ? data.actionID : a.actionID,
            changeExpression: is?.is_actionID,
            avatarFrame2: 0,
        }
        const thisPtr = {}
        GameImageLayer.regPassageFrameUpdate(passageID, this.gcStandAvatarMoveFrameUpdate, thisPtr, [a, m, passageID, sign], sign)
        // 立刻开始执行一帧
        this.gcStandAvatarMoveFrameUpdate.apply(thisPtr, [a, m, passageID, sign])
    }

    static Hide(data: { passageID: number }) {
        let passageID = data.passageID
        passageID = MathUtils.int(passageID)
        GameImageLayer.deletePassage(passageID)
    }

    // ------------------------------------------------------------------------------------------------------
    //
    // ------------------------------------------------------------------------------------------------------
    /**
     * 移动图片时的逐帧执行的函数
     */
    static gcImageMoveFrameUpdate(a: UIBitmap, m: any, passageID: number, sign: string) {
        // 首帧变化的属性
        if (m.curTime === 1) {
            a.pivotType = m.pivotType2
            // @ts-ignore 可能为空
            a.blendMode = [null, 'lighter', 'blend5-1', 'blend4-1', 'blend4-7', 'blend4-4'][m.blendMode2]
            a.flip = m.flip2
        }
        const per = m.curTime / m.time
        const value = GameUtils.getValueByTransData(m.transData, per)
        a.dpX = m.x2 * value + m.x
        a.dpY = m.y2 * value + m.y
        a.dpZ = m.z2 * value + m.z
        a.dpWidth = m.width2 * value + m.width
        a.dpHeight = m.height2 * value + m.height
        a.rotation1 = m.rotation2 * value + m.rotation
        a.opacity = m.opacity2 * value + m.opacity
        m.curTime++
        if (per === 1)
            GameImageLayer.clearPassageFrameUpdate(passageID, sign)

        a.dpCoordToRealCoord()
    }

    /**
     * 移动动画时的逐帧执行的函数
     */
    static gcAnimationMoveFrameUpdate(a: UIAnimation, m: any, passageID: number, sign: string, changeFrame: boolean) {
        const per = m.curTime / m.time
        const value = GameUtils.getValueByTransData(m.transData, per)
        a.dpX = m.x2 * value + m.x
        a.dpY = m.y2 * value + m.y
        a.dpZ = m.z2 * value + m.z
        a.dpScaleX = m.scaleX2 * value + m.scaleX
        a.dpScaleY = m.scaleY2 * value + m.scaleY
        a.rotation1 = m.rotation2 * value + m.rotation
        a.opacity = m.opacity2 * value + m.opacity
        if (changeFrame)
            a.aniFrame = m.aniFrame2 * value + m.aniFrame

        a.dpCoordToRealCoord()
        m.curTime++
        if (per === 1)
            GameImageLayer.clearPassageFrameUpdate(passageID, sign)
    }

    /**
     * 移动立绘时的逐帧执行的函数
     */
    static gcStandAvatarMoveFrameUpdate(a: UIStandAvatar, m: any, passageID: number, sign: string) {
        // 立即变更
        if (m.curTime === 1) {
            if (m.changeExpression)
                a.actionID = m.actionID
        }
        const per = m.curTime / m.time
        const value = GameUtils.getValueByTransData(m.transData, per)
        a.dpX = m.x2 * value + m.x
        a.dpY = m.y2 * value + m.y
        a.dpZ = m.z2 * value + m.z
        a.dpScaleX = m.scaleX2 * value + m.scaleX
        a.dpScaleY = m.scaleY2 * value + m.scaleY
        a.rotation1 = m.rotation2 * value + m.rotation
        a.opacity = m.opacity2 * value + m.opacity
        a.dpCoordToRealCoord()
        if (m.changeFrame)
            a.avatarFrame = m.avatarFrame2 * value + m.avatarFrame

        m.curTime++
        if (per === 1)
            GameImageLayer.clearPassageFrameUpdate(passageID, sign)
    }
}