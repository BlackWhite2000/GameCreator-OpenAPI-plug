module OpenAPI {
    type NotFalsey<T> = Exclude<T, false | null | 0 | '' | undefined>;
    type Order = 'asc' | 'desc';
    type Unzip<K extends unknown[]> = { [I in keyof K]: Array<K[I]> };

    /**
     * 数组操作工具
     */
    export class ArrayUtilities {

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
         * compact([0, 1, false, 2, '', 3, null, undefined, 4, NaN, 5]);
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
         * 根据转换函数计算数组中每个项的出现次数。
         *
         * 此函数接收一个数组和一个转换函数，将数组中的每个项转换为字符串键，
         * 然后统计每个转换后项的出现次数，并返回一个包含转换后项作为键和计数作为值的对象。
         *
         * @template T - 输入数组中项的类型。
         *
         * @param {T[]} arr - 要计算出现次数的输入数组。
         * @param {(item: T) => string} mapper - 将每个项映射到字符串键的转换函数。
         * @returns {Record<string, number>} 包含转换后项作为键和计数作为值的对象。
         *
         * @example
         * const array = [1, 2, 2, 3, 3, 3];
         * const counts = countBy(array, String);
         * // 返回: { '1': 1, '2': 2, '3': 3 }
         */
        static countBy<T>(arr: T[], mapper: (item: T) => string): Record<string, number> {
            const result: Record<string, number> = {};

            for (const item of arr) {
                const key = mapper(item);

                result[key] = (result[key] ?? 0) + 1;
            }

            return result;
        }

        /**
         * 计算两个数组之间的差异。
         *
         * 此函数接收两个数组并返回一个新数组，其中包含仅出现在第一个数组中而不在第二个数组中的元素。
         * 它有效地过滤掉第一个数组中在第二个数组中也出现的任何元素。
         *
         * @template T
         * @param {T[]} firstArr - 要计算差异的数组。这是主要数组，将从中比较和过滤元素。
         * @param {T[]} secondArr - 包含要从第一个数组中排除的元素的数组。
         * 每个数组中的元素将与第一个数组进行比较，如果找到匹配，则该元素将从结果中排除。
         * @returns {T[]} 一个新数组，其中包含仅出现在第一个数组中而不在第二个数组中的元素。
         *
         * @example
         * const array1 = [1, 2, 3, 4, 5];
         * const array2 = [2, 4];
         * const result = difference(array1, array2);
         * // result 将是 [1, 3, 5]，因为2和4在两个数组中都存在，所以被排除在结果之外。
         */
        static difference<T>(firstArr: readonly T[], secondArr: readonly T[]): T[] {
            const secondSet = new Set(secondArr);

            return firstArr.filter(item => !secondSet.has(item));
        }

        /**
         * 根据提供的映射函数计算两个数组之间的差异。
         *
         * 此函数接收两个数组和一个映射函数。它返回一个新数组，其中包含仅出现在第一个数组中而不在第二个数组中的元素，
         * 这是基于映射函数计算的身份来决定的。
         *
         * 实质上，它过滤掉第一个数组中在第二个数组经过映射后有对应的元素。
         *
         * @template T, U
         * @param {T[]} firstArr - 主要数组，用于计算差异。
         * @param {T[]} secondArr - 包含要从第一个数组中排除的元素的数组。
         * @param {(value: T) => U} mapper - 用于映射两个数组元素的函数。该函数应用于每个数组中的每个元素，
         * 并基于映射后的值进行比较。
         * @returns {T[]} 一个新数组，其中包含仅出现在第一个数组中而不在第二个数组中对应映射身份的元素。
         *
         * @example
         * const array1 = [{ id: 1 }, { id: 2 }, { id: 3 }];
         * const array2 = [{ id: 2 }, { id: 4 }];
         * const mapper = item => item.id;
         * const result = differenceBy(array1, array2, mapper);
         * // result 将是 [{ id: 1 }, { id: 3 }]，因为具有 id 为 2 的元素在两个数组中都存在，因此被排除在结果之外。
         */
        static differenceBy<T, U>(firstArr: readonly T[], secondArr: readonly T[], mapper: (value: T) => U): T[] {
            const mappedSecondSet = new Set(secondArr.map(item => mapper(item)));

            return firstArr.filter(item => {
                return !mappedSecondSet.has(mapper(item));
            });
        }

        /**
         * 根据自定义相等性函数计算两个数组之间的差异。
         *
         * 此函数接收两个数组和一个自定义比较函数。它返回一个新数组，其中包含仅出现在第一个数组中而不在第二个数组中的元素。
         * 判断元素是否相等是使用提供的自定义函数进行比较的。
         *
         * @template T
         * @param {T[]} firstArr - 要计算差异的数组。
         * @param {T[]} secondArr - 包含要从第一个数组中排除的元素的数组。
         * @param {(x: T, y: T) => boolean} areItemsEqual - 用于判断两个项是否相等的函数。
         * @returns {T[]} 一个新数组，其中包含仅出现在第一个数组中而不在第二个数组中的元素，
         * 根据提供的自定义相等性函数判断。
         *
         * @example
         * const array1 = [{ id: 1 }, { id: 2 }, { id: 3 }];
         * const array2 = [{ id: 2 }, { id: 4 }];
         * const areItemsEqual = (a, b) => a.id === b.id;
         * const result = differenceWith(array1, array2, areItemsEqual);
         * // result 将是 [{ id: 1 }, { id: 3 }]，因为具有 id 为 2 的元素被视为相等，因此被排除在结果之外。
         */
        static differenceWith<T>(
            firstArr: readonly T[],
            secondArr: readonly T[],
            areItemsEqual: (x: T, y: T) => boolean
        ): T[] {
            return firstArr.filter(firstItem => {
                return secondArr.every(secondItem => {
                    return !areItemsEqual(firstItem, secondItem);
                });
            });
        }

        /**
         * 从数组的开头移除指定数量的元素并返回剩余部分。
         *
         * 此函数接收一个数组和一个数字，并返回一个新数组，其中从开头移除了指定数量的元素。
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} arr - 要从中移除元素的数组。
         * @param {number} itemsCount - 要从数组开头移除的元素数量。
         * @returns {T[]} 一个新数组，其中从开头移除了指定数量的元素。
         *
         * @example
         * const array = [1, 2, 3, 4, 5];
         * const result = drop(array, 2);
         * // result 将是 [3, 4, 5]，因为前两个元素被移除了。
         */
        static drop<T>(arr: readonly T[], itemsCount: number): T[] {
            return arr.slice(itemsCount);
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
         * 填充数组的指定位置范围内的元素为指定值，但不包括结束位置。
         *
         * 此函数会改变原始数组，并用提供的值替换从指定的起始索引到结束索引（不包括结束索引）的元素。
         * 如果未提供起始或结束索引，则默认填充整个数组。可以使用负索引来指定从数组末尾开始的位置。
         *
         * @param {Array<T | P>} arr - 要填充的数组。
         * @param {P} value - 要填充数组的值。
         * @param {number} [start=0] - 起始位置，默认为 0。
         * @param {number} [end=arr.length] - 结束位置，默认为数组的长度。
         * @returns {Array<T | P>} 填充后的数组。
         *
         * @example
         * const array = [1, 2, 3];
         * const result = fill(array, 'a');
         * // => ['a', 'a', 'a']
         *
         * const result = fill(Array(3), 2);
         * // => [2, 2, 2]
         *
         * const result = fill([4, 6, 8, 10], '*', 1, 3);
         * // => [4, '*', '*', 10]
         */
        static fill<T>(arr: unknown[], value: T): T[];
        static fill<T, P>(arr: Array<T | P>, value: P, start: number): Array<T | P>;
        static fill<T, P>(arr: Array<T | P>, value: P, start: number, end: number): Array<T | P>;
        static fill<T, P>(arr: Array<T | P>, value: P, start = 0, end = arr.length): Array<T | P> {
            start = Math.max(start, 0);
            end = Math.min(end, arr.length);

            for (let i = start; i < end; i++) {
                arr[i] = value;
            }

            return arr;
        }

        /**
         * 将数组展开至指定深度。
         *
         * @template T - 数组中元素的类型。
         * @template D - 指定数组展开的深度。
         * @param {T[]} arr - 要展开的数组。
         * @param {D} depth - 指定的展开深度级别，表示嵌套数组结构应展开多深。默认为 1。
         * @returns {Array<FlatArray<T[], D>>} 展开后的新数组。
         *
         * @example
         * const arr = flatten([1, [2, 3], [4, [5, 6]]], 1);
         * // 返回: [1, 2, 3, 4, [5, 6]]
         *
         * const arr = flatten([1, [2, 3], [4, [5, 6]]], 2);
         * // 返回: [1, 2, 3, 4, 5, 6]
         */
        static flatten<T, D extends number = 1>(arr: readonly T[], depth: D = 1 as D): Array<FlatArray<T[], D>> {
            const result: Array<FlatArray<T[], D>> = [];
            const flooredDepth = Math.floor(depth);

            const recursive = (arr: readonly T[], currentDepth: number) => {
                for (const item of arr) {
                    if (Array.isArray(item) && currentDepth < flooredDepth) {
                        recursive(item, currentDepth + 1);
                    } else {
                        result.push(item as FlatArray<T[], D>);
                    }
                }
            };

            recursive(arr, 0);
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
         * 根据提供的键生成函数，对数组元素进行分组。
         *
         * 该函数接受一个数组和一个从每个元素生成键的函数。它返回一个对象，其中键是生成的键，值是具有相同键的元素数组。
         *
         * @template T - 数组中元素的类型。
         * @template K - 键的类型。
         * @param {T[]} arr - 要分组的数组。
         * @param {(item: T) => K} getKeyFromItem - 从元素生成键的函数。
         * @returns {Record<K, T[]>} 一个对象，其中每个键关联一个具有相同键的元素数组。
         *
         * @example
         * const array = [
         *   { category: 'fruit', name: 'apple' },
         *   { category: 'fruit', name: 'banana' },
         *   { category: 'vegetable', name: 'carrot' }
         * ];
         * const result = groupBy(array, item => item.category);
         * // result 将会是:
         * // {
         * //   fruit: [
         * //     { category: 'fruit', name: 'apple' },
         * //     { category: 'fruit', name: 'banana' }
         * //   ],
         * //   vegetable: [
         * //     { category: 'vegetable', name: 'carrot' }
         * //   ]
         * // }
         */
        static groupBy<T, K extends PropertyKey>(arr: readonly T[], getKeyFromItem: (item: T) => K): Record<K, T[]> {
            const result = {} as Record<K, T[]>;

            for (const item of arr) {
                const key = getKeyFromItem(item);

                if (result[key] == null) {
                    result[key] = [];
                }

                result[key].push(item);
            }

            return result;
        }

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
         * const arr = [1, 2, 3];
         * const firstElement = head(arr);
         * // firstElement 将会是 1
         *
         * const emptyArr: number[] = [];
         * const noElement = head(emptyArr);
         * // noElement 将会是 undefined
         */
        static head<T>(arr: readonly [T, ...T[]]): T;
        static head<T>(arr: readonly T[]): T | undefined;
        static head<T>(arr: readonly T[]): T | undefined {
            return arr[0];
        }

        /**
         * 返回两个数组的交集。
         *
         * 该函数接受两个数组并返回一个新数组，其中包含同时存在于两个数组中的元素。
         * 它有效地过滤掉第一个数组中在第二个数组中找不到的元素。
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} firstArr - 要比较的第一个数组。
         * @param {T[]} secondArr - 要比较的第二个数组。
         * @returns {T[]} 一个新数组，包含同时存在于两个数组中的元素。
         *
         * @example
         * const array1 = [1, 2, 3, 4, 5];
         * const array2 = [3, 4, 5, 6, 7];
         * const result = intersection(array1, array2);
         * // result 将会是 [3, 4, 5]，因为这些元素同时存在于两个数组中。
         */
        static intersection<T>(firstArr: readonly T[], secondArr: readonly T[]): T[] {
            const secondSet = new Set(secondArr);

            return firstArr.filter(item => {
                return secondSet.has(item);
            });
        }

        /**
         * 根据映射函数返回两个数组的交集。
         *
         * 该函数接受两个数组和一个映射函数。它返回一个新数组，其中包含来自第一个数组的元素，
         * 当使用提供的映射函数映射时，在第二个数组中具有匹配的映射元素。它有效地过滤掉第一个数组中
         * 没有对应映射值的元素。
         *
         * @template T - 数组中元素的类型。
         * @template U - 映射后的元素类型。
         * @param {T[]} firstArr - 要比较的第一个数组。
         * @param {T[]} secondArr - 要比较的第二个数组。
         * @param {(item: T) => U} mapper - 用于映射两个数组元素进行比较的函数。
         * @returns {T[]} 一个新数组，包含来自第一个数组的元素，在第二个数组中具有对应映射值的元素。
         *
         * @example
         * const array1 = [{ id: 1 }, { id: 2 }, { id: 3 }];
         * const array2 = [{ id: 2 }, { id: 4 }];
         * const mapper = item => item.id;
         * const result = intersectionBy(array1, array2, mapper);
         * // result 将会是 [{ id: 2 }]，因为只有这个元素在两个数组中具有匹配的 id。
         */
        static intersectionBy<T, U>(firstArr: readonly T[], secondArr: readonly T[], mapper: (item: T) => U): T[] {
            const mappedSecondSet = new Set(secondArr.map(mapper));
            return firstArr.filter(item => mappedSecondSet.has(mapper(item)));
        }

        /**
         * 根据自定义相等函数返回两个数组的交集。
         *
         * 该函数接受两个数组和一个自定义相等函数。它返回一个新数组，其中包含来自第一个数组的元素，
         * 这些元素在第二个数组中有匹配的元素，由自定义相等函数确定。它有效地过滤掉第一个数组中没有
         * 对应匹配的第二个数组元素的元素。
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} firstArr - 要比较的第一个数组。
         * @param {T[]} secondArr - 要比较的第二个数组。
         * @param {(x: T, y: T) => boolean} areItemsEqual - 一个自定义函数，用于确定两个元素是否相等。
         * 此函数接受两个参数，分别来自每个数组，如果元素被认为相等，则返回 `true`，否则返回 `false`。
         * @returns {T[]} 一个新数组，包含来自第一个数组的元素，这些元素在第二个数组中有相应匹配的元素，根据自定义相等函数确定。
         *
         * @example
         * const array1 = [{ id: 1 }, { id: 2 }, { id: 3 }];
         * const array2 = [{ id: 2 }, { id: 4 }];
         * const areItemsEqual = (a, b) => a.id === b.id;
         * const result = intersectionWith(array1, array2, areItemsEqual);
         * // result 将会是 [{ id: 2 }]，因为这个元素在两个数组中具有匹配的 id。
         */
        static intersectionWith<T>(
            firstArr: readonly T[],
            secondArr: readonly T[],
            areItemsEqual: (x: T, y: T) => boolean
        ): T[] {
            return firstArr.filter(firstItem => {
                return secondArr.some(secondItem => {
                    return areItemsEqual(firstItem, secondItem);
                });
            });
        }

        /**
         * 根据提供的键生成函数，将数组中的每个元素映射为一个对象。
         *
         * 该函数接受一个数组和一个生成键的函数。它返回一个对象，其中键是根据生成函数生成的键，而值是相应的元素。
         * 如果有多个元素生成相同的键，则使用它们中的最后一个元素作为值。
         *
         * @template T - 数组中元素的类型。
         * @template K - 键的类型。
         * @param {T[]} arr - 要映射的元素数组。
         * @param {(item: T) => K} getKeyFromItem - 从元素生成键的函数。
         * @returns {Record<K, T>} 一个对象，其中键映射到数组中的每个元素。
         *
         * @example
         * const array = [
         *   { category: 'fruit', name: 'apple' },
         *   { category: 'fruit', name: 'banana' },
         *   { category: 'vegetable', name: 'carrot' }
         * ];
         * const result = keyBy(array, item => item.category);
         * // result 将会是:
         * // {
         * //   fruit: { category: 'banana', name: 'apple' },
         * //   vegetable: { category: 'carrot', name: 'vegetable' }
         * // }
         */
        static keyBy<T, K extends PropertyKey>(arr: readonly T[], getKeyFromItem: (item: T) => K): Record<K, T> {
            const result = {} as Record<K, T>;

            for (const item of arr) {
                const key = getKeyFromItem(item);
                result[key] = item;
            }

            return result;
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
         * const arr = [1, 2, 3];
         * const lastElement = last(arr);
         * // lastElement 将为 3
         *
         * const emptyArr: number[] = [];
         * const noElement = last(emptyArr);
         * // noElement 将为 undefined
         */
        static last<T>(arr: readonly [...T[], T]): T;
        static last<T>(arr: readonly T[]): T | undefined;
        static last<T>(arr: readonly T[]): T | undefined {
            return arr[arr.length - 1];
        }

        /**
         * 找到数组中在应用 getValue 函数到每个元素后具有最大值的元素。
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} items 要搜索的元素数组。
         * @param {(element: T) => number} getValue 从每个元素中选择一个数值的函数。
         * @returns {T} 根据 getValue 函数确定的具有最大值的元素。
         * @example
         * maxBy([{ a: 1 }, { a: 2 }, { a: 3 }], x => x.a); // 返回: { a: 3 }
         * maxBy([], x => x.a); // 返回: undefined
         */
        static maxBy<T>(items: T[], getValue: (element: T) => number): T {
            let maxElement = items[0];
            let max = -Infinity;

            for (const element of items) {
                const value = getValue(element);
                if (value > max) {
                    max = value;
                    maxElement = element;
                }
            }

            return maxElement;
        }

        /**
         * 找到数组中在应用 `getValue` 函数到每个元素后具有最小值的元素。
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} items 要搜索的元素数组。
         * @param {(element: T) => number} getValue 从每个元素中选择一个数值的函数。
         * @returns {T} 根据 `getValue` 函数确定的具有最小值的元素。
         * @example
         * minBy([{ a: 1 }, { a: 2 }, { a: 3 }], x => x.a); // 返回: { a: 1 }
         * minBy([], x => x.a); // 返回: undefined
         */
        static minBy<T>(items: T[], getValue: (element: T) => number): T {
            let minElement = items[0];
            let min = Infinity;

            for (const element of items) {
                const value = getValue(element);
                if (value < min) {
                    min = value;
                    minElement = element;
                }
            }

            return minElement;
        }

        /**
         * 根据多个属性和对应的排序方向对对象数组进行排序。
         *
         * 此函数接受一个对象数组、一个要排序的键（属性）数组以及一个排序方向数组。
         * 它返回排序后的数组，根据每个键及其对应的方向（'asc' 表示升序，'desc' 表示降序）进行排序。
         * 如果某个键的值相等，则按照下一个键继续确定顺序。
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} collection - 要排序的对象数组。
         * @param {Array<keyof T>} keys - 要排序的键（属性）数组。
         * @param {Order[]} orders - 排序方向数组（'asc' 表示升序，'desc' 表示降序）。
         * @returns {T[]} - 排序后的数组。
         *
         * @example
         * // 按 'user' 升序和 'age' 降序对对象数组进行排序。
         * const users = [
         *   { user: 'fred', age: 48 },
         *   { user: 'barney', age: 34 },
         *   { user: 'fred', age: 40 },
         *   { user: 'barney', age: 36 },
         * ];
         * const result = orderBy(users, ['user', 'age'], ['asc', 'desc']);
         * // result 将会是:
         * // [
         * //   { user: 'barney', age: 36 },
         * //   { user: 'barney', age: 34 },
         * //   { user: 'fred', age: 48 },
         * //   { user: 'fred', age: 40 },
         * // ]
         */
        static orderBy<T>(collection: T[], keys: Array<keyof T>, orders: Order[]): T[] {
            const compareValues = (a: T[keyof T], b: T[keyof T], order: Order) => {
                if (a < b) {
                    return order === 'asc' ? -1 : 1;
                }
                if (a > b) {
                    return order === 'asc' ? 1 : -1;
                }
                return 0;
            };

            const effectiveOrders = keys.map((_, index) => orders[index] || orders[orders.length - 1]);

            return collection.slice().sort((a, b) => {
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    const order = effectiveOrders[i];
                    const result = compareValues(a[key], b[key], order);
                    if (result !== 0) {
                        return result;
                    }
                }
                return 0;
            });
        }

        /**
         * 根据断言函数将数组分割成两组。
         *
         * 此函数接受一个数组和一个断言函数。它返回一个包含两个数组的元组：
         * 第一个数组包含断言函数返回 true 的元素，第二个数组包含断言函数返回 false 的元素。
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} arr - 要分割的数组。
         * @param {(value: T) => boolean} isInTruthy - 一个断言函数，确定一个元素是否应放入真值数组中。
         * 函数将对数组中的每个元素调用。
         * @returns {[T[], T[]]} 包含两个数组的元组：第一个数组包含断言函数返回 true 的元素，
         * 第二个数组包含断言函数返回 false 的元素。
         *
         * @example
         * const array = [1, 2, 3, 4, 5];
         * const isEven = x => x % 2 === 0;
         * const [even, odd] = partition(array, isEven);
         * // even 将为 [2, 4]，odd 将为 [1, 3, 5]
         */
        static partition<T>(arr: readonly T[], isInTruthy: (value: T) => boolean): [truthy: T[], falsy: T[]] {
            const truthy: T[] = [];
            const falsy: T[] = [];

            for (const item of arr) {
                if (isInTruthy(item)) {
                    truthy.push(item);
                } else {
                    falsy.push(item);
                }
            }

            return [truthy, falsy];
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
         * const array = [1, 2, 3, 4, 5];
         * const randomElement = sample(array);
         * // randomElement 将是数组中随机选择的一个元素。
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
         * const result = sampleSize([1, 2, 3], 2)
         * // result 将是包含两个来自数组的元素的数组。
         * // [1, 2] 或 [1, 3] 或 [2, 3]
         */
        static sampleSize<T>(array: readonly T[], size: number): T[] {
            if (size > array.length) {
                throw new Error('Size must be less than or equal to the length of array.');
            }

            const result = new Array(size);
            const selected = new Set();

            for (let step = array.length - size, resultIndex = 0; step < array.length; step++, resultIndex++) {
                let index = OpenAPI.MathUtilities.randomInt(0, step + 1);

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
         * const array = [1, 2, 3, 4, 5];
         * const shuffledArray = shuffle(array);
         * // shuffledArray 将是一个新数组，其中 array 的元素以随机顺序洗牌，例如 [3, 1, 4, 5, 2]
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
         * 当输入为单元素数组时返回空数组。
         *
         * @param {readonly [T]} arr - 要处理的单元素数组。
         * @returns {[]} 一个空数组。
         *
         * @example
         * const arr = [1];
         * const result = tail(arr);
         * // result 将是 []
         */
        static tail<T>(arr: readonly [T]): [];

        /**
         * 当输入为空数组时返回空数组。
         *
         * @param {readonly []} arr - 要处理的空数组。
         * @returns {[]} 一个空数组。
         *
         * @example
         * const arr = [];
         * const result = tail(arr);
         * // result 将是 []
         */
        static tail(arr: readonly []): [];

        /**
         * 当输入为元组数组时，返回一个新数组，其中包含除第一个元素之外的所有元素。
         *
         * @param {readonly [T, ...U[]]} arr - 要处理的元组数组。
         * @returns {U[]} 包含输入数组中除第一个元素之外所有元素的新数组。
         *
         * @example
         * const arr = [1, 2, 3];
         * const result = tail(arr);
         * // result 将是 [2, 3]
         */
        static tail<T, U>(arr: readonly [T, ...U[]]): U[];

        /**
         * 返回一个新数组，其中包含除第一个元素之外的所有元素。
         *
         * 此函数接受一个数组并返回一个新数组，其中包含除第一个元素之外的所有元素。
         * 如果输入数组为空或只有一个元素，则返回一个空数组。
         *
         * @param {readonly T[]} arr - 要获取尾部的数组。
         * @returns {T[]} 包含输入数组中除第一个元素之外所有元素的新数组。
         *
         * @example
         * const arr1 = [1, 2, 3];
         * const result = tail(arr1);
         * // result 将是 [2, 3]
         *
         * const arr2 = [1];
         * const result2 = tail(arr2);
         * // result2 将是 []
         *
         * const arr3 = [];
         * const result3 = tail(arr3);
         * // result3 将是 []
         */
        static tail<T>(arr: readonly T[]): T[] {
            const len = arr.length;
            if (len <= 1) {
                return [];
            }
            const result = new Array(len - 1);
            for (let i = 1; i < len; i++) {
                result[i - 1] = arr[i];
            }
            return result;
        }

        /**
         * 返回一个新数组，其中包含输入数组 `arr` 的前 `count` 个元素。
         * 如果 `count` 大于 `arr` 的长度，则返回整个数组。
         *
         * @template T - 输入数组中元素的类型。
         *
         * @param {T[]} arr - 要获取元素的数组。
         * @param {number} count - 要获取的元素数量。
         * @returns {T[]} 包含输入数组 `arr` 的前 `count` 个元素的新数组。
         *
         * @example
         * // 返回 [1, 2, 3]
         * take([1, 2, 3, 4, 5], 3);
         *
         * @example
         * // 返回 ['a', 'b']
         * take(['a', 'b', 'c'], 2);
         *
         * @example
         * // 返回 [1, 2, 3]
         * take([1, 2, 3], 5);
         */
        static take<T>(arr: readonly T[], count: number): T[] {
            return arr.slice(0, count);
        }

        /**
         * 返回一个新数组，其中包含输入数组 `arr` 的后 `count` 个元素。
         * 如果 `count` 大于 `arr` 的长度，则返回整个数组。
         *
         * @template T - 数组中元素的类型。
         *
         * @param {T[]} arr - 要获取元素的数组。
         * @param {number} count - 要获取的元素数量。
         * @returns {T[]} 包含输入数组 `arr` 的后 `count` 个元素的新数组。
         *
         * @example
         * // 返回 [4, 5]
         * takeRight([1, 2, 3, 4, 5], 2);
         *
         * @example
         * // 返回 ['b', 'c']
         * takeRight(['a', 'b', 'c'], 2);
         *
         * @example
         * // 返回 [1, 2, 3]
         * takeRight([1, 2, 3], 5);
         */
        static takeRight<T>(arr: readonly T[], count: number): T[] {
            if (count === 0) {
                return [];
            }

            return arr.slice(-count);
        }

        /**
         * 从数组末尾开始获取元素，直到断言函数返回 `false`。
         *
         * @template T - 输入数组中元素的类型。
         *
         * @param {T[]} arr - 要获取元素的数组。
         * @param {function(T): boolean} shouldContinueTaking - 每个元素调用的断言函数。
         * @returns {T[]} 包含从末尾获取的元素的新数组，直到断言函数返回 `false`。
         *
         * @example
         * // 返回 [3, 2, 1]
         * takeRightWhile([5, 4, 3, 2, 1], n => n < 4);
         *
         * @example
         * // 返回 []
         * takeRightWhile([1, 2, 3], n => n > 3);
         */
        static takeRightWhile<T>(arr: readonly T[], shouldContinueTaking: (item: T) => boolean): T[] {
            for (let i = arr.length - 1; i >= 0; i--) {
                if (!shouldContinueTaking(arr[i])) {
                    return arr.slice(i + 1);
                }
            }

            return arr.slice();
        }

        /**
         * 返回一个新数组，包含满足提供的断言函数的输入数组的前导元素。
         * 当断言函数返回 false 时，停止取元素。
         *
         * @template T - 数组中的元素类型。
         * @param {T[]} arr - 要处理的数组。
         * @param {(element: T) => boolean} shouldContinueTaking - 每个元素调用的断言函数。只要该函数返回 true，就会将元素包括在结果中。
         * @returns {T[]} 包含满足断言的前导元素的新数组。
         *
         * @example
         * // 返回 [1, 2]
         * takeWhile([1, 2, 3, 4], x => x < 3);
         *
         * @example
         * // 返回 []
         * takeWhile([1, 2, 3, 4], x => x > 3);
         */
        static takeWhile<T>(arr: readonly T[], shouldContinueTaking: (element: T) => boolean): T[] {
            const result: T[] = [];

            for (const item of arr) {
                if (!shouldContinueTaking(item)) {
                    break;
                }

                result.push(item);
            }

            return result;
        }

        /**
         * 从所有给定数组中创建一个唯一值数组。
         *
         * 此函数接受两个数组，合并它们为一个数组，并返回一个新数组，该数组仅包含合并后的数组中的唯一值。
         *
         * @template T - 数组中的元素类型。
         * @param {T[]} arr1 - 要合并和过滤唯一值的第一个数组。
         * @param {T[]} arr2 - 要合并和过滤唯一值的第二个数组。
         * @returns {T[]} 包含唯一值的新数组。
         *
         * @example
         * const array1 = [1, 2, 3];
         * const array2 = [3, 4, 5];
         * const result = union(array1, array2);
         * // result 将是 [1, 2, 3, 4, 5]
         */
        static union<T>(arr1: readonly T[], arr2: readonly T[]): T[] {
            return this.uniq(arr1.concat(arr2));
        }

        /**
         * 使用提供的映射函数确定相等性，从所有给定数组中创建一个按顺序排列的唯一值数组。
         *
         * @template T - 数组中的元素类型。
         * @template U - 映射后的元素类型。
         * @param {T[]} arr1 - 第一个数组。
         * @param {T[]} arr2 - 第二个数组。
         * @param {(item: T) => U} mapper - 映射数组元素到比较值的函数。
         * @returns {T[]} 包含来自 `arr1` 和 `arr2` 的唯一元素并按照映射值确定顺序的新数组。
         *
         * @example
         * // 用于数字的自定义映射函数（取模比较）
         * const moduloMapper = (x) => x % 3;
         * unionBy([1, 2, 3], [4, 5, 6], moduloMapper);
         * // 返回 [1, 2, 3]
         *
         * @example
         * // 用于带有 'id' 属性的对象的自定义映射函数
         * const idMapper = (obj) => obj.id;
         * unionBy([{ id: 1 }, { id: 2 }], [{ id: 2 }, { id: 3 }], idMapper);
         * // 返回 [{ id: 1 }, { id: 2 }, { id: 3 }]
         */
        static unionBy<T, U>(arr1: readonly T[], arr2: readonly T[], mapper: (item: T) => U): T[] {
            const map = new Map<U, T>();

            for (const item of [...arr1, ...arr2]) {
                const key = mapper(item);

                if (!map.has(key)) {
                    map.set(key, item);
                }
            }

            return Array.from(map.values());
        }

        /**
         * 基于自定义相等性函数，从两个给定数组中创建一个唯一值数组。
         *
         * 此函数接受两个数组和一个自定义相等性函数，合并数组，并返回一个新数组，
         * 该数组仅包含根据自定义相等性函数确定的唯一值。
         *
         * @template T - 数组中的元素类型。
         * @param {T[]} arr1 - 第一个数组，用于合并和过滤唯一值。
         * @param {T[]} arr2 - 第二个数组，用于合并和过滤唯一值。
         * @param {(item1: T, item2: T) => boolean} areItemsEqual - 用于确定两个元素是否相等的自定义函数。
         * 它接受两个参数，如果元素被视为相等，则返回 `true`，否则返回 `false`。
         * @returns {T[]} 基于自定义相等性函数的唯一值数组。
         *
         * @example
         * const array1 = [{ id: 1 }, { id: 2 }];
         * const array2 = [{ id: 2 }, { id: 3 }];
         * const areItemsEqual = (a, b) => a.id === b.id;
         * const result = unionWith(array1, array2, areItemsEqual);
         * // result 将为 [{ id: 1 }, { id: 2 }, { id: 3 }]，因为 { id: 2 } 在两个数组中被认为是相等的
         */
        static unionWith<T>(
            arr1: readonly T[],
            arr2: readonly T[],
            areItemsEqual: (item1: T, item2: T) => boolean
        ): T[] {
            return this.uniqWith(arr1.concat(arr2), areItemsEqual);
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
         * const array = [1, 2, 2, 3, 4, 4, 5];
         * const result = uniq(array);
         * // result 将为 [1, 2, 3, 4, 5]
         */
        static uniq<T>(arr: readonly T[]): T[] {
            return Array.from(new Set(arr));
        }

        /**
         * 根据映射函数返回的值，返回一个仅包含原始数组中唯一元素的新数组。
         *
         * @template T - 数组中的元素类型。
         * @template U - 映射后的元素类型。
         * @param {T[]} arr - 要处理的数组。
         * @param {(item: T) => U} mapper - 用于转换数组元素的函数。
         * @returns {T[]} 返回一个新数组，仅包含原始数组中根据映射函数返回值唯一的元素。
         *
         * @example
         * ```ts
         * uniqBy([1.2, 1.5, 2.1, 3.2, 5.7, 5.3, 7.19], Math.floor);
         * // [1.2, 2.1, 3.3, 5.7, 7.19]
         * ```
         */
        static uniqBy<T, U>(arr: readonly T[], mapper: (item: T) => U): T[] {
            const map = new Map<U, T>();

            for (const item of arr) {
                const key = mapper(item);

                if (!map.has(key)) {
                    map.set(key, item);
                }
            }

            return Array.from(map.values());
        }

        /**
         * 根据比较函数返回的值，返回一个仅包含原始数组中唯一元素的新数组。
         *
         * @template T - 数组中的元素类型。
         * @param {T[]} arr - 要处理的数组。
         * @param {(item1: T, item2: T) => boolean} areItemsEqual - 用于比较数组元素的函数。
         * @returns {T[]} 返回一个新数组，仅包含原始数组中根据比较函数返回值唯一的元素。
         *
         * @example
         * ```ts
         * uniqWith([1.2, 1.5, 2.1, 3.2, 5.7, 5.3, 7.19], (a, b) => Math.abs(a - b) < 1);
         * // [1.2, 3.2, 5.7, 7.19]
         * ```
         */
        static uniqWith<T>(arr: readonly T[], areItemsEqual: (item1: T, item2: T) => boolean): T[] {
            const result: T[] = [];

            for (const item of arr) {
                const isUniq = result.every(v => !areItemsEqual(v, item));

                if (isUniq) {
                    result.push(item);
                }
            }

            return result;
        }

        /**
         * 将分组数组中相同位置的元素收集到一个新数组中并返回。
         *
         * @param zipped - 要解压的嵌套数组。
         * @returns 返回一个新的解压后的元素数组。
         *
         * @example
         * const zipped = [['a', true, 1],['b', false, 2]];
         * const result = unzip(zipped);
         * // result 将是 [['a', 'b'], [true, false], [1, 2]]
         */
        static unzip<T extends unknown[]>(zipped: Array<[...T]>): Unzip<T> {
            // 由于性能原因，使用这个实现代替 const maxLen = Math.max(...zipped.map(arr => arr.length));
            let maxLen = 0;

            for (let i = 0; i < zipped.length; i++) {
                if (zipped[i].length > maxLen) {
                    maxLen = zipped[i].length;
                }
            }

            const result = new Array(maxLen) as Unzip<T>;

            for (let i = 0; i < maxLen; i++) {
                result[i] = new Array(zipped.length);
                for (let j = 0; j < zipped.length; j++) {
                    result[i][j] = zipped[j][i];
                }
            }

            return result;
        }

        /**
         * 解压数组的数组，并应用一个迭代函数来重新分组元素。
         *
         * @template T, R
         * @param {T[][]} target - 要解压的嵌套数组。这是一个数组的数组，
         * 每个内部数组包含要解压的元素。
         * @param {(...args: T[]) => R} iteratee - 用于转换解压元素的函数。
         * @returns {R[]} 包含解压和转换后的元素的新数组。
         *
         * @example
         * const nestedArray = [[1, 2], [3, 4], [5, 6]];
         * const result = unzipWith(nestedArray, (item, item2, item3) => item + item2 + item3);
         * // result 将是 [9, 12]
         */
        static unzipWith<T, R>(target: readonly T[][], iteratee: (...args: T[]) => R): R[] {
            const maxLength = Math.max(...target.map(innerArray => innerArray.length));
            const result: R[] = new Array(maxLength);

            for (let i = 0; i < maxLength; i++) {
                const group = new Array(target.length);

                for (let j = 0; j < target.length; j++) {
                    group[j] = target[j][i];
                }

                result[i] = iteratee(...group);
            }

            return result;
        }

        /**
         * 创建一个排除所有指定值的数组。
         *
         * 它使用 [SameValueZero](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-samevaluezero) 正确排除 `NaN`。
         *
         * @template T 数组中元素的类型。
         * @param {T[]} array - 要过滤的数组。
         * @param {...T[]} values - 要排除的值。
         * @returns {T[]} 不包含指定值的新数组。
         *
         * @example
         * // 从数组中移除指定的值
         * without([1, 2, 3, 4, 5], 2, 4);
         * // 返回: [1, 3, 5]
         *
         * @example
         * // 从数组中移除指定的字符串值
         * without(['a', 'b', 'c', 'a'], 'a');
         * // 返回: ['b', 'c']
         */
        static without<T>(array: readonly T[], ...values: T[]): T[] {
            const valuesSet = new Set(values);
            return array.filter(item => !valuesSet.has(item));
        }

        /**
         * 计算两个数组之间的对称差异。对称差异是两个数组中存在的元素集合，
         * 即存在于其中一个数组中，但不在它们的交集中。
         *
         * @template T - 数组中元素的类型。
         * @param {T[]} arr1 - 第一个数组。
         * @param {T[]} arr2 - 第二个数组。
         * @returns {T[]} 包含存在于 `arr1` 或 `arr2` 中但不在两者交集中的元素的数组。
         *
         * @example
         * // 返回 [1, 2, 5, 6]
         * xor([1, 2, 3, 4], [3, 4, 5, 6]);
         *
         * @example
         * // 返回 ['a', 'c']
         * xor(['a', 'b'], ['b', 'c']);
         */
        static xor<T>(arr1: readonly T[], arr2: readonly T[]): T[] {
            return this.difference(this.union(arr1, arr2), this.intersection(arr1, arr2));
        }

        /**
         * 使用自定义映射函数计算两个数组之间的对称差异。
         * 对称差异是两个数组中存在的元素集合，即存在于其中一个数组中，但不在它们的交集中，
         * 根据映射函数返回的值确定。
         *
         * @template T - 输入数组中元素的类型。
         * @template U - 映射函数返回的值的类型。
         *
         * @param {T[]} arr1 - 第一个数组。
         * @param {T[]} arr2 - 第二个数组。
         * @param {(item: T) => U} mapper - 将数组元素映射到比较值的函数。
         * @returns {T[]} 包含存在于 `arr1` 或 `arr2` 中但不在两者交集中的元素的数组，
         * 基于映射函数返回的值。
         *
         * @example
         * // 对象数组的自定义映射函数
         * const idMapper = obj => obj.id;
         * xorBy([{ id: 1 }, { id: 2 }], [{ id: 2 }, { id: 3 }], idMapper);
         * // 返回 [{ id: 1 }, { id: 3 }]
         */
        static xorBy<T, U>(arr1: readonly T[], arr2: readonly T[], mapper: (item: T) => U): T[] {
            const union = this.unionBy(arr1, arr2, mapper);
            const intersection = this.intersectionBy(arr1, arr2, mapper);

            return this.differenceBy(union, intersection, mapper);
        }
        /**
         * 使用自定义相等函数计算两个数组之间的对称差异。
         * 对称差异是两个数组中存在的元素集合，即存在于其中一个数组中，但不在它们的交集中，
         * 根据自定义相等函数确定。
         *
         * @template T - 输入数组中元素的类型。
         *
         * @param {T[]} arr1 - 第一个数组。
         * @param {T[]} arr2 - 第二个数组。
         * @param {(item1: T, item2: T) => boolean} areElementsEqual - 用于比较元素的自定义相等函数。
         * @returns {T[]} 包含存在于 `arr1` 或 `arr2` 中但不在两者交集中的元素的数组，
         * 基于自定义相等函数。
         *
         * @example
         * // 对象数组的自定义相等函数，比较 'id' 属性
         * const areObjectsEqual = (a, b) => a.id === b.id;
         * xorWith([{ id: 1 }, { id: 2 }], [{ id: 2 }, { id: 3 }], areObjectsEqual);
         * // 返回 [{ id: 1 }, { id: 3 }]
         */
        static xorWith<T>(
            arr1: readonly T[],
            arr2: readonly T[],
            areElementsEqual: (item1: T, item2: T) => boolean
        ): T[] {
            const union = this.unionWith(arr1, arr2, areElementsEqual);
            const intersection = this.intersectionWith(arr1, arr2, areElementsEqual);

            return this.differenceWith(union, intersection, areElementsEqual);
        }

        /**
         * 将多个数组组合成一个元组数组。
         *
         * 此函数接受多个数组并返回一个新数组，其中每个元素都是一个元组，包含来自输入数组的相应元素。
         * 如果输入数组的长度不同，则结果数组将具有最长输入数组的长度，缺少元素的位置将使用 undefined 值填充。
         *
         * @param {...T[][]} arrs - 要合并的数组。
         * @returns {T[][]} 包含来自输入数组的相应元素的元组数组。
         *
         * @example
         * const arr1 = [1, 2, 3];
         * const arr2 = ['a', 'b', 'c'];
         * const result = zip(arr1, arr2);
         * // result 将会是 [[1, 'a'], [2, 'b'], [3, 'c']]
         *
         * const arr3 = [true, false];
         * const result2 = zip(arr1, arr2, arr3);
         * // result2 将会是 [[1, 'a', true], [2, 'b', false], [3, 'c', undefined]]
         */
        static zip<T>(arr1: readonly T[]): Array<[T]>;
        static zip<T, U>(arr1: readonly T[], arr2: readonly U[]): Array<[T, U]>;
        static zip<T, U, V>(arr1: readonly T[], arr2: readonly U[], arr3: readonly V[]): Array<[T, U, V]>;
        static zip<T, U, V, W>(
            arr1: readonly T[],
            arr2: readonly U[],
            arr3: readonly V[],
            arr4: readonly W[]
        ): Array<[T, U, V, W]>;
        static zip<T>(...arrs: Array<readonly T[]>): T[][] {
            const result: T[][] = [];

            const maxIndex = Math.max(...arrs.map(x => x.length));

            for (let i = 0; i < maxIndex; i++) {
                const element: T[] = [];

                for (const arr of arrs) {
                    element.push(arr[i]);
                }

                result.push(element);
            }

            return result;
        }

        /**
         * 将两个数组（一个包含属性名，另一个包含对应的值）组合成一个对象。
         *
         * 此函数接受两个数组：一个包含属性名，另一个包含对应的值。
         * 它返回一个新对象，其中第一个数组中的属性名作为键，第二个数组中对应的元素作为值。
         * 如果 `keys` 数组的长度大于 `values` 数组的长度，剩余的键将会使用 `undefined` 作为它们的值。
         *
         * @template P - 数组元素的类型。
         * @template V - 数组元素的类型。
         * @param {P[]} keys - 属性名数组。
         * @param {V[]} values - 与属性名对应的值数组。
         * @returns {{ [K in P]: V }} 组合后的对象，包含给定的属性名和对应的值。
         *
         * @example
         * const keys = ['a', 'b', 'c'];
         * const values = [1, 2, 3];
         * const result = zipObject(keys, values);
         * // result 将会是 { a: 1, b: 2, c: 3 }
         *
         * const keys2 = ['a', 'b', 'c'];
         * const values2 = [1, 2];
         * const result2 = zipObject(keys2, values2);
         * // result2 将会是 { a: 1, b: 2, c: undefined }
         *
         * const keys2 = ['a', 'b'];
         * const values2 = [1, 2, 3];
         * const result2 = zipObject(keys2, values2);
         * // result2 将会是 { a: 1, b: 2 }
         */
        static zipObject<P extends string | number | symbol, V>(keys: P[], values: V[]): { [K in P]: V } {
            const result = {} as { [K in P]: V };

            for (let i = 0; i < keys.length; i++) {
                result[keys[i]] = values[i];
            }

            return result;
        }


        /**
         * 使用自定义组合函数将多个数组组合成单个数组。
         *
         * 此函数接受多个数组和一个组合函数，并返回一个新数组，其中每个元素
         * 是将组合函数应用于输入数组的对应元素的结果。
         *
         * @param {T[]} arr1 - 第一个要组合的数组。
         * @param {U[]} [arr2] - 第二个要组合的数组（可选）。
         * @param {V[]} [arr3] - 第三个要组合的数组（可选）。
         * @param {W[]} [arr4] - 第四个要组合的数组（可选）。
         * @param {(...items: T[]) => R} combine - 接受对应元素并返回单个值的组合函数。
         * @returns {R[]} 一个新数组，其中每个元素是将组合函数应用于输入数组的对应元素的结果。
         *
         * @example
         * // 使用两个数组的示例：
         * const arr1 = [1, 2, 3];
         * const arr2 = [4, 5, 6];
         * const result = zipWith(arr1, arr2, (a, b) => a + b);
         * // result 将会是 [5, 7, 9]
         *
         * @example
         * // 使用三个数组的示例：
         * const arr1 = [1, 2];
         * const arr2 = [3, 4];
         * const arr3 = [5, 6];
         * const result = zipWith(arr1, arr2, arr3, (a, b, c) => `${a}${b}${c}`);
         * // result 将会是 [`135`, `246`]
         */
        static zipWith<T, R>(arr1: readonly T[], combine: (item: T) => R): R[];
        static zipWith<T, U, R>(arr1: readonly T[], arr2: readonly U[], combine: (item1: T, item2: U) => R): R[];
        static zipWith<T, U, V, R>(
            arr1: readonly T[],
            arr2: readonly U[],
            arr3: readonly V[],
            combine: (item1: T, item2: U, item3: V) => R
        ): R[];
        static zipWith<T, U, V, W, R>(
            arr1: readonly T[],
            arr2: readonly U[],
            arr3: readonly V[],
            arr4: readonly W[],
            combine: (item1: T, item2: U, item3: V, item4: W) => R
        ): R[];
        static zipWith<T, R>(arr1: readonly T[], ...rest: any[]): R[] {
            const arrs = [arr1, ...rest.slice(0, -1)];
            const combine = rest[rest.length - 1] as (...items: T[]) => R;

            const result: R[] = [];
            const maxIndex = Math.max(...arrs.map(arr => arr.length));

            for (let i = 0; i < maxIndex; i++) {
                const elements: T[] = arrs.map(arr => arr[i]);
                result.push(combine(...elements));
            }

            return result;
        }

    }
}
