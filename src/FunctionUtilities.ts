module OpenAPI {
    /**
     * 函数操作工具
     */
    export class FunctionUtilities {

        /**
         * 创建一个防抖函数，延迟调用提供的函数，直到上次调用后已经过去了 `debounceMs` 毫秒。
         * 防抖函数还具有一个 `cancel` 方法，用于取消任何待执行的函数调用。
         *
         * @template F - 函数的类型。
         * @param {F} func - 要防抖的函数。
         * @param {number} debounceMs - 延迟的毫秒数。
         * @param {DebounceOptions} options - 选项对象。
         * @param {AbortSignal} options.signal - 可选的 AbortSignal，用于取消防抖函数的执行。
         * @returns {F & { cancel: () => void }} - 一个具有 `cancel` 方法的新防抖函数。
         *
         * @example
         * const debouncedFunction = debounce(() => {
         *   console.log('Function executed');
         * }, 1000);
         *
         * // 如果在1秒内未再次调用，则会记录 'Function executed'
         * debouncedFunction();
         *
         * // 不会记录任何内容，因为之前的调用被取消了
         * debouncedFunction.cancel();
         *
         * // 使用 AbortSignal
         * const controller = new AbortController();
         * const signal = controller.signal;
         * const debouncedWithSignal = debounce(() => {
         *  console.log('Function executed');
         * }, 1000, { signal });
         *
         * debouncedWithSignal();
         *
         * // 将取消防抖函数的调用
         * controller.abort();
         */
        static debounce<F extends (...args: any[]) => void>(
            func: F,
            debounceMs: number,
            { signal }: { signal?: AbortSignal } = {}
        ): F & { cancel: () => void } {
            let timeoutId: number | null = null;

            const debounced = function (...args: Parameters<F>) {
                if (timeoutId !== null) {
                    clearTimeout(timeoutId);
                }

                if (signal?.aborted) {
                    return;
                }

                timeoutId = setTimeout(() => {
                    func(...args);
                    timeoutId = null;
                }, debounceMs) as any;
            } as F & { cancel: () => void };

            const onAbort = function () {
                debounced.cancel();
            };

            debounced.cancel = function () {
                if (timeoutId !== null) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
            };

            signal?.addEventListener('abort', onAbort, { once: true });

            return debounced;
        }

        /**
         * 一个什么也不做的空操作函数。
         * 可以用作占位符或默认函数。
         *
         * @example
         * noop(); // 什么也不做
         *
         * @returns {void} 此函数不返回任何内容。
         */
        static noop(): void { }

        /**
         * 创建一个仅允许调用提供的函数 `func` 一次的函数。
         * 对该函数的重复调用将返回第一次调用的返回值。
         *
         * @template F - 函数的类型。
         * @param {F} func - 要限制的函数。
         * @returns {F} 一个新函数，调用 `func` 一次并缓存结果。
         *
         * @example
         * const initialize = once(() => {
         *   console.log('Initialized!');
         *   return true;
         * });
         *
         * initialize(); // 输出：'Initialized!' 并返回 true
         * initialize(); // 返回 true，但不输出日志
         */
        static once<F extends () => any>(func: F): F {
            let called = false;
            let cache: ReturnType<F> | undefined;

            return function () {
                if (called) {
                    return cache;
                }

                const result = func();

                called = true;
                cache = result;

                return result;
            } as F;
        }

        /**
         * 创建一个节流函数，每隔 `throttleMs` 毫秒最多调用一次提供的函数。
         * 在等待时间内对节流函数的连续调用将不会触发原始函数的执行。
         *
         * @template F - 函数的类型。
         * @param {F} func - 要节流的函数。
         * @param {number} throttleMs - 以毫秒为单位的节流执行间隔。
         * @returns {F} 一个新的节流函数，接受与原始函数相同的参数。
         *
         * @example
         * const throttledFunction = throttle(() => {
         *   console.log('Function executed');
         * }, 1000);
         *
         * // 立即输出：'Function executed'
         * throttledFunction();
         *
         * // 在节流时间内，不会输出任何内容
         * throttledFunction();
         *
         * // 1 秒后
         * setTimeout(() => {
         *   throttledFunction(); // 输出：'Function executed'
         * }, 1000);
         */
        static throttle<F extends (...args: any[]) => void>(func: F, throttleMs: number): F {
            let lastCallTime: number | null;

            const throttledFunction = function (...args: Parameters<F>) {
                const now = Date.now();

                if (lastCallTime == null || now - lastCallTime >= throttleMs) {
                    lastCallTime = now;
                    func(...args);
                }
            } as F;

            return throttledFunction;
        }
    }
}