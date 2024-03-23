class GUI_TEST extends GUI_14 {
  /**
   * 构造函数
   */
  constructor() {
    super()

    // 事件监听：当界面显示时
    this.on(EventObject.DISPLAY, this, this.onDisplay)
  }

  private onDisplay() {
    OpenAPI.Clipper.Init()
    setInterval(() => {
      // @ts-expect-error 忽略处理
      const points1 = this.行走图._avatar.avatarList[0]._refObjs[3].points
      // @ts-expect-error 忽略处理
      const points2 = this.行走图2._avatar.avatarList[0]._refObjs[3].points
      const parent1 = this.行走图
      const parent2 = this.行走图2
      const objectsArray = OpenAPI.Point.relativeToParent(OpenAPI.Point.toCoordinateObjects(points1), parent1)
      const objectsArray2 = OpenAPI.Point.relativeToParent(OpenAPI.Point.toCoordinateObjects(points2), parent2)

      // 转换为 ClipperLib 格式的路径
      const polygon1 = OpenAPI.Clipper.toClipperPoints(objectsArray)
      const polygon2 = OpenAPI.Clipper.toClipperPoints(objectsArray2)

      // 判断两个多边形是否相交
      const isIntersect = OpenAPI.Clipper.polygonsIntersect(polygon1, polygon2)

      if (isIntersect)
        trace(isIntersect)
    }, 100)
  }
}
