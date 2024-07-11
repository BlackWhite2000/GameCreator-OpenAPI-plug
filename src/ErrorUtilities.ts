module OpenAPI {
    /**
     * 表示一个中止操作的错误类。
     * @augments Error
     */
    export class AbortError extends Error {
        constructor(message = 'The operation was aborted') {
            super(message);
            this.name = 'AbortError';
        }
    }
}