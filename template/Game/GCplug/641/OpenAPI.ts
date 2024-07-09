module OpenAPI {
  /**
   * Javascript Clipper
   * @version 6.4.2
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
      Clipper.ClipperLib = OpenAPI.Require.Init('clipper')
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
     */
    static isCloudLog(text: any): void {
      if (Config.RELEASE_GAME)
        trace(text)

      else
        alert(text)
    }
  }

}
module OpenAPI {

  /**
   * 通用API
   */
  export class Method {
    /**
     * 当前页面协议
     * @ "http://" : "https://"
     */
    static get Origin(): string {
      return window.location.protocol === 'http:' ? 'http://' : 'https://'
    }

    /**
     * 随机字符串
     * @param {number} len 随机字符串的长度
     */
    static getRandomString(len: number): string {
      const _charStr = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
      const min = 0
      const max = _charStr.length - 1
      let _str = ''
      // 不允许为0的情况
      if (len === 0)
        return ''

      // 循环生成字符串
      for (let i = 0, index; i < len; i++) {
        index = (function (randomIndexFunc, i) {
          return randomIndexFunc(min, max, i, randomIndexFunc)
        })((min: any, max: any, i: any, _self: any) => {
          let indexTemp = Math.floor(Math.random() * (max - min + 1) + min)
          const numStart = _charStr.length - 10
          if (i === 0 && indexTemp >= numStart)
            indexTemp = _self(min, max, i, _self)

          return indexTemp
        }, i)
        _str += _charStr[index]
      }
      return _str
    }

    /**
     * 日期转时间戳, 格式 1970/01/01 00:00:00 或 1970-01-01 00:00:00
     * @param {string} date 日期
     */
    static dateToTimestamp(date: string): number {
      return new Date(date.replace(/-/g, '/')).getTime()
    }

    /**
     * 时间戳转日期, 格式 1609459200。 支持获取特定时间
     * @param {number} data 时间戳。输出格式 1970/01/01 00:00:00
     * @param {string} data_type 【可选】获取时间类型 y、m、d、h、i、s。如 s = 获取时间戳中的秒
     */
    static timestampToDate(data: number, data_type: string = ''): string | number | undefined {
      let _data = 0
      if (String(data).length === 13)
        _data = data

      else
        _data = data * 1000

      const time = new Date(_data)
      let _time
      if (data_type === 'y')
        _time = time.getFullYear()

      if (data_type === 'm')
        _time = pad(time.getMonth() + 1, 2)

      if (data_type === 'd')
        _time = pad(time.getDate(), 2)

      if (data_type === 'h')
        _time = pad(time.getHours(), 2)

      if (data_type === 'i')
        _time = pad(time.getMinutes(), 2)

      if (data_type === 's')
        _time = pad(time.getSeconds(), 2)

      if (data_type === '')
        _time = `${time.getFullYear()}/${pad(time.getMonth() + 1, 2)}/${pad(time.getDate(), 2)} ${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(time.getSeconds(), 2)}`

      function pad(num: number, size: number): string {
        let s = `${num}`
        while (s.length < size) s = `0${s}`
        return s
      }
      return _time
    }

    /**
     * 判断常量变量类型
     * @param {any} constant 常量
     * @param {number} variable 变量
     * @param {number} index_type 选项类型 0 = 常量 1 = 变量
     * @param {number} variable_type 【默认数值】变量类型 0 = 数值, 1 = 字符串, 2 = 开关(返回 0 = 关闭, 1 = 开启)
     */
    static JudgeTypeConstantVariable(constant: any, variable: number, index_type: number, variable_type: number = 0): any {
      let variable_value
      if (index_type === 0) {
        variable_value = constant
      }
      else {
        // 数值
        if (variable_type === 0)
          variable_value = Game.player.variable.getVariable(variable)

        // 字符串
        if (variable_type === 1)
          variable_value = Game.player.variable.getString(variable)

        // 开关
        if (variable_type === 2)
          variable_value = Game.player.variable.getSwitch(variable)
      }
      return variable_value
    }

