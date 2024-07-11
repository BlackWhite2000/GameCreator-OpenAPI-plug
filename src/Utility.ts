module OpenAPI {
    type NotFalsey<T> = Exclude<T, false | null | 0 | '' | undefined>;
    
    /**
     * 数组操作
     */
    export class Utility {

        /**
        * 将数组拆分成指定长度的小数组。
        *
        * 此函数接收一个输入数组并将其划分为多个小数组，每个小数组的长度由指定的大小决定。
        * 如果输入数组不能被均匀分割，最后一个小数组将包含剩余的元素。
        *
        * @template T 数组中元素的类型。
        * @param {T[]} arr - 要拆分的小数组的数组。
        * @param {number} size - 每个小数组的大小。必须是正整数。
        * @returns {T[][]} 一个二维数组，其中每个子数组的最大长度为 `size`。
        * @throws {Error} 如果 `size` 不是正整数，则抛出错误。
        *
        * @example
        * // 将一个数字数组拆分成长度为 2 的子数组
        * chunk([1, 2, 3, 4, 5], 2);
        * // 返回: [[1, 2], [3, 4], [5]]
        *
        * @example
        * // 将一个字符串数组拆分成长度为 3 的子数组
        * chunk(['a', 'b', 'c', 'd', 'e', 'f', 'g'], 3);
        * // 返回: [['a', 'b', 'c'], ['d', 'e', 'f'], ['g']]
        */
        static chunk<T>(arr: readonly T[], size: number): T[][] {
            if (!Number.isInteger(size) || size <= 0) {
                throw new Error('Size must be an integer greater than zero.');
            }

            const chunkLength = Math.ceil(arr.length / size);
            const result: T[][] = Array(chunkLength);

            for (let index = 0; index < chunkLength; index++) {
                const start = index * size;
                const end = start + size;

                result[index] = arr.slice(start, end);
            }

            return result;
        }

        /**
         * 从数组中移除假值 (false, null, 0, '', undefined, NaN)。
         *
         * @template T - 数组中元素的类型。
         * @param {readonly T[]} arr - 要移除假值的输入数组。
         * @returns {Array<Exclude<T, false | null | 0 | '' | undefined>>} - 一个新数组，其中所有假值都被移除。
         *
         * @example
         * Utility.compact([0, 1, false, 2, '', 3, null, undefined, 4, NaN, 5]);
         * // 返回: [1, 2, 3, 4, 5]
         */
        static compact<T>(arr: readonly T[]): Array<NotFalsey<T>> {
            const result: Array<NotFalsey<T>> = [];

            for (const item of arr) {
                if (item) {
                    result.push(item as NotFalsey<T>);
                }
            }

            return result;
        }

        /**
         * 从右到左遍历 'arr' 的元素，并为每个元素调用 'callback'。
         * 
         * @template T - 数组中元素的类型。
         * @param {T[]} arr - 要遍历的数组。
         * @param {(value: T, index: number, arr: T[]) => void} callback - 每次迭代调用的函数。
         * callback 函数接收三个参数：
         *  - 'value': 数组中当前处理的元素。
         *  - 'index': 数组中当前处理的元素的索引。
         *  - 'arr': 调用 'forEachRight' 的数组。
         * 
         * @example
         * const array = [1, 2, 3];
         * const result: number[] = [];
         * 
         * // 使用 forEachRight 函数遍历数组并将每个元素添加到 result 数组中。
         * forEachRight(array, (value) => {
         *  result.push(value);
         * })
         * 
         * console.log(result) // 输出: [3, 2, 1]
         */
        static forEachRight<T>(arr: T[], callback: (value: T, index: number, arr: T[]) => void): void {
            for (let i = arr.length - 1; i >= 0; i--) {
                const element = arr[i];
                callback(element, i, arr);
            }
        }

        /**
         * 从数组末尾移除指定数量的元素并返回剩余部分。
         *
         * 此函数接受一个数组和一个数字，并返回一个新的数组，
         * 该数组的末尾移除了指定数量的元素。
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} arr - 要删除元素的数组。
         * @param {number} itemsCount - 要从数组末尾删除的元素数量。
         * @returns {T[]} 一个从末尾移除指定数量元素的新数组。
         *
         * @example
         * const array = [1, 2, 3, 4, 5];
         * const result = dropRight(array, 2);
         * // 结果将是 [1, 2, 3] 因为最后两个元素被删除。
         */
        static dropRight<T>(arr: readonly T[], itemsCount: number): T[] {
            return arr.slice(0, -itemsCount);
        }

        /**
         * 打乱数组
         *
         * 此函数接收一个数组，并返回一个新的顺序被打乱的数组。原数组不会被修改。
         * 它使用了Fisher-Yates算法来确保每个元素有均等的机会出现在任意位置。
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} array - 需要打乱的数组。
         * @returns {T[]} 返回一个新的打乱顺序的数组。
         *
         * @example
         * const array = [1, 2, 3, 4, 5];
         * const shuffled = Utility.shuffle(array);
         * // shuffled 可能是 [3, 5, 1, 2, 4] 或其他任意顺序的排列。
         *
         * console.log(array); // 输出: [1, 2, 3, 4, 5] (原数组未被修改)
         * console.log(shuffled); // 输出: [3, 5, 1, 2, 4] (顺序被打乱的新数组)
         */
        static shuffle<T>(array: T[]): T[] {
            const shuffledArray = array.slice();
            for (let i = shuffledArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
            }
            return shuffledArray;
        }

        /**
         * 从数组开头移除元素直到谓词返回false。
         *
         * 此函数遍历数组并从开始位置删除元素，直到提供的谓词函数返回false。
         * 然后返回一个包含剩余元素的新数组。
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} arr - 要删除元素的数组。
         * @param {(item: T) => boolean} canContinueDropping - 一个决定是否继续删除元素的谓词函数。
         * 该函数接收每个元素并在返回true时继续删除元素。
         * @returns {T[]} 一个在谓词返回false后剩余元素的新数组。
         *
         * @example
         * const array = [1, 2, 3, 4, 5];
         * const result = dropWhile(array, x => x < 3);
         * // 结果将是 [3, 4, 5] 因为小于3的元素被删除。
         */
        static dropWhile<T>(arr: readonly T[], canContinueDropping: (item: T) => boolean): T[] {
            const dropEndIndex = arr.findIndex(item => !canContinueDropping(item));
            if (dropEndIndex === -1) {
                return [];
            }

            return arr.slice(dropEndIndex);
        }

        /**
         * 从数组末尾移除元素直到谓词返回false。
         *
         * 此函数从数组末尾开始遍历并删除元素，直到提供的谓词函数返回false。
         * 然后返回一个包含剩余元素的新数组。
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} arr - 要删除元素的数组。
         * @param {(item: T) => boolean} canContinueDropping - 一个决定是否继续删除元素的谓词函数。
         * 该函数从末尾开始接收每个元素并在返回true时继续删除元素。
         * @returns {T[]} 一个在谓词返回false后剩余元素的新数组。
         *
         * @example
         * const array = [1, 2, 3, 4, 5];
         * const result = dropRightWhile(array, x => x > 3);
         * // 结果将是 [1, 2, 3] 因为大于3的元素从末尾被删除。
         */
        static dropRightWhile<T>(arr: readonly T[], canContinueDropping: (item: T) => boolean): T[] {
            const reversed = arr.slice().reverse();
            const dropped = this.dropWhile(reversed, canContinueDropping);
            return dropped.slice().reverse();
        }


    }
}
