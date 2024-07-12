module OpenAPI {
    /**
     * 对象操作工具
     */
    export class ObjectUtils {

        /**
         * 反转对象的键和值。输入对象的键变为输出对象的值，而输入对象的值变为输出对象的键。
         *
         * 此函数接受一个对象，并通过反转其键和值创建一个新对象。如果输入对象具有重复的值，
         * 则在输出对象中，最后出现的键将作为新键的值。它有效地创建了输入对象键值对的反向映射。
         *
         * @template K - 输入对象中键的类型（字符串，数字，符号）
         * @template V - 输入对象中值的类型（字符串，数字，符号）
         * @param {Record<K, V>} obj - 要反转键和值的输入对象
         * @returns {{ [key in V]: K }} - 键和值被反转的新对象
         *
         * @example
         * invert({ a: 1, b: 2, c: 3 }); // { 1: 'a', 2: 'b', 3: 'c' }
         * invert({ 1: 'a', 2: 'b', 3: 'c' }); // { a: '1', b: '2', c: '3' }
         * invert({ a: 1, 2: 'b', c: 3, 4: 'd' }); // { 1: 'a', b: '2', 3: 'c', d: '4' }
         * invert({ a: Symbol('sym1'), b: Symbol('sym2') }); // { [Symbol('sym1')]: 'a', [Symbol('sym2')]: 'b' }
         */
        static invert<K extends PropertyKey, V extends PropertyKey>(obj: Record<K, V>): { [key in V]: K } {
            const result = {} as { [key in V]: K };

            for (const key in obj) {
                const value = obj[key as K] as V;
                result[value] = key;
            }

            return result;
        }

        /**
         * 创建一个省略指定键的新对象。
         *
         * 此函数接受一个对象和一个键数组，并返回一个新对象，该对象排除了与指定键对应的属性。
         *
         * @template T - 对象的类型。
         * @template K - 对象中的键的类型。
         * @param {T} obj - 要从中省略键的对象。
         * @param {K[]} keys - 要从对象中省略的键数组。
         * @returns {Omit<T, K>} - 省略了指定键的新对象。
         *
         * @example
         * const obj = { a: 1, b: 2, c: 3 };
         * const result = omit(obj, ['b', 'c']);
         * // result 将为 { a: 1 }
         */
        static omit<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
            const result = { ...obj };

            for (const key of keys) {
                delete result[key];
            }

            return result as Omit<T, K>;
        }

        /**
         * 创建一个由不满足条件函数的属性组成的新对象。
         *
         * 此函数接受一个对象和一个条件函数，并返回一个新对象，该对象只包含条件函数返回 `false` 的属性。
         *
         * @template T - 对象的类型。
         * @param {T} obj - 要从中省略属性的对象。
         * @param {(value: T[string], key: keyof T) => boolean} shouldOmit - 一个条件函数，用于确定是否应省略属性。
         * 它以属性的键和值作为参数，并返回 `true` 表示应省略该属性，返回 `false` 表示不应省略该属性。
         * @returns {Partial<T>} - 包含不满足条件函数的属性的新对象。
         *
         * @example
         * const obj = { a: 1, b: 'omit', c: 3 };
         * const shouldOmit = (key, value) => typeof value === 'string';
         * const result = omitBy(obj, shouldOmit);
         * // result 将为 { a: 1, c: 3 }
         */
        static omitBy<T extends Record<string, any>>(
            obj: T,
            shouldOmit: (value: T[keyof T], key: keyof T) => boolean
        ): Partial<T> {
            const result: Partial<T> = {};

            for (const [key, value] of Object.entries(obj)) {
                if (shouldOmit(value, key)) {
                    continue;
                }

                (result as any)[key] = value;
            }

            return result;
        }

        /**
         * 创建一个由选定对象属性组成的新对象。
         *
         * 此函数接受一个对象和一个键数组，并返回一个新对象，该对象只包含与指定键对应的属性。
         *
         * @template T - 对象的类型。
         * @template K - 对象中的键的类型。
         * @param {T} obj - 要从中选择键的对象。
         * @param {K[]} keys - 要从对象中选择的键数组。
         * @returns {Pick<T, K>} - 包含选定键的新对象。
         *
         * @example
         * const obj = { a: 1, b: 2, c: 3 };
         * const result = pick(obj, ['a', 'c']);
         * // result 将为 { a: 1, c: 3 }
         */
        static pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
            const result = {} as Pick<T, K>;

            for (const key of keys) {
                result[key] = obj[key];
            }

            return result;
        }

        /**
         * 创建一个由满足谓词函数的属性组成的新对象。
         *
         * 此函数接受一个对象和一个谓词函数，并返回一个新对象，该对象只包含谓词函数返回 true 的属性。
         *
         * @template T - 对象的类型。
         * @param {T} obj - 要从中选择属性的对象。
         * @param {(value: T[keyof T], key: keyof T) => boolean} shouldPick - 确定是否应选择属性的谓词函数。
         * 它以属性的键和值作为参数，并返回 `true` 如果应选择该属性，否则返回 `false`。
         * @returns {Partial<T>} - 包含满足谓词函数的属性的新对象。
         *
         * @example
         * const obj = { a: 1, b: 'pick', c: 3 };
         * const shouldPick = (value) => typeof value === 'string';
         * const result = pickBy(obj, shouldPick);
         * // result 将为 { b: 'pick' }
         */
        static pickBy<T extends Record<string, any>>(
            obj: T,
            shouldPick: (value: T[keyof T], key: keyof T) => boolean
        ): Partial<T> {
            const result: Partial<T> = {};

            for (const [key, value] of Object.entries(obj)) {
                if (!shouldPick(value, key)) {
                    continue;
                }

                (result as any)[key] = value;
            }

            return result;
        }
    }
}