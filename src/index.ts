import * as array from './array/chunk';

module OpenAPI {
    export class test {
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
            return array.chunk(arr, size)
        }
    }
}