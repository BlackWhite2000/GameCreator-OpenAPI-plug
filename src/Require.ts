module OpenAPI{
  /**
   * 第三方库
   */
  export class Require {
    /**
     * 库初始化
     */
    static Init(name: string, filename?: string) {
      filename = filename ? `${name}/${filename}` : `${name}/${name}`
      // @ts-expect-error 忽略处理
      const path = os.inGC() ? `${decodeURIComponent(Laya.URL.formatURL('asset'))}/myally_modules/${filename}` : `${FileUtils.nativePath}/asset/myally_modules/${filename}`
      // @ts-expect-error 忽略处理
      const topRequire = typeof require != 'undefined' ? require : top.top.require
      return topRequire(path)
    }
  }
}
