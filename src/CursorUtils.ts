module OpenAPI {

    /**
     * 光标工具
     */
    export class CursorUtils {

        /**
         * 光标系统样式名称
         * 
         * @example
         * ```ts
         * const cursorStyle = OpenAPI.CursorUtils.cursorSystemStyleName // 返回 ['default', 'auto', 'pointer', 'text', 'wait', 'help', 'crosshair', 'move', 'n-resize', 's-resize', 'w-resize', 'e-resize', 'nw-resize', 'sw-resize', 'ne-resize', 'se-resize']
         * ```
         */
        static get cursorSystemStyleName(): ['default', 'auto', 'pointer', 'text', 'wait', 'help', 'crosshair', 'move', 'n-resize', 's-resize', 'w-resize', 'e-resize', 'nw-resize', 'sw-resize', 'ne-resize', 'se-resize'] {
            return OpenAPI.Method.cursorSystemStyleName as any;
        }
    }
}