    /**
     * 光标系统样式名称
     * 'default', 'auto', 'pointer', 'text', 'wait', 'help', 'crosshair', 'move', 'n-resize', 's-resize', 'w-resize', 'e-resize', 'nw-resize', 'sw-resize', 'ne-resize', 'se-resize'
     */
    static cursorSystemStyleName: string[] = [
      'default', 'auto', 'pointer', 'text', 'wait', 'help', 'crosshair', 'move', 'n-resize', 's-resize', 'w-resize', 'e-resize', 'nw-resize', 'sw-resize', 'ne-resize', 'se-resize',
    ]

    /**
     * 基于cursorSystemStyleName来弹出指定名称
     * @param {string[]} name 弹出指定的名称
     */
    static cursorSystemStyleName_spliceName(name: string[]): string[] {
      const cursorName = [...OpenAPI.Method.cursorSystemStyleName]
      return cursorName.filter(x => name.indexOf(x.toString()) === -1)
    }

    /**
     * 检查当前模板是否是兼容的模板ID。 false = 不兼容, true = 兼容
     * @param {number[]} templateID 兼容的模板ID合集
     */
    static checkTemplateID(templateID: number[]): boolean {
      return templateID.indexOf(Config.templateID) !== -1
    }

    /**
     * 随机颜色
     */
    static getRandomColor(): string {
      return `#${(Math.random() * 0xFFFFFF << 0).toString(16)}`
    }

    /**
     * 更简单的HttpRequest - 即将弃用
     * @param {string} url 请求地址
     * @param {any} json 数据
     * @param {any} completeText 完成事件
     * @param {any} errorText 发生错误时事件
     * @param {any} trigger 触发器
     */
    static sendRequest(url: string, json: any, completeText: any, errorText: any, trigger: any = null, requestType = 'post'): void {
      const ur = new HttpRequest()
      ur.send(url, JSON.stringify(json), requestType, 'json', ['Content-Type', 'application/json'])
      if (trigger) {
        trigger.pause = true
        trigger.offset(1)
      }
      ur.once(EventObject.COMPLETE, this, (content: any) => {
        completeText(content)
        if (trigger)
          CommandPage.executeEvent(trigger)
      })
      ur.once(EventObject.ERROR, this, (content: any) => {
        errorText(content)
        if (trigger)
          CommandPage.executeEvent(trigger)
      })
    }

    /**
     * 解析文本内变量占位符
     * @param {string} text 文本
     */
    static parseVarPlaceholderData(text: string): string {
      const getData = [
        (s: any) => { return Game.player.variable.getVariable(s) },
        (s: any) => { return Game.player.variable.getString(s) },
        (s: any) => { return Game.player.variable.getSwitch(s) },
        (s: any) => { return ClientWorld.variable.getVariable(s) },
        (s: any) => { return ClientWorld.variable.getString(s) },
        (s: any) => { return ClientWorld.variable.getSwitch(s) },
        (s: any) => { return Game.player.variable.getVariable(Game.player.variable.getVariable(s)) },
        (s: any) => { return Game.player.variable.getString(Game.player.variable.getVariable(s)) },
        (s: any) => { return Game.player.variable.getSwitch(Game.player.variable.getVariable(s)) },
        (s: any) => { return ClientWorld.variable.getVariable(ClientWorld.variable.getVariable(s)) },
        (s: any) => { return ClientWorld.variable.getString(ClientWorld.variable.getVariable(s)) },
        (s: any) => { return ClientWorld.variable.getSwitch(ClientWorld.variable.getVariable(s)) },
      ]
      const regex = [
        /\[@v\w+\]/g,
        /\[@s\w+\]/g,
        /\[@b\w+\]/g,
        /\[\$v\w+\]/g,
        /\[\$s\w+\]/g,
        /\[\$b\w+\]/g,
        /\[@@v\w+\]/g,
        /\[@@s\w+\]/g,
        /\[@@b\w+\]/g,
        /\[\$\$v\w+\]/g,
        /\[\$\$s\w+\]/g,
        /\[\$\$b\w+\]/g,
      ];

      for (let i = 0; i < getData.length; i++) {
        const start = i >= 6 ? 4 : 3
        const result = this.replacePlaceholderData(text, regex[i], getData[i], start)
        if (result)
          text = result
      }
      return text
    }

