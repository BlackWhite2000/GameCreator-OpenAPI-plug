module OpenAPI {

  /**
   * 通用API
   * 
   * @deprecated 尽管这个类在以前很常用，但是现在已经不推荐使用了。请使用新的类。当然，如果你有特殊需求，你仍然可以使用这个类。
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
     * @param {string} _charStr 随机的字符串
     */
    static getRandomString(len: number, _charStr = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'): string {
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
     * 更简单的HttpRequest
     * @param {string} url 请求地址
     * @param {any} json 数据
     * @param {any} completeText 完成事件
     * @param {any} errorText 发生错误时事件
     * @param {any} trigger 触发器
     * 
     * @deprecated 请使用 new HttpRequest()
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
     * @param {[] | null} getData 返回函数
     * @param {RegExp[]} regex 正则表达式
     */
    static parseVarPlaceholderData(text: string, getData: (((s: any) => number) | ((s: any) => string))[] | null = null, regex: RegExp[] | null = null): string {
      if (getData == null) {
        getData = [
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
      }

      if (regex == null) {
        regex = [
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
      }


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
     * @param {RegExp[]} regex 正则表达式
     */
    static parseGameVarPlaceholderData(text: string, gameData: any[], regex: RegExp[] | null = null): string {
      const getData = [
        // @ts-ignore 忽略处理
        (s: any) => gameData[s] && gameData[s][0] ? CustomGameNumber[`f${gameData[s][0]}`](null, gameData[s][1]) : 0,
        // @ts-ignore 忽略处理
        (s: any) => gameData[s] && gameData[s][0] ? CustomGameString[`f${gameData[s][0]}`](null, gameData[s][1]) : 0,
        // @ts-ignore 忽略处理
        (s: any) => gameData[s] && gameData[s][0] ? CustomCondition[`f${gameData[s][0]}`](null, gameData[s][1]) : 0,
      ];
      if (regex == null) {
        regex = [
          /\[@gv\w+\]/g,
          /\[@gs\w+\]/g,
          /\[@gb\w+\]/g,
        ];
      }

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
    * @param {RegExp[]} regex 正则表达式
    */
    static parseCombinedFunctions(text: string, regex: RegExp[] | null = null): string {
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

      if (regex == null) {
        regex = [
          /max\((-?\d+(\.\d+)?(,\s*)?)*-?\d+(\.\d+)?\)/g,
          /min\((-?\d+(\.\d+)?(,\s*)?)*-?\d+(\.\d+)?\)/g,
          /random\(-?\d+(\.\d+)?(,\s*)?-?\d+(\.\d+)?\)/g,
          /reduce\((-?\d+(\.\d+)?(,\s*)?)*-?\d+(\.\d+)?\)/g,
          /abs\(-?\d+(\.\d+)?\)/g,
          /sqrt\((\d+(\.\d+)?)\)/g,
          /round\(-?\d+(\.\d+)?\)/g,
        ];
      }

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
     * @returns {operators} 正则表达式
     */
    static evaluateComplexExpression(expression: string, operators: any[]): any {
      // 去除表达式中的空格
      expression = expression.replace(/\s+/g, '');

      /**
       * 递归解析函数
       * @param {string} expr - 要解析的子表达式
       * @returns {any} 子表达式的计算结果
       */
      function parseExpression(expr: string, operators: any[]): any {
        // 处理括号内的表达式
        while (expr.includes('(')) {
          expr = expr.replace(/\([^()]*\)/g, match => {
            return String(parseExpression(match.slice(1, -1), operators));
          });
        }

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
          return !parseExpression(operand, operators);
        }

        // 返回最终结果
        const result = isNaN(expr as any) ? (expr === 'true' ? true : expr === 'false' ? false : expr) : parseFloat(expr);
        return result;
      }

      // 解析并计算输入表达式
      return parseExpression(expression, operators);
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
