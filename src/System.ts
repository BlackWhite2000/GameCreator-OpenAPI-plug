/**
 * 更多API插件
 * @author BlackWhite
 * @see https://www.gamecreator.com.cn/plug/det/641
 * @version 3.4
 */
module OpenAPI {

  /**
   * 插件的系统API
   */
  export class System {
    /**
     * 当前版本号
     */
    static Version = 3.4

    /**
     * 是否安装本插件
     */
    static Installed = true
  }

  // 输出
  setTimeout(() => {
    if (typeof Config !== 'undefined' && typeof OpenAPI !== 'undefined') {
      if (!Config.RELEASE_GAME)
        trace(`OpenAPI v${OpenAPI.System.Version.toFixed(1)} => OK`)

      else
        console.log(` %c OpenAPI v${OpenAPI.System.Version.toFixed(1)} %c https://www.gamecreator.com.cn/plug/det/641 `, 'color: #fadfa3; background: #333; padding:8px;border-left:1px solid #fadfa3;border-top:1px solid #fadfa3;border-bottom:1px solid #fadfa3;', 'color: #fadfa3; background: #333; padding:8px; border:1px solid #fadfa3;')
    }
  }, 1000)
};

/**
 * OpenAPI 部分函数来自 es-toolkit
 * @see https://github.com/toss/es-toolkit
 * @version 1.9.0
 *
  MIT License

  Copyright (c) 2024 Viva Republica, Inc

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
 */

