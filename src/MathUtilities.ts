module OpenAPI {
    /**
     * 数学操作
     */
    export class MathUtilities {

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
         * const result1 = clamp(10, 5); // result1 将会是 5，因为 10 被限制在边界 5 上
         * const result2 = clamp(10, 5, 15); // result2 将会是 10，因为它在边界 5 和 15 内
         * const result3 = clamp(2, 5, 15); // result3 将会是 5，因为 2 被限制在边界 5 下
         * const result4 = clamp(20, 5, 15); // result4 将会是 15，因为 20 被限制在边界 15 上
         */
        static clamp(value: number, maximum: number): number;
        static clamp(value: number, minimum: number, maximum: number): number;
        static clamp(value: number, bound1: number, bound2?: number): number {
            if (bound2 == null) {
                return Math.min(value, bound1);
            }

            return Math.min(Math.max(value, bound1), bound2);
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
         * const result1 = inRange(3, 5); // result1 将返回 true。
         * const result2 = inRange(1, 2, 5); // result2 将返回 false。
         * const result3 = inRange(1, 5, 2); // 如果最小值大于或等于最大值，将抛出错误。
         */
        static inRange(value: number, maximum: number): boolean;
        static inRange(value: number, minimum: number, maximum: number): boolean;
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
         * const numbers = [1, 2, 3, 4, 5];
         * const result = mean(numbers);
         * // result 将为 3
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
         * meanBy([{ a: 1 }, { a: 2 }, { a: 3 }], x => x.a); // 返回: 2
         * meanBy([], x => x.a); // 返回: NaN
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
         * const result1 = random(0, 5); // 返回介于 0 和 5 之间的随机数。
         * const result2 = random(5, 0); // 如果最小值大于最大值，则抛出错误。
         * const result3 = random(5, 5); // 如果最小值等于最大值，则抛出错误。
         */
        static random(maximum: number): number;
        static random(minimum: number, maximum: number): number;
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
         * const result = randomInt(0, 5); // result 将是介于 0（包含）和 5（不包含）之间的随机整数
         * const result2 = randomInt(5, 0); // 这将抛出错误
         */
        static randomInt(maximum: number): number;
        static randomInt(minimum: number, maximum: number): number;
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
         * // 返回 [0, 1, 2, 3]
         * range(4);
         *
         * @example
         * // 返回 [0, 5, 10, 15]
         * range(0, 20, 5);
         *
         * @example
         * // 返回 [0, -1, -2, -3]
         * range(0, -4, -1);
         *
         * @example
         * // 抛出错误: 步长值必须是非零整数。
         * range(1, 4, 0);
         */
        static range(end: number): number[];
        static range(start: number, end: number): number[];
        static range(start: number, end: number, step: number): number[];
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
         * const result1 = round(1.2345); // result1 将是 1
         * const result2 = round(1.2345, 2); // result2 将是 1.23
         * const result3 = round(1.2345, 3); // result3 将是 1.235
         * const result4 = round(1.2345, 3.1); // 这将抛出一个错误
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
         * const numbers = [1, 2, 3, 4, 5];
         * const result = sum(numbers);
         * // result 将为 15
         */
        static sum(nums: readonly number[]): number {
            let result = 0;

            for (const num of nums) {
                result += num;
            }

            return result;
        }
    }
}