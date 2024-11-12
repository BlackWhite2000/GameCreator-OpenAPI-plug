module OpenAPI {
  /**
   * Javascript Clipper
   * @version 6.4.2
   * 
   * @deprecated 该类库已经废弃，不再维护。未来版本将删除该类库。
   * @private
   */
  export class Clipper {
    /**
     * Clipper库，需要先执行init才能拿到库内容
     */
    static ClipperLib: any

    /**
     * 初始化
     */
    static Init() {
      OpenAPI.Clipper.ClipperLib = OpenAPI.Require.Init('clipper')
    }

    /**
     * 定义点转换函数
     */
    static toClipperPoints(points: { x: number; y: number }[]) {
      return points.map(point => ({ X: point.x, Y: point.y }))
    }

    /**
     *  判断两个多边形是否相交的函数
     */
    static polygonsIntersect(polygon1: { X: number; Y: number }[], polygon2: { X: number; Y: number }[]) {
      // 创建 Clipper 实例
      const ClipperLib = OpenAPI.Clipper.ClipperLib
      const clipper = new ClipperLib.Clipper()

      // 将多边形路径添加到 Clipper 实例中
      clipper.AddPath(polygon1, ClipperLib.PolyType.ptSubject, true)
      clipper.AddPath(polygon2, ClipperLib.PolyType.ptClip, true)

      // 执行相交判断
      const solution = new ClipperLib.Paths()
      clipper.Execute(ClipperLib.ClipType.ctIntersection, solution)

      // 如果有交点，说明两个多边形相交
      return solution.length > 0
    }
  }
}
