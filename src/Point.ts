module OpenAPI{
  /**
   * 点
   */
  export class Point {
    /**
     * 数值坐标数组转对象坐标数组
     * 
     * @param {number[]} arr - 数值坐标数组
     * 
     * @example
     * ```ts
     * const arr = [1, 2, 3, 4, 5, 6]
     * const result = OpenAPI.Point.toCoordinateObjects(arr) // 返回对象坐标数组
     * ```
     */
    static toCoordinateObjects(arr: number[]): { x: number; y: number }[] {
      const result: { x: number; y: number }[] = []
      for (let i = 0; i < arr.length; i += 2)
        result.push({ x: arr[i], y: arr[i + 1] })

      return result
    }

    /**
     * 相对于父级容器的坐标
     * 
     * @param {Array<{ x: number; y: number }>} objectsArray - 对象坐标数组
     * @param {number} parent - 父级容器坐标
     * 
     * @example
     * ```ts
     * const objectsArray = [{ x: 1, y: 2 }, { x: 3, y: 4 }]
     * const parent = { x: 5, y: 6 }
     * const result = OpenAPI.Point.relativeToParent(objectsArray, parent) // 返回相对于父级容器的坐标
     * ```
     */
    static relativeToParent(objectsArray: { x: number; y: number }[], parent: { x: number; y: number }) {
      return objectsArray.map(point => ({
        x: point.x + parent.x,
        y: point.y + parent.y,
      }))
    }
  }
}
