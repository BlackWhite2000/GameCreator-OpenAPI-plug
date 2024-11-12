module OpenAPI {
    /**
     * 动画操作工具
     */
    export class AnimationUtils {

        /**
         * 设置对象数据
         * @param object_1 来源
         * @param object_2 目标
         * 
         * @example
         * ```ts
         * const object_1 = new GameSprite()
         * const object_2 = new GameSprite()
         * OpenAPI.AnimationUtils.setObjectData(object_1, object_2)
         * ```
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
         * 
         * @example
         * ```ts
         * const object = new GameSprite()
         * OpenAPI.AnimationUtils.setAnimation(object, 1, Callback.New(() => {
         *    console.log('动画播放完成')
         * }, this))
         * ```
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
         * 
         * @example
         * ```ts
         * OpenAPI.AnimationUtils.setImageAnimation('taskName', object, 1, Callback.New(() => {
         *   console.log('动画播放完成')
         * }, this))
         * ```
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
         * 
         * @example
         * ```ts
         * OpenAPI.AnimationUtils.setUIAnimation('taskName', object, 1, Callback.New(() => {
         *  console.log('动画播放完成')
         * }, this))
         * ```
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
         * 
         * @example
         * ```ts
         * OpenAPI.AnimationUtils.setSceneObjectAnimation('taskName', object, 1, false, false, Callback.New(() => {
         * console.log('动画播放完成')
         * }, this))
         * ```
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
module OpenAPI {
 
    /**
     * 数组操作工具
     */
    export class ArrayUtils {

        /**
         * 返回数组的第一个元素。
         *
         * 该函数接受一个数组并返回数组的第一个元素。
         * 如果数组为空，则返回 `undefined`。
         *
         * @param {T[]} arr - 要获取第一个元素的数组。
         * @returns {T | undefined} 数组的第一个元素，如果数组为空则返回 `undefined`。
         *
         * @example
         * ```ts
         * const arr = [1, 2, 3];
         * const firstElement = OpenAPI.ArrayUtils.head(arr);
         * // firstElement 将会是 1
         *
         * const emptyArr: number[] = [];
         * const noElement = OpenAPI.ArrayUtils.head(emptyArr);
         * // noElement 将会是 undefined
         * ```
         */
        static head<T>(arr: readonly T[]): T | undefined {
            return arr[0];
        }

        /**
         * 返回数组的最后一个元素。
         *
         * 该函数接受一个数组，并返回数组的最后一个元素。
         * 如果数组为空，则函数返回 `undefined`。
         *
         * 与某些实现不同，该函数通过直接访问数组的最后一个索引来进行性能优化。
         *
         * @param {T[]} arr - 要获取最后一个元素的数组。
         * @returns {T | undefined} 数组的最后一个元素，如果数组为空则返回 `undefined`。
         *
         * @example
         * ```ts
         * const arr = [1, 2, 3];
         * const lastElement = OpenAPI.ArrayUtils.last(arr);
         * // lastElement 将为 3
         *
         * const emptyArr: number[] = [];
         * const noElement = OpenAPI.ArrayUtils.last(emptyArr);
         * // noElement 将为 undefined
         * ```
         */
        static last<T>(arr: readonly T[]): T | undefined {
            return arr[arr.length - 1];
        }


        /**
         * 从数组中随机返回一个元素。
         *
         * 此函数接受一个数组并返回数组中随机选择的单个元素。
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} arr - 要抽样的数组。
         * @returns {T} 数组中随机选取的一个元素。
         *
         * @example
         * ```ts
         * const array = [1, 2, 3, 4, 5];
         * const randomElement = OpenAPI.ArrayUtils.sample(array);
         * // randomElement 将是数组中随机选择的一个元素。
         * ```
         */
        static sample<T>(arr: readonly T[]): T {
            const randomIndex = Math.floor(Math.random() * arr.length);
            return arr[randomIndex];
        }


        /**
         * 返回指定 `size` 大小的数组样本元素。
         *
         * 此函数接受一个数组和一个数字，并使用 Floyd's 算法返回一个包含抽样元素的数组。
         *
         * {@link https://www.nowherenearithaca.com/2013/05/robert-floyds-tiny-and-beautiful.html Floyd's 算法}
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} array - 要从中抽样的数组。
         * @param {number} size - 抽样的大小。
         * @returns {T[]} 应用了样本大小的新数组。
         * @throws {Error} 如果 `size` 大于 `array` 的长度，则抛出错误。
         *
         * @example
         * ```ts
         * const result = OpenAPI.ArrayUtils.sampleSize([1, 2, 3], 2)
         * // result 将是包含两个来自数组的元素的数组。
         * // [1, 2] 或 [1, 3] 或 [2, 3]
         * ```
         */
        static sampleSize<T>(array: readonly T[], size: number): T[] {
            if (size > array.length) {
                throw new Error('Size must be less than or equal to the length of array.');
            }

            const result = new Array(size);
            const selected = new Set();

            for (let step = array.length - size, resultIndex = 0; step < array.length; step++, resultIndex++) {
                let index = OpenAPI.MathUtils.randomInt(0, step + 1);

                if (selected.has(index)) {
                    index = step;
                }

                selected.add(index);

                result[resultIndex] = array[index];
            }

            return result;
        }

        /**
         * 使用 Fisher-Yates 算法随机打乱数组中的元素顺序。
         *
         * 此函数接受一个数组，并返回一个新数组，其中元素以随机顺序进行了洗牌。
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} arr - 要洗牌的数组。
         * @returns {T[]} 元素顺序已随机洗牌的新数组。
         *
         * @example
         * ```ts
         * const array = [1, 2, 3, 4, 5];
         * const shuffledArray = OpenAPI.ArrayUtils.shuffle(array);
         * // shuffledArray 将是一个新数组，其中 array 的元素以随机顺序洗牌，例如 [3, 1, 4, 5, 2]
         * ```
         */
        static shuffle<T>(arr: readonly T[]): T[] {
            const result = arr.slice();

            /**
             * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
             */
            for (let i = result.length - 1; i >= 1; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [result[i], result[j]] = [result[j], result[i]];
            }

            return result;
        }

        /**
         * 创建一个去重后的数组版本。
         *
         * 此函数接受一个数组，并返回一个新数组，其中仅包含原始数组中的唯一值，
         * 保留第一次出现的顺序。
         *
         * @template T - 数组中的元素类型。
         * @param {T[]} arr - 要处理的数组。
         * @returns {T[]} 仅包含原始数组中唯一值的新数组。
         *
         * @example
         * ```ts
         * const array = [1, 2, 2, 3, 4, 4, 5];
         * const result = OpenAPI.ArrayUtils.uniq(array);
         * // result 将为 [1, 2, 3, 4, 5]
         * ```
         */
        static uniq<T>(arr: readonly T[]): T[] {
            return Array.from(new Set(arr));
        }
    }
}
module OpenAPI {
  /**
   * Javascript Clipper
   * @version 6.4.2
   * 
   * @deprecated 该类库已经废弃，不再维护。未来版本将删除该类库。
   * @private
   */
  export class Clipper {
    /**
     * Clipper库，需要先执行init才能拿到库内容
     */
    static ClipperLib: any

    /**
     * 初始化
     */
    static Init() {
      OpenAPI.Clipper.ClipperLib = OpenAPI.Require.Init('clipper')
    }

    /**
     * 定义点转换函数
     */
    static toClipperPoints(points: { x: number; y: number }[]) {
      return points.map(point => ({ X: point.x, Y: point.y }))
    }

    /**
     *  判断两个多边形是否相交的函数
     */
    static polygonsIntersect(polygon1: { X: number; Y: number }[], polygon2: { X: number; Y: number }[]) {
      // 创建 Clipper 实例
      const ClipperLib = OpenAPI.Clipper.ClipperLib
      const clipper = new ClipperLib.Clipper()

      // 将多边形路径添加到 Clipper 实例中
      clipper.AddPath(polygon1, ClipperLib.PolyType.ptSubject, true)
      clipper.AddPath(polygon2, ClipperLib.PolyType.ptClip, true)

      // 执行相交判断
      const solution = new ClipperLib.Paths()
      clipper.Execute(ClipperLib.ClipType.ctIntersection, solution)

      // 如果有交点，说明两个多边形相交
      return solution.length > 0
    }
  }
}
module OpenAPI{
    /**
     * 常量操作工具
     */
    export class ConstantsUtils{
        /**
         * 蛇形命名法正则表达式
         */
        static CASE_SPLIT_PATTERN = /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;
        /**
         * 随机字符串范围
         */
        static RANDOM_STRING_RANGE = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
}module OpenAPI {

    /**
     * 光标工具
     */
    export class CursorUtils {

        /**
         * 光标系统样式名称
         * 
         * @example
         * ```ts
         * const cursorStyle = OpenAPI.CursorUtils.cursorSystemStyleName // 返回 ['default', 'auto', 'pointer', 'text', 'wait', 'help', 'crosshair', 'move', 'n-resize', 's-resize', 'w-resize', 'e-resize', 'nw-resize', 'sw-resize', 'ne-resize', 'se-resize']
         * ```
         */
        static get cursorSystemStyleName(): ['default', 'auto', 'pointer', 'text', 'wait', 'help', 'crosshair', 'move', 'n-resize', 's-resize', 'w-resize', 'e-resize', 'nw-resize', 'sw-resize', 'ne-resize', 'se-resize'] {
            return OpenAPI.Method.cursorSystemStyleName as any;
        }
    }
}
module OpenAPI {
    /**
     * 日期工具
     */
    export class DateUtils {

        /**
         * 日期转时间戳
         * 
         * @param {string} date - 日期
         * 
         * @example
         * ```ts
         * const timestamp = dateToTimestamp('2024-01-01') // 返回 1704038400000
         * const timestamp = dateToTimestamp('2024/01/01') // 返回 1704038400000
         * const timestamp = dateToTimestamp('2024-01-01 00:00:00') // 返回 1704038400000
         * const timestamp = dateToTimestamp('2024/01/01 00:00:00') // 返回 1704038400000
         * ```
         */
        static dateToTimestamp = (date: string): number => {
            return OpenAPI.Method.dateToTimestamp(date);
        };

        /**
         * 时间戳转日期
         * 
         * @param {number} timestamp - 时间戳
         * @param {string} data_type - 返回的数据类型 默认返回 '2024/01/01 00:00:00'
         * 
         * @example
         * ```ts
         * const date = timestampToDate(1704038400000) // 返回 '2024/01/01 00:00:00'
         * const date = timestampToDate(1704038400000, 'y') // 返回 '2024'
         * ```
         */
        static timestampToDate = (timestamp: number, data_type: '' | 'y' | 'm' | 'd' | 'h' | 'i' | 's' = ''): string | number | undefined => {
            return OpenAPI.Method.timestampToDate(timestamp, data_type);
        }
    }
}module OpenAPI {
    /**
     * 事件工具
     */
    export class EventUtils {

        /**
         * 获取事件页名称
         * 
         * @param {string} eventPage - 事件页
         * 
         * @example
         * ```ts
         * const eventPage = OpenAPI.EventUtils.eventPageName('enentPage') // 返回设定的事件页名称
         * ```
         */
        static eventPageName(eventPage: string): string | null {
            return OpenAPI.Method.getFeDataMessage(eventPage);
        }
    }
}module OpenAPI {

  /**
   * GameCreator相关API
   */
  export class GC {
    /**
     * GC平台相关API
     */
    static Cloud = {

      /**
       * 是否是GC平台
       * 
       * @returns {boolean} 如果是GC平台则返回 `true`，否则返回 `false`。
       * 
       * @example
       * ```ts
       * if (OpenAPI.GC.Cloud.isInGCCloud) {
       *  console.log('当前是GC平台')
       * }
       * ```
       */
      get isInGCCloud(): boolean {
        return window.location.href.includes('gamecreator')
      },

      /**
       * 游戏ID
       * 
       * @returns {number} 返回游戏ID。
       * 
       * @example
       * ```ts
       * const gameID = OpenAPI.GC.Cloud.GameID
       * ```
       */
      get GameID(): number {
        if (!OpenAPI.GC.Cloud.isInGCCloud)
          return 0
        const releaseProject = window.location.href.split('releaseProject/').pop()
        if (!releaseProject)
          return 0
        const split = releaseProject.split('/')
        const shift = split.shift()
        if (!shift)
          return 0
        const p = shift.split('_')
        return Number.parseInt(p[1])
      },

      /**
       * 游戏名称
       * 
       * @returns {string} 返回游戏名称。
       * 
       * @example
       * ```ts
       * const gameName = OpenAPI.GC.Cloud.GameName
       * ```
       */
      get GameName(): string {
        if (!OpenAPI.GC.Cloud.isInGCCloud)
          return ''
        const title = document.querySelector('title')
        if (!title)
          return ''
        const name = title.innerText
        const keywords = document.querySelector('meta[name="keywords"]')
        if (!keywords)
          return ''
        let p = keywords.getAttribute('content')
        const remove = `${name} | `
        if (p && p.startsWith(remove)) {
          p = p.replace(remove, '')
          return p
        }
        else {
          return ''
        }
      },

      /**
       * 当前版本号
       * 
       * @returns {number} 返回当前版本号。
       * 
       * @example
       * ```ts
       * const gameVersion = OpenAPI.GC.Cloud.GameVersion
       * ```
       */
      get GameVersion(): number {
        if (!OpenAPI.GC.Cloud.isInGCCloud)
          return 0
        const releaseProject = window.location.href.split('releaseProject/')
        const pop = releaseProject.pop()
        if (!pop)
          return 0
        const p = pop.split('/')
        return Number.parseInt(p[1])
      },

      /**
       * 作者ID
       * 
       * @returns {number} 返回作者ID。
       * 
       * @example
       * ```ts
       * const authorUID = OpenAPI.GC.Cloud.AuthorUID
       * ```
       */
      get AuthorUID(): number {
        if (!OpenAPI.GC.Cloud.isInGCCloud)
          return 0
        const releaseProject = window.location.href.split('releaseProject/')
        const pop = releaseProject.pop()
        if (!pop)
          return 0
        const split = pop.split('/')
        if (!split)
          return 0
        const shift = split.shift()
        if (!shift)
          return 0
        const p = shift.split('_')
        return Number.parseInt(p[0])
      },

      /**
       * 作者名称
       * 
       * @returns {string} 返回作者名称。
       * 
       * @example
       * ```ts
       * const authorName = OpenAPI.GC.Cloud.AuthorName
       * ```
       */
      get AuthorName(): string {
        if (!OpenAPI.GC.Cloud.isInGCCloud)
          return ''
        const title = document.querySelector('title')
        if (!title)
          return ''
        const p = title.innerText
        return p
      },

    }

    /**
     * 如果是编辑器则弹窗, 如果是发布后则输出
     * 
     * @param {any} text - 输出的文本
     * 
     * @example
     * ```ts
     * OpenAPI.GC.isCloudLog('这是一条日志')
     * ```
     */
    static isCloudLog(text: any): void {
      if (Config.RELEASE_GAME)
        trace(text)

      else
        alert(text)
    }
  }

}
module OpenAPI {
    /**
     * UI操作工具
     */
    export class InterfaceUtils {
        /**
         * 初始化一个空白的列表
         * @param ui UI根节点
         * @param list 列表组件
         * @param model 列表项模型
         * @param len 列表长度
         * @param isFocus 是否设置焦点
         * 
         * @example
         * ```ts
         * OpenAPI.InterfaceUtils.initList(ui, list, model, 10, true);
         * ```
         */
        static initList(list: UIList, model: any, len: number, isFocus: boolean = false): void {
            // 初始化列表数据
            let arr: any[] = [];
            for (let i = 1; i <= len; i++) {
                arr.push(new model());
            }

            // 列表赋值
            list.items = arr;

            // 是否设置焦点
            if (isFocus) {
                UIList.focus = list;
            }
        }

        /**
         * 封装数值类型的输入值
         * @param ui UI根节点
         * @param comp 输入组件
         * @param value 输入值
         * @param min 最小值
         * @param max 最大值
         * @param sub 减少按钮
         * @param add 增加按钮
         * @param minBtn 最小值按钮
         * @param maxBtn 最大值按钮
         * 
         * @example
         * ```ts
         * OpenAPI.InterfaceUtils.NumberInput(ui, comp, 10, 0, 100, sub, add, minBtn, maxBtn);
         * ```
         */
        static NumberInput(ui: UIRoot, comp: UIInput, value: number, min: number, max: number, subBtn?: UIButton, addBtn?: UIButton, minBtn?: UIButton, maxBtn?: UIButton): void {
            // 输入值不允许为空
            if (!value) {
                value = 0;
            }
            let numValue: number = value;

            // 输入值赋值
            comp.text = numValue.toString();

            // 检查输入值状态
            OpenAPI.InterfaceUtils.onNumberInputCheck(numValue, comp, min, max, subBtn, addBtn, minBtn, maxBtn);

            if (subBtn) {
                // 减少按钮点击事件
                subBtn.off(EventObject.CLICK, ui, OpenAPI.InterfaceUtils.onNumberInputSubClick);
                subBtn.on(EventObject.CLICK, ui, OpenAPI.InterfaceUtils.onNumberInputSubClick, [comp, min, max, subBtn, addBtn, minBtn, maxBtn]);
            }

            if (addBtn) {
                // 增加按钮点击事件
                addBtn.off(EventObject.CLICK, ui, OpenAPI.InterfaceUtils.onNumberInputAddClick);
                addBtn.on(EventObject.CLICK, ui, OpenAPI.InterfaceUtils.onNumberInputAddClick, [comp, min, max, subBtn, addBtn, minBtn, maxBtn]);
            }

            if (minBtn) {
                // 最小值按钮点击事件
                minBtn.off(EventObject.CLICK, ui, OpenAPI.InterfaceUtils.onNumberInputMinClick);
                minBtn.on(EventObject.CLICK, ui, OpenAPI.InterfaceUtils.onNumberInputMinClick, [comp, min, max, subBtn, addBtn, minBtn, maxBtn]);
            }

            if (maxBtn) {
                // 最大值按钮点击事件
                maxBtn.off(EventObject.CLICK, ui, OpenAPI.InterfaceUtils.onNumberInputMaxClick);
                maxBtn.on(EventObject.CLICK, ui, OpenAPI.InterfaceUtils.onNumberInputMaxClick, [comp, min, max, subBtn, addBtn, minBtn, maxBtn]);
            }

            // 输入值输入事件
            comp.off(EventObject.INPUT, ui, OpenAPI.InterfaceUtils.onNumberInput);
            comp.on(EventObject.INPUT, ui, OpenAPI.InterfaceUtils.onNumberInput, [comp, min, max, subBtn, addBtn, minBtn, maxBtn]);

            // 输入值失去焦点事件
            comp.off(EventObject.BLUR, ui, OpenAPI.InterfaceUtils.onNumberInput);
            comp.on(EventObject.BLUR, ui, OpenAPI.InterfaceUtils.onNumberInput, [comp, min, max, subBtn, addBtn, minBtn, maxBtn]);

            // 输入值改变事件
            comp.off(EventObject.CHANGE, ui, OpenAPI.InterfaceUtils.onNumberInput);
            comp.on(EventObject.CHANGE, ui, OpenAPI.InterfaceUtils.onNumberInput, [comp, min, max, subBtn, addBtn, minBtn, maxBtn]);

            // 输入值获得焦点事件
            comp.off(EventObject.FOCUS, ui, OpenAPI.InterfaceUtils.onNumberInput);
            comp.on(EventObject.FOCUS, ui, OpenAPI.InterfaceUtils.onNumberInput, [comp, min, max, subBtn, addBtn, minBtn, maxBtn]);
        }

        /**
         * 减少按钮点击事件
         * @param comp 输入组件
         * @param min 最小值
         * @param max 最大值
         * @param subBtn 减少按钮
         * @param addBtn 增加按钮
         * @param minBtn 最小值按钮
         * @param maxBtn 最大值按钮
         */
        private static onNumberInputSubClick(comp: UIInput, min: number, max: number, subBtn?: UIButton, addBtn?: UIButton, minBtn?: UIButton, maxBtn?: UIButton): void {
            // 输入值转换为数值
            let numValue: number = Number(comp.text);

            // 输入值减少
            numValue--;

            // 输入值小于最小值
            if (numValue < min) {
                numValue = min;
            }

            // 输入值赋值
            comp.text = numValue.toString();

            // 检查输入值状态
            OpenAPI.InterfaceUtils.onNumberInputCheck(numValue, comp, min, max, subBtn, addBtn, minBtn, maxBtn);
        }

        /**
         * 增加按钮点击事件
         * @param comp 输入组件
         * @param min 最小值
         * @param max 最大值
         * @param subBtn 减少按钮
         * @param addBtn 增加按钮
         * @param minBtn 最小值按钮
         * @param maxBtn 最大值按钮
         */
        private static onNumberInputAddClick(comp: UIInput, min: number, max: number, subBtn?: UIButton, addBtn?: UIButton, minBtn?: UIButton, maxBtn?: UIButton): void {
            // 输入值转换为数值
            let numValue: number = Number(comp.text);

            // 输入值增加
            numValue++;

            // 输入值大于最大值
            if (numValue > max) {
                numValue = max;
            }

            // 输入值赋值
            comp.text = numValue.toString();

            // 检查输入值状态
            OpenAPI.InterfaceUtils.onNumberInputCheck(numValue, comp, min, max, subBtn, addBtn, minBtn, maxBtn);
        }

        /**
         * 最小值按钮点击事件
         * @param comp 输入组件
         * @param min 最小值
         * @param max 最大值
         * @param subBtn 减少按钮
         * @param addBtn 增加按钮
         * @param minBtn 最小值按钮
         * @param maxBtn 最大值按钮
         */
        private static onNumberInputMinClick(comp: UIInput, min: number, max: number, subBtn?: UIButton, addBtn?: UIButton, minBtn?: UIButton, maxBtn?: UIButton): void {
            // 输入值
            let numValue: number = min;

            // 输入值赋值
            comp.text = numValue.toString();

            // 检查输入值状态
            OpenAPI.InterfaceUtils.onNumberInputCheck(numValue, comp, min, max, subBtn, addBtn, minBtn, maxBtn);
        }

        /**
         * 最大值按钮点击事件
         * @param comp 输入组件
         * @param min 最小值
         * @param max 最大值
         * @param subBtn 减少按钮
         * @param addBtn 增加按钮
         * @param minBtn 最小值按钮
         * @param maxBtn 最大值按钮
         */
        private static onNumberInputMaxClick(comp: UIInput, min: number, max: number, subBtn?: UIButton, addBtn?: UIButton, minBtn?: UIButton, maxBtn?: UIButton): void {
            // 输入值
            let numValue: number = max;

            // 输入值赋值
            comp.text = numValue.toString();

            // 检查输入值状态
            OpenAPI.InterfaceUtils.onNumberInputCheck(numValue, comp, min, max, subBtn, addBtn, minBtn, maxBtn);
        }

        /**
         * 输入值改变事件
         * @param comp 输入组件
         * @param min 最小值
         * @param max 最大值
         * @param subBtn 减少按钮
         * @param addBtn 增加按钮
         * @param minBtn 最小值按钮
         * @param maxBtn 最大值按钮
         */
        private static onNumberInput(comp: UIInput, min: number, max: number, subBtn?: UIButton, addBtn?: UIButton, minBtn?: UIButton, maxBtn?: UIButton): void {
            // 输入值
            let numValue: number = Number(comp.text);

            // 检查输入值状态
            OpenAPI.InterfaceUtils.onNumberInputCheck(numValue, comp, min, max, subBtn, addBtn, minBtn, maxBtn);
        }

        /**
         * 检查输入值状态
         * @param value 输入值
         * @param comp 输入组件
         * @param min 最小值
         * @param max 最大值
         * @param subBtn 减少按钮
         * @param addBtn 增加按钮
         * @param minBtn 最小值按钮
         * @param maxBtn 最大值按钮
         */
        private static onNumberInputCheck(value: number, comp: UIInput, min: number, max: number, subBtn?: UIButton, addBtn?: UIButton, minBtn?: UIButton, maxBtn?: UIButton): void {
            // 输入值
            let numValue: number = value;

            // 输入值小于最小值
            if (numValue < min) {
                numValue = min;
            }

            // 输入值大于最大值
            if (numValue > max) {
                numValue = max;
            }

            // 输入值赋值
            comp.text = numValue.toString();

            if (subBtn) {
                // 最小值情况下，启用减少按钮
                subBtn.disabled = numValue <= min;
            }

            if (addBtn) {
                // 最大值情况下，启用增加按钮
                addBtn.disabled = numValue >= max;
            }

            if (minBtn) {
                // 最小值情况下，禁用最小值按钮
                minBtn.disabled = numValue <= min;
            }

            if (maxBtn) {
                // 最大值情况下，禁用最大值按钮
                maxBtn.disabled = numValue >= max;
            }
        }
    }
}/**
 * OpenAPI 部分函数来自于以下项目
 */

/**
 * @see https://github.com/toss/es-toolkit
 * @version 1.9.0
 *
  MIT License

  Copyright (c) 2024 Viva Republica, Inc

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
 */

module OpenAPI {
    /**
     * 数学操作工具工具
     */
    export class MathUtils {

        /**
         * 将一个数字限制在包括的下限和上限范围内。
         *
         * 此函数接受一个数字和两个边界，并返回限制在指定边界内的数字。
         * 如果只提供一个边界，则返回值与该边界的最小值相比较。
         *
         * @param {number} value - 要限制的数字。
         * @param {number} minimum - 要限制的最小边界。
         * @param {number} maximum - 要限制的最大边界。
         * @returns {number} 在指定边界内限制后的数字。
         *
         * @example
         * ```ts
         * const result1 = OpenAPI.MathUtils.clamp(10, 5); // result1 将会是 5，因为 10 被限制在边界 5 上
         * const result2 = OpenAPI.MathUtils.clamp(10, 5, 15); // result2 将会是 10，因为它在边界 5 和 15 内
         * const result3 = OpenAPI.MathUtils.clamp(2, 5, 15); // result3 将会是 5，因为 2 被限制在边界 5 下
         * const result4 = OpenAPI.MathUtils.clamp(20, 5, 15); // result4 将会是 15，因为 20 被限制在边界 15 上
         * ```
         */
        static clamp(value: number, minimum: number, maximum?: number): number {
            if (maximum == null) {
                return Math.min(value, minimum);
            }

            return Math.min(Math.max(value, minimum), maximum);
        }

        /**
         * 检查值是否在指定范围内。
         *
         * @param {number} value 要检查的值。
         * @param {number} minimum 范围的下限（包含）。
         * @param {number} maximum 范围的上限（不包含）。
         * @returns {boolean} 如果值在指定范围内则返回 `true`，否则返回 `false`。
         * @throws {Error} 如果 `minimum` 大于或等于 `maximum`，抛出错误。
         *
         * @example
         * ```ts
         * const result1 = OpenAPI.MathUtils.inRange(3, 5); // result1 将返回 true。
         * const result2 = OpenAPI.MathUtils.inRange(1, 2, 5); // result2 将返回 false。
         * const result3 = OpenAPI.MathUtils.inRange(1, 5, 2); // 如果最小值大于或等于最大值，将抛出错误。
         * ```
         */
        static inRange(value: number, minimum: number, maximum?: number): boolean {
            if (maximum == null) {
                maximum = minimum;
                minimum = 0;
            }

            if (minimum >= maximum) {
                throw new Error('The maximum value must be greater than the minimum value.');
            }

            return minimum <= value && value < maximum;
        }

        /**
         * 计算数字数组的平均值。
         *
         * 如果数组为空，该函数返回 `NaN`。
         *
         * @param {number[]} nums - 要计算平均值的数字数组。
         * @returns {number} 数组中所有数字的平均值。
         *
         * @example
         * ```ts
         * const numbers = [1, 2, 3, 4, 5];
         * const result = OpenAPI.MathUtils.mean(numbers);
         * // result 将为 3
         * ```
         */
        static mean(nums: readonly number[]): number {
            return this.sum(nums) / nums.length;
        }

        /**
         * 使用 `getValue` 函数对数组中的每个元素应用后，计算数字数组的平均值。
         *
         * 如果数组为空，该函数返回 `NaN`。
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} items 要计算平均值的数组。
         * @param {(element: T) => number} getValue 从每个元素中选择数字值的函数。
         * @returns {number} 根据 `getValue` 函数确定的所有数字的平均值。
         *
         * @example
         * ```ts
         * OpenAPI.MathUtils.meanBy([{ a: 1 }, { a: 2 }, { a: 3 }], x => x.a); // 返回: 2
         * OpenAPI.MathUtils.meanBy([], x => x.a); // 返回: NaN
         * ```
         */
        static meanBy<T>(items: readonly T[], getValue: (element: T) => number): number {
            const nums = items.map(x => getValue(x));

            return this.mean(nums);
        }

        /**
         * 在给定范围内生成一个随机数。
         *
         * 如果只提供一个参数，则返回介于 `0` 和给定数字之间的随机数。
         *
         * @param {number} minimum - 下限值（包含）。
         * @param {number} maximum - 上限值（不包含）。
         * @returns {number} 在最小值（包含）和最大值（不包含）之间的随机数。返回的数可以是整数或小数。
         * @throws {Error} 如果 `maximum` 不大于 `minimum`，则抛出错误。
         *
         * @example
         * ```ts
         * const result1 = OpenAPI.MathUtils.random(0, 5); // 返回介于 0 和 5 之间的随机数。
         * const result2 = OpenAPI.MathUtils.random(5, 0); // 如果最小值大于最大值，则抛出错误。
         * const result3 = OpenAPI.MathUtils.random(5, 5); // 如果最小值等于最大值，则抛出错误。
         * ```
         */
        static random(minimum: number, maximum?: number): number {
            if (maximum == null) {
                maximum = minimum;
                minimum = 0;
            }

            if (minimum >= maximum) {
                throw new Error('Invalid input: The maximum value must be greater than the minimum value.');
            }

            return Math.random() * (maximum - minimum) + minimum;
        }

        /**
         * 在最小值（包含）和最大值（不包含）之间生成一个随机整数。
         *
         * 如果只提供一个参数，则返回介于 `0` 和给定数字之间的随机数。
         *
         * @param {number} minimum - 下限值（包含）。
         * @param {number} maximum - 上限值（不包含）。
         * @returns {number} 在最小值（包含）和最大值（不包含）之间的随机整数。
         * @throws {Error} 如果 `maximum` 不大于 `minimum`，则抛出错误。
         *
         * @example
         * ```ts
         * const result = OpenAPI.MathUtils.randomInt(0, 5); // result 将是介于 0（包含）和 5（不包含）之间的随机整数
         * const result2 = OpenAPI.MathUtils.randomInt(5, 0); // 这将抛出错误
         * ```
         */
        static randomInt(minimum: number, maximum?: number): number {
            return Math.floor(this.random(minimum, maximum!));
        }

        /**
         * 返回从 `start` 到 `end` 的数字数组，步长为 `step`。
         *
         * 如果未提供 `step`，默认为 `1`。
         *
         * @param {number} start - 范围的起始数字（包含）。
         * @param {number} [end] - 范围的结束数字（不包含）。
         * @param {number} [step] - 范围的步长值。默认为 `1`。
         * @returns {number[]} 包含从 `start` 到 `end` 的数字数组，步长为 `step`。
         *
         * @example
         * ```ts
         * // 返回 [0, 1, 2, 3]
         * OpenAPI.MathUtils.range(4);
         *
         * // 返回 [0, 5, 10, 15]
         * OpenAPI.MathUtils.range(0, 20, 5);
         *
         * // 返回 [0, -1, -2, -3]
         * OpenAPI.MathUtils.range(0, -4, -1);
         *
         * // 抛出错误: 步长值必须是非零整数。
         * OpenAPI.MathUtils.range(1, 4, 0);
         * ```
         */
        static range(start: number, end?: number, step?: number): number[] {
            if (end == null) {
                end = start;
                start = 0;
            }

            if (step == null) {
                step = 1;
            }

            if (!Number.isInteger(step) || step === 0) {
                throw new Error(`The step value must be a non-zero integer.`);
            }

            const length = Math.max(Math.ceil((end - start) / step), 0);
            const result = new Array(length);

            for (let i = 0; i < length; i++) {
                result[i] = start + i * step;
            }

            return result;
        }

        /**
         * 将一个数字四舍五入到指定的精度。
         *
         * 此函数接受一个数字和一个可选的精度值，并返回四舍五入到指定小数位数的数字。
         *
         * @param {number} value - 要四舍五入的数字。
         * @param {number} [precision=0] - 要四舍五入的小数位数。默认为 `0`。
         * @returns {number} 四舍五入后的数字。
         * @throws {Error} 如果 `precision` 不是整数，则抛出错误。
         *
         * @example
         * ```ts
         * const result1 = OpenAPI.MathUtils.round(1.2345); // result1 将是 1
         * const result2 = OpenAPI.MathUtils.round(1.2345, 2); // result2 将是 1.23
         * const result3 = OpenAPI.MathUtils.round(1.2345, 3); // result3 将是 1.235
         * const result4 = OpenAPI.MathUtils.round(1.2345, 3.1); // 这将抛出一个错误
         * ```
         */
        static round(value: number, precision = 0): number {
            if (!Number.isInteger(precision)) {
                throw new Error('Precision must be an integer.');
            }
            const multiplier = Math.pow(10, precision);
            return Math.round(value * multiplier) / multiplier;
        }

        /**
         * 计算数组中数字的总和。
         *
         * 此函数接受一个数字数组，并返回数组中所有元素的总和。
         *
         * @param {number[]} nums - 要求和的数字数组。
         * @returns {number} 数组中所有数字的总和。
         *
         * @example
         * ```ts
         * const numbers = [1, 2, 3, 4, 5];
         * const result = OpenAPI.MathUtils.sum(numbers);
         * // result 将为 15
         * ```
         */
        static sum(nums: readonly number[]): number {
            let result = 0;

            for (const num of nums) {
                result += num;
            }

            return result;
        }
    }
}module OpenAPI {

  /**
   * 通用API
   * 
   * @deprecated 尽管这个类在以前很常用，但是现在已经不推荐使用了。请使用新的类。当然，如果你有特殊需求，你仍然可以使用这个类。
   * @private
   */
  export class Method {
    /**
     * 当前页面协议
     * @ "http://" : "https://"
     * 
     * @example
     * ```ts
     * const origin = OpenAPI.Method.Origin // 返回 "https://"
     * ```
     */
    static get Origin(): string {
      return window.location.protocol === 'http:' ? 'http://' : 'https://'
    }

    /**
     * 随机字符串
     * @param {number} len 随机字符串的长度
     * @param {string} _charStr 随机的字符串
     * 
     * @example
     * ```ts
     * const randomString = OpenAPI.Method.getRandomString(6) // 返回 "aBcDeF"
     * ```
     */
    static getRandomString(len: number, _charStr = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'): string {
      const min = 0
      const max = _charStr.length - 1
      let _str = ''
      // 不允许为0的情况
      if (len === 0)
        return ''

      // 循环生成字符串
      for (let i = 0, index; i < len; i++) {
        index = (function (randomIndexFunc, i) {
          return randomIndexFunc(min, max, i, randomIndexFunc)
        })((min: any, max: any, i: any, _self: any) => {
          let indexTemp = Math.floor(Math.random() * (max - min + 1) + min)
          const numStart = _charStr.length - 10
          if (i === 0 && indexTemp >= numStart)
            indexTemp = _self(min, max, i, _self)

          return indexTemp
        }, i)
        _str += _charStr[index]
      }
      return _str
    }

    /**
     * 日期转时间戳, 格式 1970/01/01 00:00:00 或 1970-01-01 00:00:00
     * @param {string} date 日期
     * 
     * @example
     * ```ts
     * const timestamp = OpenAPI.Method.dateToTimestamp('2024-01-01') // 返回 1704038400000
     * const timestamp = OpenAPI.Method.dateToTimestamp('2024/01/01') // 返回 1704038400000
     * ```
     */
    static dateToTimestamp(date: string): number {
      return new Date(date.replace(/-/g, '/')).getTime()
    }

    /**
     * 时间戳转日期, 格式 1609459200。 支持获取特定时间
     * @param {number} data 时间戳。输出格式 1970/01/01 00:00:00
     * @param {string} data_type 【可选】获取时间类型 y、m、d、h、i、s。如 s = 获取时间戳中的秒
     * 
     * @example
     * ```ts
     * const date = OpenAPI.Method.timestampToDate(1704038400000) // 返回 '2024/01/01 00:00:00'
     * const date = OpenAPI.Method.timestampToDate(1704038400000, 'y') // 返回 '2024'
     * ```
     */
    static timestampToDate(data: number, data_type: string = ''): string | number | undefined {
      let _data = 0
      if (String(data).length === 13)
        _data = data

      else
        _data = data * 1000

      const time = new Date(_data)
      let _time
      if (data_type === 'y')
        _time = time.getFullYear()

      if (data_type === 'm')
        _time = pad(time.getMonth() + 1, 2)

      if (data_type === 'd')
        _time = pad(time.getDate(), 2)

      if (data_type === 'h')
        _time = pad(time.getHours(), 2)

      if (data_type === 'i')
        _time = pad(time.getMinutes(), 2)

      if (data_type === 's')
        _time = pad(time.getSeconds(), 2)

      if (data_type === '')
        _time = `${time.getFullYear()}/${pad(time.getMonth() + 1, 2)}/${pad(time.getDate(), 2)} ${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(time.getSeconds(), 2)}`

      function pad(num: number, size: number): string {
        let s = `${num}`
        while (s.length < size) s = `0${s}`
        return s
      }
      return _time
    }

    /**
     * 判断常量变量类型
     * @param {any} constant 常量
     * @param {number} variable 变量
     * @param {number} index_type 选项类型 0 = 常量 1 = 变量
     * @param {number} variable_type 【默认数值】变量类型 0 = 数值, 1 = 字符串, 2 = 开关(返回 0 = 关闭, 1 = 开启)
     * 
     * @example
     * ```ts
     * const variable_value = OpenAPI.Method.JudgeTypeConstantVariable(1, 1, 0) // 返回 1
     * ```
     */
    static JudgeTypeConstantVariable(constant: any, variable: number, index_type: number, variable_type: number = 0): any {
      let variable_value
      if (index_type === 0) {
        variable_value = constant
      }
      else {
        // 数值
        if (variable_type === 0)
          variable_value = Game.player.variable.getVariable(variable)

        // 字符串
        if (variable_type === 1)
          variable_value = Game.player.variable.getString(variable)

        // 开关
        if (variable_type === 2)
          variable_value = Game.player.variable.getSwitch(variable)
      }
      return variable_value
    }

    /**
     * 光标系统样式名称
     * 'default', 'auto', 'pointer', 'text', 'wait', 'help', 'crosshair', 'move', 'n-resize', 's-resize', 'w-resize', 'e-resize', 'nw-resize', 'sw-resize', 'ne-resize', 'se-resize'
     * 
     * @example
     * ```ts
     * const cursorStyle = OpenAPI.Method.cursorSystemStyleName // 返回 ['default', 'auto', 'pointer', 'text', 'wait', 'help', 'crosshair', 'move', 'n-resize', 's-resize', 'w-resize', 'e-resize', 'nw-resize', 'sw-resize', 'ne-resize', 'se-resize']
     * ```
     */
    static cursorSystemStyleName: string[] = [
      'default', 'auto', 'pointer', 'text', 'wait', 'help', 'crosshair', 'move', 'n-resize', 's-resize', 'w-resize', 'e-resize', 'nw-resize', 'sw-resize', 'ne-resize', 'se-resize',
    ]

    /**
     * 基于cursorSystemStyleName来弹出指定名称
     * @param {string[]} name 弹出指定的名称
     * 
     * @example
     * ```ts
     * const cursorStyle = OpenAPI.Method.cursorSystemStyleName_spliceName(['default', 'auto']) // 返回 ['pointer', 'text', 'wait', 'help', 'crosshair', 'move', 'n-resize', 's-resize', 'w-resize', 'e-resize', 'nw-resize', 'sw-resize', 'ne-resize', 'se-resize']
     * ```
     */
    static cursorSystemStyleName_spliceName(name: string[]): string[] {
      const cursorName = [...OpenAPI.Method.cursorSystemStyleName]
      return cursorName.filter(x => name.indexOf(x.toString()) === -1)
    }

    /**
     * 检查当前模板是否是兼容的模板ID。 false = 不兼容, true = 兼容
     * @param {number[]} templateID 兼容的模板ID合集
     * 
     * @example
     * ```ts
     * const checkTemplateID = OpenAPI.Method.checkTemplateID([1, 2, 3]) // 返回 false
     * ```
     */
    static checkTemplateID(templateID: number[]): boolean {
      return templateID.indexOf(Config.templateID) !== -1
    }

    /**
     * 随机颜色
     * 
     * @example
     * ```ts
     * const randomColor = OpenAPI.Method.getRandomColor() // 返回 "#FFFFFF"
     * ```
     */
    static getRandomColor(): string {
      return `#${(Math.random() * 0xFFFFFF << 0).toString(16)}`
    }

    /**
     * 更简单的HttpRequest
     * @param {string} url 请求地址
     * @param {any} json 数据
     * @param {any} completeText 完成事件
     * @param {any} errorText 发生错误时事件
     * @param {any} trigger 触发器
     * 
     * @deprecated 请使用 new HttpRequest()
     */
    static sendRequest(url: string, json: any, completeText: any, errorText: any, trigger: any = null, requestType = 'post'): void {
      const ur = new HttpRequest()
      ur.send(url, JSON.stringify(json), requestType, 'json', ['Content-Type', 'application/json'])
      if (trigger) {
        trigger.pause = true
        trigger.offset(1)
      }
      ur.once(EventObject.COMPLETE, this, (content: any) => {
        completeText(content)
        if (trigger)
          CommandPage.executeEvent(trigger)
      })
      ur.once(EventObject.ERROR, this, (content: any) => {
        errorText(content)
        if (trigger)
          CommandPage.executeEvent(trigger)
      })
    }

    /**
     * 解析文本内变量占位符
     * @param {string} text 文本
     * @param {[] | null} getData 返回函数
     * @param {RegExp[]} regex 正则表达式
     */
    static parseVarPlaceholderData(text: string, getData: (((s: any) => number) | ((s: any) => string))[] | null = null, regex: RegExp[] | null = null): string {
      if (getData == null) {
        getData = [
          (s: any) => { return Game.player.variable.getVariable(s) },
          (s: any) => { return Game.player.variable.getString(s) },
          (s: any) => { return Game.player.variable.getSwitch(s) },
          (s: any) => { return ClientWorld.variable.getVariable(s) },
          (s: any) => { return ClientWorld.variable.getString(s) },
          (s: any) => { return ClientWorld.variable.getSwitch(s) },
          (s: any) => { return Game.player.variable.getVariable(Game.player.variable.getVariable(s)) },
          (s: any) => { return Game.player.variable.getString(Game.player.variable.getVariable(s)) },
          (s: any) => { return Game.player.variable.getSwitch(Game.player.variable.getVariable(s)) },
          (s: any) => { return ClientWorld.variable.getVariable(ClientWorld.variable.getVariable(s)) },
          (s: any) => { return ClientWorld.variable.getString(ClientWorld.variable.getVariable(s)) },
          (s: any) => { return ClientWorld.variable.getSwitch(ClientWorld.variable.getVariable(s)) },
        ]
      }

      if (regex == null) {
        regex = [
          /\[@v\w+\]/g,
          /\[@s\w+\]/g,
          /\[@b\w+\]/g,
          /\[\$v\w+\]/g,
          /\[\$s\w+\]/g,
          /\[\$b\w+\]/g,
          /\[@@v\w+\]/g,
          /\[@@s\w+\]/g,
          /\[@@b\w+\]/g,
          /\[\$\$v\w+\]/g,
          /\[\$\$s\w+\]/g,
          /\[\$\$b\w+\]/g,
        ];
      }


      for (let i = 0; i < getData.length; i++) {
        const start = i >= 6 ? 4 : 3
        const result = this.replacePlaceholderData(text, regex[i], getData[i], start)
        if (result)
          text = result
      }
      return text
    }

    /**
     * 解析文本内游戏变量占位符
     * @param {string} text 文本
     * @param {string} gameData 游戏变量数据
     * @param {RegExp[]} regex 正则表达式
     */
    static parseGameVarPlaceholderData(text: string, gameData: any[], regex: RegExp[] | null = null): string {
      const getData = [
        // @ts-ignore 忽略处理
        (s: any) => gameData[s] && gameData[s][0] ? CustomGameNumber[`f${gameData[s][0]}`](null, gameData[s][1]) : 0,
        // @ts-ignore 忽略处理
        (s: any) => gameData[s] && gameData[s][0] ? CustomGameString[`f${gameData[s][0]}`](null, gameData[s][1]) : 0,
        // @ts-ignore 忽略处理
        (s: any) => gameData[s] && gameData[s][0] ? CustomCondition[`f${gameData[s][0]}`](null, gameData[s][1]) : 0,
      ];
      if (regex == null) {
        regex = [
          /\[@gv\w+\]/g,
          /\[@gs\w+\]/g,
          /\[@gb\w+\]/g,
        ];
      }

      for (let i = 0; i < getData.length; i++) {
        const result = this.replacePlaceholderData(text, regex[i], getData[i], 4)
        if (result)
          text = result
      }
      return text
    }

    /**
     * 替换占位符数据
     * @param {string} text 文本
     * @param {RegExp} regex 正则表达式
     * @param {any} getData 解析占位符数据
     * @param {number} start 起始位
     * @param {string} end 结束符号
     */
    static replacePlaceholderData(text: string, regex: RegExp, getData: any, start: number = 3, end: string = ']'): string | null {
      const matches = text.match(regex)
      if (matches) {
        for (let i = 0; i < matches.length; i++) {
          const d = matches[i]
          const s = Number(d.slice(start, d.indexOf(end)))
          if (s || s == 0) {
            const v = getData(s)
            text = text.replace(d, v)
          }
        }
        return text
      }
      else {
        return null
      }
    };

    /**
    * 解析文本内函数组合
    * @param {string} text 文本
    * @param {RegExp[]} regex 正则表达式
    */
    static parseCombinedFunctions(text: string, regex: RegExp[] | null = null): string {
      const getData = [
        (...args: number[]) => { return Math.max(...args) },
        (...args: number[]) => { return Math.min(...args) },
        (a: number, b: number) => {
          const [min, max] = a < b ? [a, b] : [b, a];
          return Math.random() * (max - min) + min;
        },
        (...args: number[]) => { return args.reduce((acc, val) => acc + val, 0) / args.length },
        (num: number) => { return Math.abs(num) },
        (num: number) => { return Math.sqrt(num) },
        (num: number) => { return Math.round(num) },
      ];

      if (regex == null) {
        regex = [
          /max\((-?\d+(\.\d+)?(,\s*)?)*-?\d+(\.\d+)?\)/g,
          /min\((-?\d+(\.\d+)?(,\s*)?)*-?\d+(\.\d+)?\)/g,
          /random\(-?\d+(\.\d+)?(,\s*)?-?\d+(\.\d+)?\)/g,
          /reduce\((-?\d+(\.\d+)?(,\s*)?)*-?\d+(\.\d+)?\)/g,
          /abs\(-?\d+(\.\d+)?\)/g,
          /sqrt\((\d+(\.\d+)?)\)/g,
          /round\(-?\d+(\.\d+)?\)/g,
        ];
      }

      for (let i = 0; i < getData.length; i++) {
        const result = this.replaceFunctionCombinations(text, regex[i], getData[i]);
        if (result)
          text = result;
      }
      return text;
    }

    /**
       * 替换函数组合数据
       * @param {string} text 文本
       * @param {RegExp} regex 正则表达式
       * @param {any} getData 解析函数组合数据
       */
    static replaceFunctionCombinations(text: string, regex: RegExp, getData: any): string | null {
      const matches = text.match(regex);
      if (matches) {
        for (let i = 0; i < matches.length; i++) {
          const d = matches[i];
          const argsString = d.slice(d.indexOf('(') + 1, d.indexOf(')'));
          const args = argsString.split(',').map(Number);
          if (args.every(arg => !isNaN(arg))) {
            const v = getData(...args);
            text = text.replace(d, v.toString());
          }
        }
        return text;
      } else {
        return null;
      }
    }

    /**
     * 解析并计算复杂表达式的函数
     * @param {string} expression - 要解析的表达式
     * @returns {any} 计算结果，如果表达式无效则返回 null
     * @returns {operators} 正则表达式
     */
    static evaluateComplexExpression(expression: string, operators: any[]): any {
      // 去除表达式中的空格
      expression = expression.replace(/\s+/g, '');

      /**
       * 递归解析函数
       * @param {string} expr - 要解析的子表达式
       * @returns {any} 子表达式的计算结果
       */
      function parseExpression(expr: string, operators: any[]): any {
        // 处理括号内的表达式
        while (expr.includes('(')) {
          expr = expr.replace(/\([^()]*\)/g, match => {
            return String(parseExpression(match.slice(1, -1), operators));
          });
        }

        // 逐个运算符处理表达式
        for (const { regex, func } of operators) {
          while (regex.test(expr)) {
            expr = expr.replace(regex, (match, p1, p2) => {
              const operand1 = isNaN(p1 as any) ? (p1 === 'true' ? true : p1 === 'false' ? false : p1) : parseFloat(p1);
              const operand2 = isNaN(p2 as any) ? (p2 === 'true' ? true : p2 === 'false' ? false : p2) : parseFloat(p2);
              return String(func(operand1, operand2));
            });
          }
        }

        // 处理逻辑非运算符
        if (expr.startsWith('!')) {
          const operand = expr.slice(1);
          return !parseExpression(operand, operators);
        }

        // 返回最终结果
        const result = isNaN(expr as any) ? (expr === 'true' ? true : expr === 'false' ? false : expr) : parseFloat(expr);
        return result;
      }

      // 解析并计算输入表达式
      return parseExpression(expression, operators);
    }

    /**
     * 将阿拉伯数字转换为罗马数字的函数
     * @param {number} num - 要转换的阿拉伯数字
     * @returns {string} 对应的罗马数字
     */
    static intToRoman(num: number): string {
      // 定义一个数组，包含罗马数字的数值部分
      const val = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
      // 定义一个数组，包含与数值对应的罗马数字符号
      const syms = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];

      // 初始化空字符串，用于存储最终的罗马数字
      let roman = "";

      // 遍历数值数组
      for (let i = 0; i < val.length; i++) {
        // 当输入数字大于或等于当前数值时
        while (num >= val[i]) {
          // 将对应的罗马数字符号添加到结果字符串中
          roman += syms[i];
          // 从输入数字中减去当前数值
          num -= val[i];
        }
      }

      // 返回最终的罗马数字字符串
      return roman;
    }

    /**
     * 打乱数组
     * @param array - 需要打乱的数组。
     * @returns 返回一个新的打乱顺序的数组。
     */
    static shuffleArray<T>(array: T[]): T[] {
      // 复制输入数组，避免修改原数组
      const shuffledArray = array.slice();

      // 从数组末尾开始遍历到第二个元素
      for (let i = shuffledArray.length - 1; i > 0; i--) {
        // 在 0 到 i 之间随机选择一个索引
        const j = Math.floor(Math.random() * (i + 1));

        // 交换元素 shuffledArray[i] 和 shuffledArray[j]
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
      }

      // 返回打乱顺序后的数组
      return shuffledArray;
    }

    /**
     * 获取事件页名称
     * @param eventPage 事件页
     * @returns 
     */
    static getFeDataMessage(eventPage: string): string | null {
      if (!eventPage) return null;
      var startIdx = eventPage.indexOf(String.fromCharCode(5));
      var feName = eventPage.slice(0, startIdx);
      return feName ? feName : null;
    }

    /**
     * 获得模块数据
     * @param id 模块id
     * @param comp 回调
     * @param length 类别长度 默认16
     */
    static getModuleData(id: number, comp: Callback, length = 16) {
      for (let i = 1; i <= length; i++) {
        for (let j = 1; j <= GameData.getLength(id, i); j++) {
          let d = GameData.getModuleData(id, (i - 1) * 1000 + j);
          if (d && d.name) {
            comp.runWith([d]);
          }
        }
      }
    }

    /**
     * 获取两个数之间的范围，包括起始和结束数字
     * @param start - 范围的起始数字
     * @param end - 范围的结束数字
     * @returns 包含从起始数字到结束数字之间所有数字的数组
     */
    static getRange(start: number, end: number): number[] | null {
      if (typeof start !== 'number' || typeof end !== 'number') {
        return null
      }
      const range: number[] = [];
      if (start <= end) {
        // 如果起始数字小于或等于结束数字，按升序添加数字
        for (let i = start; i <= end; i++) {
          range.push(i);
        }
      } else {
        // 如果起始数字大于结束数字，按降序添加数字
        for (let i = start; i >= end; i--) {
          range.push(i);
        }
      }
      return range;
    }
  }
}
module OpenAPI {
    /**
     * 模块工具
     */
    export class ModuleUtils {

        /**
         * 获得模块数据
         * 
         * @param {number} id - 模块ID
         * @param {Callback} comp 回调
         * @param {number} length 类别长度 默认16
         * 
         * @example
         * ```ts
         * const moduleData = getModuleData(1, Callback.New((data) => {
         *     console.log(data)
         * }, this)) // 返回 '模块数据'
         * ```
         */
        static getModuleData = (id: number, comp: Callback, length: number = 16): void => {
            return OpenAPI.Method.getModuleData(id, comp, length);
        }
    }
}module OpenAPI {

    /**
     * 操作系统工具
     */
    export class OsUtils {

        /**
         * 获取当前操作系统的用户名称
         * 
         * 只支持Windows系统
         * 
         * @example
         * ```ts
         * const systemUserName = OpenAPI.OsUtils.systemUserName
         * ```
         */
        static get systemUserName(): string {
            const userInfo = OpenAPI.RunUtils.os.userInfo();
            if (userInfo == null) {
                return "";
            }
            if (userInfo.username == null) {
                return "";
            }

            try {
                let fullName = "";
                let buffer = OpenAPI.RunUtils.child_process.execSync(`wmic useraccount where name="${userInfo.username}" get fullname`, { encoding: 'buffer' });
                const langInfo = window.navigator.language;
                let decoder;
                if (langInfo == "zh-CN") {
                    decoder = new TextDecoder('gbk');
                }
                else {
                    decoder = new TextDecoder();
                }
                let info: string = decoder.decode(buffer);
                let fullNameInfo = info.split("\n")[1];
                fullName = fullNameInfo.trim();
                if (fullName == "") {
                    //如果是空的时候就用用户名
                    fullName = userInfo.username;
                }
                return fullName;
            }
            catch (e) {
                console.error(e);
                return userInfo.username;
            }
        }
    }
}module OpenAPI {
    /**
     * 路径工具
     */
    export class PathUtils {

        /**
         * 获取当前游戏根路径
         * 
         * PC版本与WEB版本返回的路径不同，通常WEB版本将携带路由以及标识符，PC版本则返回本地路径
         * 
         * @example
         * ```ts
         * const gamePath = OpenAPI.RunUtils.gamePath // 返回当前游戏根路径
         * ```
         */
        static get gamePath(): string | undefined {
            let path = '';
            if (OpenAPI.RunUtils.gameEnv == 2) {
                const random = OpenAPI.MathUtils.randomInt(1000, 100000);
                const tempIdentifier = `OpenAPITempGamePathIdentifier${random}`;
                //@ts-ignore
                path = SinglePlayerGame.toWebSaveFileURL(tempIdentifier).replace(tempIdentifier, '')
            } else {
                //@ts-ignore
                path = FileUtils.nativePath
            }
            return path;
        }

        /**
         * 根据当前游戏环境获取当前游戏根路径
         * 
         * 如果是PC版本则返回相对路径，实际是返回空。WEB版本则返回绝对路径
         * 
         * @example
         * ```ts
         * const gamePathByEnv = OpenAPI.PathUtils.gamePathByEnv // 返回当前游戏根路径
         * ```
         */
        static get gamePathByEnv(): string | undefined {
            if (OpenAPI.RunUtils.gameEnv == 2) {
                return PathUtils.gamePath;
            } else { 
                return ''
            }
        }
    }
}module OpenAPI{
  /**
   * 点
   */
  export class Point {
    /**
     * 数值坐标数组转对象坐标数组
     * 
     * @param {number[]} arr - 数值坐标数组
     * 
     * @example
     * ```ts
     * const arr = [1, 2, 3, 4, 5, 6]
     * const result = OpenAPI.Point.toCoordinateObjects(arr) // 返回对象坐标数组
     * ```
     */
    static toCoordinateObjects(arr: number[]): { x: number; y: number }[] {
      const result: { x: number; y: number }[] = []
      for (let i = 0; i < arr.length; i += 2)
        result.push({ x: arr[i], y: arr[i + 1] })

      return result
    }

    /**
     * 相对于父级容器的坐标
     * 
     * @param {Array<{ x: number; y: number }>} objectsArray - 对象坐标数组
     * @param {number} parent - 父级容器坐标
     * 
     * @example
     * ```ts
     * const objectsArray = [{ x: 1, y: 2 }, { x: 3, y: 4 }]
     * const parent = { x: 5, y: 6 }
     * const result = OpenAPI.Point.relativeToParent(objectsArray, parent) // 返回相对于父级容器的坐标
     * ```
     */
    static relativeToParent(objectsArray: { x: number; y: number }[], parent: { x: number; y: number }) {
      return objectsArray.map(point => ({
        x: point.x + parent.x,
        y: point.y + parent.y,
      }))
    }
  }
}
module OpenAPI {
  /**
   * 第三方库
   * 
   * @deprecated 该类库已经废弃，不再维护。未来版本将删除该类库，请使用RunUtils。
   * @private
   */
  export class Require {
    /**
     * 库初始化
     */
    static Init(name: string, filename?: string) {
      filename = filename ? `${name}/${filename}` : `${name}/${name}`
      // @ts-expect-error 忽略处理
      const path = os.inGC() ? `${decodeURIComponent(Laya.URL.formatURL('asset'))}/myally_modules/${filename}` : `${FileUtils.nativePath}/asset/myally_modules/${filename}`
      // @ts-expect-error 忽略处理
      const topRequire = typeof require != 'undefined' ? require : top.top.require
      return topRequire(path)
    }
  }
}
module OpenAPI {

    /**
     * 运行时工具
     */
    export class RunUtils {

        /**
         * 获取默认引入的库
         * 
         * -- 只支持PC版本
         * 
         * -- WEB版本基于LocalStorage
         * 
         * @param {string} name - 库名
         * 
         * @example
         * ```ts
         * const fs = OpenAPI.RunUtils.require('fs') // 返回引入的库
         * ```
         */
        static require(name: string): any | undefined {
            // @ts-ignore
            return mainDomain_require(name);
        }

        /**
         * fs库
         * 
         * -- 只支持PC版本
         * 
         * -- WEB版本基于LocalStorage
         * 
         * @example
         * ```ts
         * const fs = OpenAPI.RunUtils.fs // 返回引入的fs库
         * ```
         */
        static get fs(): any | undefined {
            return OpenAPI.RunUtils.require('fs');
        }

        /**
         * path库
         * 
         * -- 只支持PC版本
         * 
         * -- WEB版本基于LocalStorage
         * 
         * @example
         * ```ts
         * const path = OpenAPI.RunUtils.path // 返回引入的path库
         * ```
         */
        static get path(): any | undefined {
            return OpenAPI.RunUtils.require('path');
        }

        /**
         * os库
         * 
         * -- 只支持PC版本
         * 
         * -- WEB版本基于LocalStorage
         * 
         * @example
         * ```ts
         * const os = OpenAPI.RunUtils.os // 返回引入的os库
         * ```
         */
        static get os(): any | undefined {
            return OpenAPI.RunUtils.require('os');
        }

        /**
         * process库
         * 
         * -- 只支持PC版本
         * 
         * -- WEB版本基于LocalStorage
         * 
         * @example
         * ```ts
         * const process = OpenAPI.RunUtils.process // 返回引入的process库
         * ```
         */
        static get process(): any | undefined {
            return OpenAPI.RunUtils.require('process');
        }

        /**
         * child_process库
         * 
         * -- 只支持PC版本
         * 
         * -- WEB版本基于LocalStorage
         * 
         * @example
         * ```ts
         * const child_process = OpenAPI.RunUtils.child_process // 返回引入的child_process库
         * ```
         */
        static get child_process(): any | undefined {
            return OpenAPI.RunUtils.require('child_process');
        }

        /**
         * nw.gui库
         * 
         * -- 只支持PC版本
         * 
         * -- WEB版本基于LocalStorage
         * 
         * @example
         * ```ts
         * const nw_gui = OpenAPI.RunUtils.nw_gui // 返回引入的nw.gui库
         * ```
         */
        static get nw_gui(): any | undefined {
            return OpenAPI.RunUtils.require('nw.gui');
        }

        /**
         * 当前游戏环境
         * 
         * 0-编辑器 
         * 
         * 1-PC 
         * 
         * 2-WEB
         * 
         * @example
         * ```ts
         * const gameEnv = OpenAPI.RunUtils.gameEnv // 返回当前游戏环境
         * ```
         */
        static get gameEnv(): number {
            if (Config.EDIT_MODE) return 0;
            if (os.platform == 2) return 1;
            return 2;
        }
    }
}
module OpenAPI {

    /**
     * Created by 千叶不冷 on 2021-09-24 15:26:19.
     * 通用悬浮框(提示框)
     */
    export class ShowTips {
        /**
         * 当前提示框界面id
         */
        static tipUIId: number

        /**
         * 即将显示的界面id
         */
        static onTipId: number

        /**
         * 当前提示框ui
         */
        static tipUI: UIBase | any

        /**
         * 构造函数
         */
        constructor() { }

        /**
         * 显示提示框
         * @param tipData 数据
         * @param id 提示框界面id
         */
        static showTips(tipData: any, id: number) {
            this.tipUIId = id
            if (!this.tipUI || this.tipUI.id !== String(id)) {
                this.tipUI = GameUI.show(id)
                this.tipUI.x = stage.mouseX + 15
                this.tipUI.y = stage.mouseY + 15
                const maxWidth = Config.WINDOW_WIDTH - 5
                const maxHeight = Config.WINDOW_HEIGHT - 15
                if (this.tipUI.tipRoot) {
                    if (this.tipUI.x + this.tipUI.tipRoot.width > maxWidth)
                        this.tipUI.x = maxWidth - this.tipUI.tipRoot.width
                    if (this.tipUI.y + this.tipUI.tipRoot.height > maxHeight)
                        this.tipUI.y = maxHeight - this.tipUI.tipRoot.height
                }
                this.tipUI.mouseEnabled = false
                for (const data in tipData) {
                    if (this.tipUI[data] && tipData[data]) {
                        for (const d in tipData[data])
                            this.tipUI[data][d] = tipData[data][d]
                    }
                }
            }
            else {
                this.tipUI.x = stage.mouseX + 15
                this.tipUI.y = stage.mouseY + 15
                const maxWidth = Config.WINDOW_WIDTH - 5
                const maxHeight = Config.WINDOW_HEIGHT - 15
                if (this.tipUI.tipRoot) {
                    if (this.tipUI.x + this.tipUI.tipRoot.width > maxWidth)
                        this.tipUI.x = maxWidth - this.tipUI.tipRoot.width
                    if (this.tipUI.y + this.tipUI.tipRoot.height > maxHeight)
                        this.tipUI.y = maxHeight - this.tipUI.tipRoot.height
                }
            }
        }

        /**
         * 关闭所有提示
         */
        static colseTip() {
            if (this.tipUIId)
                GameUI.hide(this.tipUIId)
            this.tipUIId = 0
        }

        /**
         * 显示提示
         */
        static showTip: any

        /**
         * 移动提示
         */
        static moveTip: any

        /**
         * 初始化完成
         */
        static isInit: boolean = false

        /**
         * 初始化
         */
        static init(id: number) {
            if (this.isInit)
                return
            this.isInit = true
            GameUI.load(id)
            // 当鼠标右键时消除提示
            stage.on(EventObject.RIGHT_MOUSE_DOWN, this, this.colseTip)
        }

        /**
         * 注册鼠标悬浮弹出提示框界面事件
         * @param ui 需要注册的界面ui
         * @param tipId 需要显示的界面id
         * @param tipData 数据 如{"name":{text:"千叶不冷","age":{text:"18"}} 当显示提示框时会自动匹配到提示框界面中相同名字的组件并赋值
         * @param delayed [可选 默认为0] 延迟显示
         * @param expandList [可选 默认为false] 展开列表，当ui为列表时会对里面每个item赋予data.tip的值，即tipData = data.tip
         * 
         * @example
         * ```ts
         * OpenAPI.ShowTips.addTipEvent(ui, 1001, {"name":{text:"千叶不冷","age":{text:"18"}}}, 1000, false)
         * ```
         */
        static addTipEvent(ui: UIBase, tipId: number, tipData: any, delayed: number = 0, expandList: boolean = false) {
            this.init(tipId)
            const onItemCreate = (_ui: UIRoot, data: UIListItemData | any, index: number) => {
                this.addTipEvent(_ui, tipId, data['tip'], delayed, false)
            }
            const addTip = () => {
                ui.off(EventObject.MOUSE_MOVE, this, this.showTip)
                ui.off(EventObject.MOUSE_OUT, this, this.colseTip)
                ui.off(EventObject.MOUSE_MOVE, this, this.moveTip)
                this.showTip = () => {
                    if (this.tipUIId) {
                        GameUI.hide(this.tipUIId)
                        this.tipUIId = 0
                    }
                    this.onTipId = tipId
                    setTimeout(() => {
                        if (this.onTipId === tipId)
                            this.showTips(tipData, tipId)
                    }, delayed)
                }
                this.moveTip = () => {
                    if (this.tipUIId === tipId)
                        this.showTips(tipData, tipId)
                }
                // 当鼠标移入时显示
                ui.on(EventObject.MOUSE_OVER, this, this.showTip)
                ui.on(EventObject.MOUSE_MOVE, this, this.moveTip)
                // 当鼠标移出时消失
                ui.on(EventObject.MOUSE_OUT, this, this.colseTip)
            }
            // 判断是否展开列表
            if (ui instanceof UIList && expandList)
                ui.on(UIList.ITEM_CREATE, this, onItemCreate)

            else addTip()
        }
    }
}module OpenAPI {
    /**
     * 字符串操作工具
     */
    export class StringUtils {

        /**
         * 将字符串转换为蛇形命名法（snake_case）。
         *
         * 蛇形命名法是一种命名约定，其中每个单词都以小写字母书写，并用下划线（_）字符分隔。
         *
         * @param {string} str - 要转换为蛇形命名法的字符串。
         * @returns {string} - 转换后的蛇形命名法字符串。
         *
         * @example
         * ```ts
         * const convertedStr1 = snakeCase('camelCase') // 返回 'camel_case'
         * const convertedStr2 = snakeCase('some whitespace') // 返回 'some_whitespace'
         * const convertedStr3 = snakeCase('hyphen-text') // 返回 'hyphen_text'
         * const convertedStr4 = snakeCase('HTTPRequest') // 返回 'http_request'
         * ```
         */
        static snakeCase = (str: string): string => {
            const splitWords = str.match(OpenAPI.ConstantsUtils.CASE_SPLIT_PATTERN) || [];
            return splitWords.map(word => word.toLowerCase()).join('_');
        };

        /**
         * 随机字符串
         * 
         * @param {number} length - 字符串长度
         * @param {string} str - 随机的字符串
         * 
         * @example
         * ```ts
         * const randomStr = randomString(10) // 返回 'a1b2c3d4e5'
         * ```
         */
        static randomString = (length: number, str: string = OpenAPI.ConstantsUtils.RANDOM_STRING_RANGE): string => {
            return OpenAPI.Method.getRandomString(length, str);
        }

        /**
         * 随机颜色
         * 
         * @example
         * ```ts
         * const randomColor = randomColor() // 返回 '#ffffff'
         * ```
         */
        static get randomColor(): string {
            return OpenAPI.Method.getRandomColor();
        }

        /**
         * 解析文本内变量占位符数据, 可自定义获取数据的方法以及正则表达式
         * 
         * @param {string} text - 文本
         * @param {(((s: any) => number) | ((s: any) => string))[]} getData - 获取数据的方法
         * @param {RegExp[]} regex - 正则表达式
         * 
         * @example
         * ```ts
         * const text = '你好, 我是[@s1], 今年[@v1]岁'
         * return parseVariableText(text) // 返回 '你好, 我是黑白, 今年18岁'
         * ```
         */
        static parseVariableText = (text: string, getData: (((s: any) => number) | ((s: any) => string))[] | null = null, regex: RegExp[] | null = null): string => {
            return OpenAPI.Method.parseVarPlaceholderData(text, getData, regex);
        }

        /**
         * 解析文本内游戏变量占位符数据
         * 
         * @param {string} text - 文本
         * @param {any[]} gameData - 游戏数据
         * @param {RegExp[]} regex - 正则表达式
         * 
         * @example
         * ```ts
         * const text = '你好, 我是[@gs0], 今年[@gv1]岁'
         * // gameData 需要从编辑器中获取, 例如游戏变量组件
         * return parseGameVariableText(text, gameData) // 返回 '你好, 我是黑白, 今年18岁'
         * ```
         */
        static parseGameVariableText = (text: string, gameData: any[], regex: RegExp[] | null = null): string => {
            return OpenAPI.Method.parseGameVarPlaceholderData(text, gameData, regex);
        }

        /**
         * 解析文本内函数组合占位符数据
         * 
         * @param {string} text - 文本
         * @param {RegExp[]} regex - 正则表达式
         * 
         * @example
         * ```ts
         * const text = 'max(1,100)' // 获取最大值
         * return parseFunctionText(text) // 返回 '100'
         * const text = 'min(1,100)' // 获取最小值
         * return parseFunctionText(text) // 返回 '1'
         * const text = 'random(1,100)' // 获取随机数
         * return parseFunctionText(text) // 返回 '18.1234...' 不会取整
         * const text = 'reduce(50,100)' // 获取平均值
         * return parseFunctionText(text) // 返回 '75'
         * const text = 'abs(-18)' // 获取绝对值
         * return parseFunctionText(text) // 返回 '18'
         * const text = 'sqrt(18)' // 获取开方
         * return parseFunctionText(text) // 返回 '4.2426...' 不会取整
         * const text = 'round(1.1234)' // 获取整数
         * return parseFunctionText(text) // 返回 '1'
         * ```
         */
        static parseFunctionText = (text: string, regex: RegExp[] | null = null): string => {
            return OpenAPI.Method.parseCombinedFunctions(text, regex);
        }

        /**
         * 将阿拉伯数字转换为罗马数字的函数
         * 
         * @param {number} num - 阿拉伯数字
         * 
         * @example
         * ```ts
         * const romanNum = arabicToRoman(2024) // 返回 'MMXXIV'
         * ```
         */
        static arabicToRoman = (num: number): string => {
            return OpenAPI.Method.intToRoman(num);
        }
    }
}/**
 * 更多API插件
 * @author BlackWhite
 * @see https://www.gamecreator.com.cn/plug/det/641
 * @version 3.6
 */
module OpenAPI {

  /**
   * 插件的系统API
   */
  export class System {
    /**
     * 当前版本号
     */
    static Version = 3.7

    /**
     * 是否安装本插件
     */
    static Installed = true
  }

  // 输出
  setTimeout(() => {
    if (typeof Config !== 'undefined' && typeof OpenAPI !== 'undefined') {
      if (!Config.RELEASE_GAME)
        trace(`OpenAPI v${OpenAPI.System.Version.toFixed(1)} => OK`)
      else
        console.log(` %c OpenAPI v${OpenAPI.System.Version.toFixed(1)} %c https://www.gamecreator.com.cn/plug/det/641 `, 'color: #fadfa3; background: #333; padding:8px;border-left:1px solid #fadfa3;border-top:1px solid #fadfa3;border-bottom:1px solid #fadfa3;', 'color: #fadfa3; background: #333; padding:8px; border:1px solid #fadfa3;')
    }
  }, 1000)
};module OpenAPI {

  /**
   * 界面模块API
   * 
   * @deprecated 请使用OpenAPI.InterfaceUtils
   * @private
   */
  export class UI {
    /**
     * 界面列表组件数据初始化
     * @param {UIList} list 指定列表
     * @param {any} List_modelGUI 项模型数据,如：ListItem_1
     * @param {number} list_len 列表长度
     * @param {boolean} isFocus 【默认关闭】是否设置焦点
     * 
     * @deprecated 请使用OpenAPI.InterfaceUtils.initList
     */
    static listDataInit(list: UIList, List_modelGUI: any, list_len: number, isFocus = false): void {
      const arr = []
      for (let i = 1; i <= list_len; i++)
        arr.push(new List_modelGUI())

      list.items = arr
      if (isFocus)
        UIList.focus = list
    }
  }
}
