module OpenAPI {
    /**
     * 路径工具
     */
    export class PathUtils {

        /**
         * 获取当前游戏根路径
         * 
         * PC版本与WEB版本返回的路径不同，通常WEB版本将携带路由以及标识符，PC版本则返回本地路径
         * 
         * @example
         * const gamePath = OpenAPI.RunUtils.gamePath // 返回当前游戏根路径
         */
        static get gamePath(): string | undefined {
            let path = '';
            if (OpenAPI.RunUtils.gameEnv == 2) {
                const random = OpenAPI.MathUtils.randomInt(1000, 100000);
                const tempIdentifier = `OpenAPITempGamePathIdentifier${random}`;
                //@ts-ignore
                path = SinglePlayerGame.toWebSaveFileURL(tempIdentifier).replace(tempIdentifier, '')
            } else {
                //@ts-ignore
                path = FileUtils.nativePath
            }
            return path;
        }

        /**
         * 根据当前游戏环境获取当前游戏根路径
         * 
         * 如果是PC版本则返回相对路径，实际是返回空。WEB版本则返回绝对路径
         * 
         * @example
         * const gamePathByEnv = OpenAPI.PathUtils.gamePathByEnv // 返回当前游戏根路径
         */
        static get gamePathByEnv(): string | undefined {
            if (OpenAPI.RunUtils.gameEnv == 2) {
                return PathUtils.gamePath;
            } else { 
                return ''
            }
        }
    }
}