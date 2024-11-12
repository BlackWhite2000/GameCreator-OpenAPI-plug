module OpenAPI {

  /**
   * GameCreator相关API
   */
  export class GC {
    /**
     * GC平台相关API
     */
    static Cloud = {

      /**
       * 是否是GC平台
       * 
       * @returns {boolean} 如果是GC平台则返回 `true`，否则返回 `false`。
       * 
       * @example
       * ```ts
       * if (OpenAPI.GC.Cloud.isInGCCloud) {
       *  console.log('当前是GC平台')
       * }
       * ```
       */
      get isInGCCloud(): boolean {
        return window.location.href.includes('gamecreator')
      },

      /**
       * 游戏ID
       * 
       * @returns {number} 返回游戏ID。
       * 
       * @example
       * ```ts
       * const gameID = OpenAPI.GC.Cloud.GameID
       * ```
       */
      get GameID(): number {
        if (!OpenAPI.GC.Cloud.isInGCCloud)
          return 0
        const releaseProject = window.location.href.split('releaseProject/').pop()
        if (!releaseProject)
          return 0
        const split = releaseProject.split('/')
        const shift = split.shift()
        if (!shift)
          return 0
        const p = shift.split('_')
        return Number.parseInt(p[1])
      },

      /**
       * 游戏名称
       * 
       * @returns {string} 返回游戏名称。
       * 
       * @example
       * ```ts
       * const gameName = OpenAPI.GC.Cloud.GameName
       * ```
       */
      get GameName(): string {
        if (!OpenAPI.GC.Cloud.isInGCCloud)
          return ''
        const title = document.querySelector('title')
        if (!title)
          return ''
        const name = title.innerText
        const keywords = document.querySelector('meta[name="keywords"]')
        if (!keywords)
          return ''
        let p = keywords.getAttribute('content')
        const remove = `${name} | `
        if (p && p.startsWith(remove)) {
          p = p.replace(remove, '')
          return p
        }
        else {
          return ''
        }
      },

      /**
       * 当前版本号
       * 
       * @returns {number} 返回当前版本号。
       * 
       * @example
       * ```ts
       * const gameVersion = OpenAPI.GC.Cloud.GameVersion
       * ```
       */
      get GameVersion(): number {
        if (!OpenAPI.GC.Cloud.isInGCCloud)
          return 0
        const releaseProject = window.location.href.split('releaseProject/')
        const pop = releaseProject.pop()
        if (!pop)
          return 0
        const p = pop.split('/')
        return Number.parseInt(p[1])
      },

      /**
       * 作者ID
       * 
       * @returns {number} 返回作者ID。
       * 
       * @example
       * ```ts
       * const authorUID = OpenAPI.GC.Cloud.AuthorUID
       * ```
       */
      get AuthorUID(): number {
        if (!OpenAPI.GC.Cloud.isInGCCloud)
          return 0
        const releaseProject = window.location.href.split('releaseProject/')
        const pop = releaseProject.pop()
        if (!pop)
          return 0
        const split = pop.split('/')
        if (!split)
          return 0
        const shift = split.shift()
        if (!shift)
          return 0
        const p = shift.split('_')
        return Number.parseInt(p[0])
      },

      /**
       * 作者名称
       * 
       * @returns {string} 返回作者名称。
       * 
       * @example
       * ```ts
       * const authorName = OpenAPI.GC.Cloud.AuthorName
       * ```
       */
      get AuthorName(): string {
        if (!OpenAPI.GC.Cloud.isInGCCloud)
          return ''
        const title = document.querySelector('title')
        if (!title)
          return ''
        const p = title.innerText
        return p
      },

    }

    /**
     * 如果是编辑器则弹窗, 如果是发布后则输出
     * 
     * @param {any} text - 输出的文本
     * 
     * @example
     * ```ts
     * OpenAPI.GC.isCloudLog('这是一条日志')
     * ```
     */
    static isCloudLog(text: any): void {
      if (Config.RELEASE_GAME)
        trace(text)

      else
        alert(text)
    }
  }

}
