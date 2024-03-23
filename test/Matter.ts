class GUI_TEST2 extends GUI_15 {
  private Matter: any // Matter.js 的实例
  private physicsWorld: any // Matter.js 的物理世界

  constructor() {
    super()

    // 初始化 Matter.js
    this.Matter = OpenAPI.Require.Init('matter')
    this.physicsWorld = this.Matter.Engine.create().world

    // 事件监听：当界面显示时
    this.on(EventObject.DISPLAY, this, this.onDisplay)
  }

  private onDisplay() {
    // 获取要添加圆形刚体的位置和尺寸
    const x = this.物理.x // 替换为实际位置
    const y = this.物理.y // 替换为实际位置
    const width = this.物理.width // 替换为实际宽度
    const height = this.物理.height // 替换为实际高度
    this.Matter.Composite.add(this.physicsWorld, [0, 720, 1200])

    // 创建圆形刚体
    const body = this.Matter.Bodies.circle(x, y, 100)
    this.Matter.Composite.add(this.physicsWorld, body)
    // 创建相关的UI组件，假设你已经有了一个名为 UINeko 的自定义 UI 组件类
    const nekoObj = new UINeko(x, y) // 这里需要传入实际的参数
    nekoObj.body = body // 假设 UINeko 类有一个名为 body 的属性用于保存刚体信息
    this.addChild(nekoObj)
    nekoObj.event(EventObject.CLICK, new Point(this.mouseX, this.mouseY))
  }
}

// 自定义 UI 组件类 UINeko，继承自 UIBitmap
class UINeko extends UIBitmap {
  body: Matter.Body // 刚体属性

  constructor(x: number = 0, y: number = 0) {
    super()

    // 其他初始化操作...
    this.image = 'asset/image/picture/face/archer/Archer_normal.png'
    // 设置位置
    this.x = x
    this.y = y
  }
}
