module OpenAPI {

    /**
     * 运行时工具
     */
    export class RunUtils {

        /**
         * 获取默认引入的库
         * 
         * @param {string} name - 库名
         * 
         * @example
         * const fs = OpenAPI.RunUtils.require('fs') // 返回引入的库
         */
        static require(name: string): any | undefined {
            // @ts-ignore
            return mainDomain_require(name);
        }

        /**
         * fs库
         * 
         * @example
         * const fs = OpenAPI.RunUtils.fs // 返回引入的fs库
         */
        static get fs(): any | undefined {
            return OpenAPI.RunUtils.require('fs');
        }

        /**
         * path库
         * 
         * @example
         * const path = OpenAPI.RunUtils.path // 返回引入的path库
         */
        static get path(): any | undefined {
            return OpenAPI.RunUtils.require('path');
        }

        /**
         * os库
         * 
         * @example
         * const os = OpenAPI.RunUtils.os // 返回引入的os库
         */
        static get os(): any | undefined {
            return OpenAPI.RunUtils.require('os');
        }

        /**
         * process库
         */
        static get process(): any | undefined {
            return OpenAPI.RunUtils.require('process');
        }

        /**
         * child_process库
         * 
         * @example
         * const child_process = OpenAPI.RunUtils.child_process // 返回引入的child_process库
         */
        static get child_process(): any | undefined {
            return OpenAPI.RunUtils.require('child_process');
        }

        /**
         * nw.gui库
         * 
         * @example
         * const nw_gui = OpenAPI.RunUtils.nw_gui // 返回引入的nw.gui库
         */
        static get nw_gui(): any | undefined {
            return OpenAPI.RunUtils.require('nw.gui');
        }
    }
}
