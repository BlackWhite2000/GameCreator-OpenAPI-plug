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
}