    /**
     * 解析文本内游戏变量占位符
     * @param {string} text 文本
     * @param {string} gameData 游戏变量数据
     */
    static parseGameVarPlaceholderData(text: string, gameData: any[]): string {
      const getData = [
      // @ts-ignore 忽略处理
        (s: any) => gameData[s] && gameData[s][0] ? CustomGameNumber[`f${gameData[s][0]}`](null, gameData[s][1]) : 0,
      // @ts-ignore 忽略处理
        (s: any) => gameData[s] && gameData[s][0] ? CustomGameString[`f${gameData[s][0]}`](null, gameData[s][1]) : 0,
      // @ts-ignore 忽略处理
        (s: any) => gameData[s] && gameData[s][0] ? CustomCondition[`f${gameData[s][0]}`](null, gameData[s][1]) : 0,
      ];
      const regex = [
        /\[@gv\w+\]/g,
        /\[@gs\w+\]/g,
        /\[@gb\w+\]/g,
      ];

      for (let i = 0; i < getData.length; i++) {
        const result = this.replacePlaceholderData(text, regex[i], getData[i], 4)
        if (result)
          text = result
      }
      return text
    }

    /**
     * 替换占位符数据
     * @param {string} text 文本
     * @param {RegExp} regex 正则表达式
     * @param {any} getData 解析占位符数据
     * @param {number} start 起始位
     * @param {string} end 结束符号
     */
    static replacePlaceholderData(text: string, regex: RegExp, getData: any, start: number = 3, end: string = ']'): string | null {
      const matches = text.match(regex)
      if (matches) {
        for (let i = 0; i < matches.length; i++) {
          const d = matches[i]
          const s = Number(d.slice(start, d.indexOf(end)))
          if (s || s == 0) {
            const v = getData(s)
            text = text.replace(d, v)
          }
        }
        return text
      }
      else {
        return null
      }
    };

    /**
    * 解析文本内函数组合
    * @param {string} text 文本
    */
    static parseCombinedFunctions(text: string): string {
      const getData = [
        (...args: number[]) => { return Math.max(...args) },
        (...args: number[]) => { return Math.min(...args) },
        (a: number, b: number) => {
          const [min, max] = a < b ? [a, b] : [b, a];
          return Math.random() * (max - min) + min;
        },
        (...args: number[]) => { return args.reduce((acc, val) => acc + val, 0) },
        (num: number) => { return Math.abs(num) },
        (num: number) => { return Math.sqrt(num) },
        (num: number) => { return Math.round(num) },
      ];

      const regex = [
        /max\((?:\d+(\.\d+)?(,\s*)?)*\d+(\.\d+)?\)/g,
        /min\((?:\d+(\.\d+)?(,\s*)?)*\d+(\.\d+)?\)/g,
        /random\(\d+(\.\d+)?(,\s*)?\d+(\.\d+)?\)/g,
        /reduce\((?:\d+(\.\d+)?(,\s*)?)*\d+(\.\d+)?\)/g,
        /abs\(\d+(\.\d+)?\)/g,
        /sqrt\(\d+(\.\d+)?\)/g,
        /round\(\d+(\.\d+)?\)/g,
      ];

      for (let i = 0; i < getData.length; i++) {
        const result = this.replaceFunctionCombinations(text, regex[i], getData[i]);
        if (result)
          text = result;
      }
      return text;
    }

    /**
       * 替换函数组合数据
       * @param {string} text 文本
       * @param {RegExp} regex 正则表达式
       * @param {any} getData 解析函数组合数据
       */
    static replaceFunctionCombinations(text: string, regex: RegExp, getData: any): string | null {
      const matches = text.match(regex);
      if (matches) {
        for (let i = 0; i < matches.length; i++) {
          const d = matches[i];
          const argsString = d.slice(d.indexOf('(') + 1, d.indexOf(')'));
          const args = argsString.split(',').map(Number);
          if (args.every(arg => !isNaN(arg))) {
            const v = getData(...args);
            text = text.replace(d, v.toString());
          }
        }
        return text;
      } else {
        return null;
      }
    }

