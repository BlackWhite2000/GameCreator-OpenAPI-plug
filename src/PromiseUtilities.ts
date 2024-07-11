module OpenAPI {
    /**
     * Promise 操作工具
     */
    export class PromiseUtilities {

        /**
         * 延迟执行指定毫秒数的代码。
         *
         * 此函数返回一个 Promise，在指定的延迟后解析，允许您与 async/await 结合使用以暂停执行。
         *
         * @param {number} ms - 要延迟的毫秒数。
         * @param {DelayOptions} options - 选项对象。
         * @param {AbortSignal} options.signal - 可选的 AbortSignal，用于取消延迟。
         * @returns {Promise<void>} 在指定延迟后解析的 Promise。
         *
         * @example
         * async function foo() {
         *   console.log('开始');
         *   await delay(1000); // 延迟执行1秒钟
         *   console.log('结束');
         * }
         *
         * foo();
         *
         * // 使用 AbortSignal
         * const controller = new AbortController();
         * const { signal } = controller;
         *
         * setTimeout(() => controller.abort(), 50); // 50毫秒后取消延迟
         * try {
         *   await delay(100, { signal });
         * } catch (error) {
         *   console.error(error); // 将会记录 'AbortError'
         * }
         * }
         */
        static delay(ms: number, { signal }: { signal?: AbortSignal } = {}): Promise<void> {
            return new Promise((resolve, reject) => {
                const abortError = () => {
                    reject(new OpenAPI.AbortError());
                };

                const abortHandler = () => {
                    clearTimeout(timeoutId);
                    abortError();
                };

                if (signal?.aborted) {
                    return abortError();
                }

                const timeoutId = setTimeout(resolve, ms);

                signal?.addEventListener('abort', abortHandler, { once: true });
            });
        }

    }
}