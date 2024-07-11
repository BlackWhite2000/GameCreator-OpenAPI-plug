module OpenAPI {
    /**
     * 谓词操作工具
     */
    export class PredicateUtilities {

        /**
         * 检查给定值是否为 null 或 undefined。
         *
         * 此函数测试提供的值是否为 `null` 或 `undefined`。
         * 如果值为 `null` 或 `undefined`，则返回 `true`，否则返回 `false`。
         *
         * 在 TypeScript 中，此函数还可以作为类型谓词，将参数的类型缩小为 `null` 或 `undefined`。
         *
         * @param {unknown} x - 要测试是否为 null 或 undefined 的值。
         * @returns {boolean} - 如果值为 null 或 undefined，则返回 `true`，否则返回 `false`。
         *
         * @example
         * const value1 = null;
         * const value2 = undefined;
         * const value3 = 42;
         * const result1 = isNil(value1); // true
         * const result2 = isNil(value2); // true
         * const result3 = isNil(value3); // false
         */
        static isNil(x: unknown): x is null | undefined {
            return x === null || x === undefined;
        }

        /**
         * 检查给定值是否既不是 null 也不是 undefined。
         *
         * 此函数的主要用途是在 TypeScript 中作为类型谓词使用。
         *
         * @template T - 值的类型。
         * @param {T | null | undefined} x - 要测试是否不为 null 也不为 undefined 的值。
         * @returns {x is T} - 如果值不是 null 也不是 undefined，则返回 true；否则返回 false。
         *
         * @example
         * // 这里 `arr` 的类型是 (number | undefined)[]
         * const arr = [1, undefined, 3];
         * // 这里 `result` 的类型是 number[]
         * const result = arr.filter(isNotNil);
         * // result 将为 [1, 3]
         */
        static isNotNil<T>(x: T | null | undefined): x is T {
            return x !== null && x !== undefined;
        }

        /**
         * 检查给定值是否为 null。
         *
         * 此函数测试提供的值是否严格等于 `null`。
         * 如果值为 `null`，则返回 `true`；否则返回 `false`。
         *
         * 此函数还可以作为 TypeScript 中的类型谓词使用，将参数的类型缩小为 `null`。
         *
         * @param {unknown} x - 要测试是否为 null 的值。
         * @returns {x is null} - 如果值为 null，则返回 true；否则返回 false。
         *
         * @example
         * const value1 = null;
         * const value2 = undefined;
         * const value3 = 42;
         *
         * console.log(isNull(value1)); // true
         * console.log(isNull(value2)); // false
         * console.log(isNull(value3)); // false
         */
        static isNull(x: unknown): x is null {
            return x === null;
        }

        /**
         * 检查给定值是否为 undefined。
         *
         * 此函数测试提供的值是否严格等于 `undefined`。
         * 如果值为 `undefined`，则返回 `true`；否则返回 `false`。
         *
         * 此函数还可以作为 TypeScript 中的类型谓词使用，将参数的类型缩小为 `undefined`。
         *
         * @param {unknown} x - 要测试是否为 undefined 的值。
         * @returns {x is undefined} - 如果值为 undefined，则返回 true；否则返回 false。
         *
         * @example
         * const value1 = undefined;
         * const value2 = null;
         * const value3 = 42;
         *
         * console.log(isUndefined(value1)); // true
         * console.log(isUndefined(value2)); // false
         * console.log(isUndefined(value3)); // false
         */
        static isUndefined(x: unknown): x is undefined {
            return x === undefined;
        }
    }
}