    /**
     * 解析并计算复杂表达式的函数
     * @param {string} expression - 要解析的表达式
     * @returns {any} 计算结果，如果表达式无效则返回 null
     */
    static evaluateComplexExpression(expression: string): any {
      // 去除表达式中的空格
      expression = expression.replace(/\s+/g, '');

      /**
       * 递归解析函数
       * @param {string} expr - 要解析的子表达式
       * @returns {any} 子表达式的计算结果
       */
      function parseExpression(expr: string): any {
        // 处理括号内的表达式
        while (expr.includes('(')) {
          expr = expr.replace(/\([^()]*\)/g, match => {
            return String(parseExpression(match.slice(1, -1)));
          });
        }

        // 定义运算符优先级和对应的计算函数
        const operators = [
          { regex: /([\d.]+|[^><=!&|^+\-*/%]+)\^([\d.]+|[^><=!&|^+\-*/%]+)/, func: (a: any, b: any) => Math.pow(a, b) },          // 幂运算
          { regex: /([\d.]+|[^><=!&|^+\-*/%]+)\*([\d.]+|[^><=!&|^+\-*/%]+)/, func: (a: number, b: number) => a * b },             // 乘法
          { regex: /([\d.]+|[^><=!&|^+\-*/%]+)\/([\d.]+|[^><=!&|^+\-*/%]+)/, func: (a: number, b: number) => a / b },             // 除法
          { regex: /([\d.]+|[^><=!&|^+\-*/%]+)%([\d.]+|[^><=!&|^+\-*/%]+)/, func: (a: number, b: number) => a % b },              // 求余
          { regex: /([\d.]+|[^><=!&|^+\-*/%]+)\+([\d.]+|[^><=!&|^+\-*/%]+)/, func: (a: number, b: number) => a + b },             // 加法
          { regex: /([\d.]+|[^><=!&|^+\-*/%]+)-([\d.]+|[^><=!&|^+\-*/%]+)/, func: (a: number, b: number) => a - b },              // 减法
          { regex: /([\d.]+|[^><=!&|^+\-*/%]+)\>([\d.]+|[^><=!&|^+\-*/%]+)/, func: (a: number, b: number) => a > b },             // 大于
          { regex: /([\d.]+|[^><=!&|^+\-*/%]+)\<([\d.]+|[^><=!&|^+\-*/%]+)/, func: (a: number, b: number) => a < b },             // 小于
          { regex: /([\d.]+|[^><=!&|^+\-*/%]+)==([\d.]+|[^><=!&|^+\-*/%]+)/, func: (a: any, b: any) => a == b },                  // 等于
          { regex: /([\d.]+|[^><=!&|^+\-*/%]+)\!=([\d.]+|[^><=!&|^+\-*/%]+)/, func: (a: any, b: any) => a != b },                 // 不等于
          { regex: /([\d.]+|[^><=!&|^+\-*/%]+)\>=(\d+|[^><=!&|^+\-*/%]+)/, func: (a: number, b: number) => a >= b },              // 大于等于
          { regex: /([\d.]+|[^><=!&|^+\-*/%]+)\<=(\d+|[^><=!&|^+\-*/%]+)/, func: (a: number, b: number) => a <= b },              // 小于等于
          { regex: /(.+?)&&\s*(.+)/, func: (a: any, b: any) => a && b },                                                         // 逻辑与
          { regex: /(.+?)\|\|\s*(.+)/, func: (a: boolean, b: boolean) => a || b },                                               // 逻辑或
          { regex: /(.+?)\!<>\s*(.+)/, func: (a: string, b: string) => a.indexOf(b) == -1 },                                     // 字符串不包含
          { regex: /(.+?)<>\s*(.+)/, func: (a: string, b: string) => a.indexOf(b) != -1 },                                       // 字符串包含
        ];

        // 逐个运算符处理表达式
        for (const { regex, func } of operators) {
          while (regex.test(expr)) {
            expr = expr.replace(regex, (match, p1, p2) => {
              const operand1 = isNaN(p1 as any) ? (p1 === 'true' ? true : p1 === 'false' ? false : p1) : parseFloat(p1);
              const operand2 = isNaN(p2 as any) ? (p2 === 'true' ? true : p2 === 'false' ? false : p2) : parseFloat(p2);
              return String(func(operand1, operand2));
            });
          }
        }

        // 处理逻辑非运算符
        if (expr.startsWith('!')) {
          const operand = expr.slice(1);
          return !parseExpression(operand);
        }

        // 返回最终结果
        const result = isNaN(expr as any) ? (expr === 'true' ? true : expr === 'false' ? false : expr) : parseFloat(expr);
        return result;
      }

      // 解析并计算输入表达式
      return parseExpression(expression);
    }

