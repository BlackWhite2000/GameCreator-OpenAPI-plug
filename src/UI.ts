module OpenAPI {

  /**
   * 界面模块API
   */
  export class UI {
    /**
     * 界面列表组件数据初始化
     * @param {UIList} list 指定列表
     * @param {any} List_modelGUI 项模型数据,如：ListItem_1
     * @param {number} list_len 列表长度
     * @param {boolean} isFocus 【默认关闭】是否设置焦点
     */
    static listDataInit(list: UIList, List_modelGUI: any, list_len: number, isFocus = false): void {
      const arr = []
      for (let i = 1; i <= list_len; i++)
        arr.push(new List_modelGUI())

      list.items = arr
      if (isFocus)
        UIList.focus = list
    }
  }
  /**
   * Created by 千叶不冷 on 2021-09-24 15:26:19.
   * 通用悬浮框(提示框)
   */
  export class ShowTips {
    /**
     * 当前提示框界面id
     */
    static tipUIId: number

    /**
     * 即将显示的界面id
     */
    static onTipId: number

    /**
     * 当前提示框ui
     */
    static tipUI: UIBase | any

    /**
     * 构造函数
     */
    constructor() { }

    /**
     * 显示提示框
     * @param tipData 数据
     * @param id 提示框界面id
     */
    static showTips(tipData: any, id: number) {
      this.tipUIId = id
      if (!this.tipUI || this.tipUI.id !== String(id)) {
        this.tipUI = GameUI.show(id)
        this.tipUI.x = stage.mouseX + 15
        this.tipUI.y = stage.mouseY + 15
        const maxWidth = Config.WINDOW_WIDTH - 5
        const maxHeight = Config.WINDOW_HEIGHT - 15
        if (this.tipUI.tipRoot) {
          if (this.tipUI.x + this.tipUI.tipRoot.width > maxWidth)
            this.tipUI.x = maxWidth - this.tipUI.tipRoot.width
          if (this.tipUI.y + this.tipUI.tipRoot.height > maxHeight)
            this.tipUI.y = maxHeight - this.tipUI.tipRoot.height
        }
        this.tipUI.mouseEnabled = false
        for (const data in tipData) {
          if (this.tipUI[data] && tipData[data]) {
            for (const d in tipData[data])
              this.tipUI[data][d] = tipData[data][d]
          }
        }
      }
      else {
        this.tipUI.x = stage.mouseX + 15
        this.tipUI.y = stage.mouseY + 15
        const maxWidth = Config.WINDOW_WIDTH - 5
        const maxHeight = Config.WINDOW_HEIGHT - 15
        if (this.tipUI.tipRoot) {
          if (this.tipUI.x + this.tipUI.tipRoot.width > maxWidth)
            this.tipUI.x = maxWidth - this.tipUI.tipRoot.width
          if (this.tipUI.y + this.tipUI.tipRoot.height > maxHeight)
            this.tipUI.y = maxHeight - this.tipUI.tipRoot.height
        }
      }
    }

    /**
     * 关闭所有提示
     */
    static colseTip() {
      if (this.tipUIId)
        GameUI.hide(this.tipUIId)
      this.tipUIId = 0
    }

    /**
     * 显示提示
     */
    static showTip: any

    /**
     * 移动提示
     */
    static moveTip: any

    /**
     * 初始化完成
     */
    static isInit: boolean = false

    /**
     * 初始化
     */
    static init(id: number) {
      if (this.isInit)
        return
      this.isInit = true
      GameUI.load(id)
      // 当鼠标右键时消除提示
      stage.on(EventObject.RIGHT_MOUSE_DOWN, this, this.colseTip)
    }

    /**
     * 注册鼠标悬浮弹出提示框界面事件
     * @param ui 需要注册的界面ui
     * @param tipId 需要显示的界面id
     * @param tipData 数据 如{"name":{text:"千叶不冷","age":{text:"18"}} 当显示提示框时会自动匹配到提示框界面中相同名字的组件并赋值
     * @param delayed [可选 默认为0] 延迟显示
     * @param expandList [可选 默认为false] 展开列表，当ui为列表时会对里面每个item赋予data.tip的值，即tipData = data.tip
     */
    static addTipEvent(ui: UIBase, tipId: number, tipData: any, delayed: number = 0, expandList: boolean = false) {
      this.init(tipId)
      const onItemCreate = (_ui: UIRoot, data: UIListItemData | any, index: number) => {
        this.addTipEvent(_ui, tipId, data['tip'], delayed, false)
      }
      const addTip = () => {
        ui.off(EventObject.MOUSE_MOVE, this, this.showTip)
        ui.off(EventObject.MOUSE_OUT, this, this.colseTip)
        ui.off(EventObject.MOUSE_MOVE, this, this.moveTip)
        this.showTip = () => {
          if (this.tipUIId) {
            GameUI.hide(this.tipUIId)
            this.tipUIId = 0
          }
          this.onTipId = tipId
          setTimeout(() => {
            if (this.onTipId === tipId)
              this.showTips(tipData, tipId)
          }, delayed)
        }
        this.moveTip = () => {
          if (this.tipUIId === tipId)
            this.showTips(tipData, tipId)
        }
        // 当鼠标移入时显示
        ui.on(EventObject.MOUSE_OVER, this, this.showTip)
        ui.on(EventObject.MOUSE_MOVE, this, this.moveTip)
        // 当鼠标移出时消失
        ui.on(EventObject.MOUSE_OUT, this, this.colseTip)
      }
      // 判断是否展开列表
      if (ui instanceof UIList && expandList)
        ui.on(UIList.ITEM_CREATE, this, onItemCreate)

      else addTip()
    }
  }
}
