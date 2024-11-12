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