    /**
     * 将阿拉伯数字转换为罗马数字的函数
     * @param {number} num - 要转换的阿拉伯数字
     * @returns {string} 对应的罗马数字
     */
    static intToRoman(num: number): string {
      // 定义一个数组，包含罗马数字的数值部分
      const val = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
      // 定义一个数组，包含与数值对应的罗马数字符号
      const syms = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];

      // 初始化空字符串，用于存储最终的罗马数字
      let roman = "";

      // 遍历数值数组
      for (let i = 0; i < val.length; i++) {
        // 当输入数字大于或等于当前数值时
        while (num >= val[i]) {
          // 将对应的罗马数字符号添加到结果字符串中
          roman += syms[i];
          // 从输入数字中减去当前数值
          num -= val[i];
        }
      }

      // 返回最终的罗马数字字符串
      return roman;
    }

    /**
     * 打乱数组
     * @param array - 需要打乱的数组。
     * @returns 返回一个新的打乱顺序的数组。
     */
    static shuffleArray<T>(array: T[]): T[] {
      // 复制输入数组，避免修改原数组
      const shuffledArray = array.slice();

      // 从数组末尾开始遍历到第二个元素
      for (let i = shuffledArray.length - 1; i > 0; i--) {
        // 在 0 到 i 之间随机选择一个索引
        const j = Math.floor(Math.random() * (i + 1));

        // 交换元素 shuffledArray[i] 和 shuffledArray[j]
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
      }

      // 返回打乱顺序后的数组
      return shuffledArray;
    }

    /**
     * 获取事件页名称
     * @param eventPage 事件页
     * @returns 
     */
    static getFeDataMessage(eventPage: string): string | null {
      if (!eventPage) return null;
      var startIdx = eventPage.indexOf(String.fromCharCode(5));
      var feName = eventPage.slice(0, startIdx);
      return feName ? feName : null;
    }

    /**
     * 获得模块数据
     * @param id 模块id
     * @param comp 回调
     * @param length 类别长度 默认16
     */
    static getModuleData(id: number, comp: Callback, length = 16) {
      for (let i = 1; i <= length; i++) {
        for (let j = 1; j <= GameData.getLength(id, i); j++) {
          let d = GameData.getModuleData(id, (i - 1) * 1000 + j);
          if (d && d.name) {
            comp.runWith([d]);
          }
        }
      }
    }

    /**
     * 获取两个数之间的范围，包括起始和结束数字
     * @param start - 范围的起始数字
     * @param end - 范围的结束数字
     * @returns 包含从起始数字到结束数字之间所有数字的数组
     */
    static getRange(start: number, end: number): number[] | null {
      if (typeof start !== 'number' || typeof end !== 'number') {
        return null
      }
      const range: number[] = [];
      if (start <= end) {
        // 如果起始数字小于或等于结束数字，按升序添加数字
        for (let i = start; i <= end; i++) {
          range.push(i);
        }
      } else {
        // 如果起始数字大于结束数字，按降序添加数字
        for (let i = start; i >= end; i--) {
          range.push(i);
        }
      }
      return range;
    }
  }
}
module OpenAPI{
  /**
   * 点
   */
  export class Point {
    /**
     * 数值坐标数组转对象坐标数组
     */
    static toCoordinateObjects(arr: number[]): { x: number; y: number }[] {
      const result: { x: number; y: number }[] = []
      for (let i = 0; i < arr.length; i += 2)
        result.push({ x: arr[i], y: arr[i + 1] })

      return result
    }

    /**
     * 相对于父级容器的坐标
     */
    static relativeToParent(objectsArray: { x: number; y: number }[], parent: { x: number; y: number }) {
      return objectsArray.map(point => ({
        x: point.x + parent.x,
        y: point.y + parent.y,
      }))
    }
  }
}
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
/**
 * 更多API插件
 * @author BlackWhite
 * @see https://www.gamecreator.com.cn/plug/det/641
 * @version 2.6
 */
module OpenAPI {

  /**
   * 插件的系统API
   */
  export class System {
    /**
     * 当前版本号
     */
    static Version = 2.6

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
