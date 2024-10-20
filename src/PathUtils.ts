module OpenAPI {
    /**
     * 路径工具
     */
    export class PathUtils {
        
        /**
         * 获取当前游戏根路径
         * 
         * @example
         * const gamePath = OpenAPI.RunUtils.gamePath // 返回当前游戏根路径
         */
        static get gamePath(): string | undefined {
            let path = '';
            if (!Config.RELEASE_GAME) {
                const random = OpenAPI.MathUtils.randomInt(1000, 100000);
                const tempIdentifier = `OpenAPITempGamePathIdentifier${random}`;
                //@ts-ignore
                path = decodeURIComponent(Laya.URL.formatURL(tempIdentifier)).replace(`/${tempIdentifier}`, '');
            }
            else {
                //@ts-ignore
                path = FileUtils.nativePath;
            }
            return path;
        }
    }
}