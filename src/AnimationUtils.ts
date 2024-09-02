module OpenAPI {
    /**
     * 动画操作工具
     */
    export class AnimationUtils {

        /**
         * 设置对象数据
         * @param object_1 来源
         * @param object_2 目标
         */
        private static setObjectData(object_1: GameSprite, object_2: GameSprite) {
            Object.assign(object_2, {
                x: object_1.x,
                y: object_1.y,
                scaleX: object_1.scaleX,
                scaleY: object_1.scaleY,
                dpX: object_1.dpX,
                dpY: object_1.dpY,
                dpZ: object_1.dpZ,
                dpScaleX: object_1.dpScaleX,
                dpScaleY: object_1.dpScaleY,
                rotation1: object_1.rotation1,
                opacity: object_1.opacity,
            });
        }

        /**
         * 设置动画
         * @param object 目标对象
         * @param aniID 动画编号
         * @param complete 回调
         */
        static setAnimation(object: GameSprite, aniID: number, complete?: Callback) {
            const ui = new UIRoot()
            const ani = new GCAnimation()
            this.setObjectData(object, ui)
            object.parent.addChild(ui)
            ui.addChild(object)
            ani.id = aniID
            ani.target = object
            ani.play()
            ani.once(GCAnimation.PLAY_COMPLETED, this, (ani: GCAnimation, object: GameSprite, ui: UIRoot) => {
                ani.dispose()
                ui.parent.addChild(object)
                this.setObjectData(ui, object)
                ui.dispose()
                if (complete) {
                    complete.run()
                }
            }, [ani, object, ui]);
        }

        /**
         * 设置图像动画
         * @param taskName 任务名称, 如果为空则不使用SyncTask
         * @param object 图像
         * @param aniID 动画编号
         * @param complete 回调
         */
        static setImageAnimation(taskName: string | null, object: UIStandAvatar, aniID: number, complete?: Callback) {
            if (!object) return
            if (taskName) {
                new SyncTask(taskName, () => {
                    this.setAnimation(object, aniID, Callback.New(() => {
                        SyncTask.taskOver(taskName);
                        if (complete) {
                            complete.run()
                        }
                    }, this))
                })
            } else {
                this.setAnimation(object, aniID, Callback.New(() => {
                    if (complete) {
                        complete.run()
                    }
                }, this))
            }
        }

        /**
         * 设置界面动画
         * @param taskName 任务名称, 如果为空则不使用SyncTask
         * @param object 界面
         * @param aniID 动画编号
         * @param complete 回调
         */
        static setUIAnimation(taskName: string | null, object: GUI_BASE, aniID: number, complete?: Callback) {
            if (!object) return
            if (taskName) {
                new SyncTask(taskName, () => {
                    this.setAnimation(object, aniID, Callback.New(() => {
                        SyncTask.taskOver(taskName);
                        if (complete) {
                            complete.run()
                        }
                    }, this))
                })
            } else {
                this.setAnimation(object, aniID, Callback.New(() => {
                    if (complete) {
                        complete.run()
                    }
                }, this))
            }
        }

        /**
          * 设置场景对象动画
          * @param taskName 任务名称, 如果为空则不使用SyncTask
          * @param object 场景对象
          * @param aniID 动画编号
          * @param loop 是否循环播放
          * @param isHit 是否显示被击中的效果，动画编辑器支持动画层仅命中时显示，如果设置为true即表示该动画所有层均显示
         * @param complete 回调
          */
        static setSceneObjectAnimation(taskName: string | null, object: ProjectClientSceneObject, aniID: number, loop: boolean = false, isHit: boolean = false, complete?: Callback) {
            if (!object) return
            if (taskName) {
                new SyncTask(taskName, () => {
                    const soAni = object.playAnimation(aniID, loop, isHit)
                    soAni.once(GCAnimation.PLAY_COMPLETED, this, () => {
                        SyncTask.taskOver(taskName);
                        if (complete) {
                            complete.run()
                        }
                    })
                })
            } else {
                const soAni = object.playAnimation(aniID, loop, isHit)
                soAni.once(GCAnimation.PLAY_COMPLETED, this, () => {
                    if (complete) {
                        complete.run()
                    }
                })
            }
        }
    }
}
