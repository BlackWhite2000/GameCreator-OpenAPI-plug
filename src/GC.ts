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
       */
      get isInGCCloud(): boolean {
        return window.location.href.includes('gamecreator')
      },

      /**
       * 游戏ID
       */
      get GameID(): number {
        if (!OpenAPI.GC.Cloud.isInGCCloud)
          return 0
        // @ts-expect-error 无需判断是否存在
        const p = window.location.href.split('releaseProject/').pop().split('/').shift().split('_')
        // 这里进行 p 的进一步操作
        return Number.parseInt(p[1])
      },

      /**
       * 游戏名称
       */
      get GameName(): string | null {
        if (!OpenAPI.GC.Cloud.isInGCCloud)
          return ''
          // @ts-expect-error 无需判断是否存在
        const name = document.querySelector('title').innerText
        // @ts-expect-error 无需判断是否存在
        let p = document.querySelector('meta[name="keywords"]').getAttribute('content')
        const remove = `${name} | `
        if (p && p.startsWith(remove))
          p = p.replace(remove, '')

        return p
      },

      /**
       * 当前版本号
       */
      get GameVersion(): number {
        if (!OpenAPI.GC.Cloud.isInGCCloud)
          return 0
        // @ts-expect-error 无需判断是否存在
        const p = window.location.href.split('releaseProject/').pop().split('/')
        return Number.parseInt(p[1])
      },

      /**
       * 作者ID
       */
      get AuthorUID(): number {
        if (!OpenAPI.GC.Cloud.isInGCCloud)
          return 0
        // @ts-expect-error 无需判断是否存在
        const p = window.location.href.split('releaseProject/').pop().split('/').shift().split('_')
        return Number.parseInt(p[0])
      },

      /**
       * 作者名称
       */
      get AuthorName(): string {
        if (!OpenAPI.GC.Cloud.isInGCCloud)
          return ''
        // @ts-expect-error 无需判断是否存在
        const p = document.querySelector('title').innerText
        return p
      },

    }

    /**
     * 如果是编辑器则弹窗, 如果是发布后则输出
     */
    static isCloudLog(text: any): void {
      if (Config.RELEASE_GAME)
        trace(text)

      else
        alert(text)
    }
  }

}
