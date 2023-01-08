/**
 * 更多API插件
 * @author BlackWhite
 * @see https://www.gamecreator.com.cn/plug/det/641
 * @version 1.0
 */
module OpenAPI {

    /**
     * 插件的系统API
     */
    export class System {

        /**
         * 当前版本号
         */
        static Version = 1.0;

        /**
         * 是否安装本插件
         */
        static Installed = true;

    }

    // 输出
    if (typeof Config !== 'undefined' && typeof OpenAPI !== 'undefined') {
        if (!Config.RELEASE_GAME) {
          trace(`OpenAPI v${OpenAPI.System.Version.toFixed(1)} => OK`)
        } else {
          console.log(` %c OpenAPI v${OpenAPI.System.Version.toFixed(1)} %c https://www.gamecreator.com.cn/plug/det/641 `, "color: #fadfa3; background: #333; padding:8px;", "color: #111; background: #fadfa3; padding:8px;");
        }
      }

};
