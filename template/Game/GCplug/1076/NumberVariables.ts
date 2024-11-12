module OpenAPI {
    export class AdvancedNumberVariables {
        /**
         * 当前版本号
         */
        static Version = 1.0

        /**
         * 是否安装本插件
         */
        static Installed = true
    }
}

module CommandExecute {
    export function customCommand_15005(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], p: CustomCommandParams_15005): void {
        //* * 是否安装OpenAPI*/
        if (typeof OpenAPI == 'undefined' || typeof OpenAPI.System == 'undefined' || OpenAPI.System.Version < 2.9) {
            alert(`【高级数值运算】\n请安装前置插件 "OpenAPI" 大于等于 v2.9 版本`)
            return
        }

        if (!p.set) return trace(`【高级数值运算】未设置设值值变量`)
        let math = OpenAPI.Method.parseVarPlaceholderData(p.math)
        if (p.setGameNumber && p.gameNumber.length > 0)
            math = OpenAPI.Method.parseGameVarPlaceholderData(math, p.gameNumber)
        let prevText: string;
        do {
            prevText = math;
            math = OpenAPI.Method.parseCombinedFunctions(math)
        } while (prevText !== math);
        if (!splitExpression(math)) {
            alert(`【高级数值运算】\n运算错误! 请联系游戏作者进行处理! \n具体报错源: ${math}\n原始报错源: ${p.math}`)
        }

        const operators = [
            { regex: /([\d.]+|\w+)\^([\d.]+|\w+)/, func: (a: number, b: number) => Math.pow(a, b) },    // 幂运算
            { regex: /([\d.]+|\w+)\*([\d.]+|\w+)/, func: (a: number, b: number) => a * b },             // 乘法
            { regex: /([\d.]+|\w+)\/([\d.]+|\w+)/, func: (a: number, b: number) => a / b },             // 除法
            { regex: /([\d.]+|\w+)%([\d.]+|\w+)/, func: (a: number, b: number) => a % b },              // 求余
            { regex: /([\d.]+|\w+)\+([\d.]+|\w+)/, func: (a: number, b: number) => a + b },             // 加法
            { regex: /([\d.]+|\w+)-([\d.]+|\w+)/, func: (a: number, b: number) => a - b },              // 减法
            { regex: /([\d.]+|\w+)\>([\d.]+|\w+)/, func: (a: number, b: number) => a > b },             // 大于
            { regex: /([\d.]+|\w+)\<([\d.]+|\w+)/, func: (a: number, b: number) => a < b },             // 小于
            { regex: /([\d.]+|\w+)==([\d.]+|\w+)/, func: (a: number, b: number) => a == b },            // 等于
        ]
        let num = OpenAPI.Method.evaluateComplexExpression(math, operators)
        if (num == null || num == undefined)
            alert(`【高级数值运算】\n运算错误! 请联系游戏作者进行处理! \n具体报错源: ${math}\n原始报错源: ${p.math}`)

        if (p.abs)
            num = Math.abs(num)
        if (p.sqrt)
            num = Math.sqrt(num)
        if (p.round)
            num = Math.round(num)
        else if (p.decimal > 0) {
            const pow = Math.pow(10, p.decimal)
            num = Math.round(num * pow) / pow
        }

        if (!Config.RELEASE_GAME && p.debug)
            trace(`${math} 结果: ${num}`)

        if(p.gVar)
            ClientWorld.variable.setVariable(p.set, num)
        else
            Game.player.variable.setVariable(p.set, num)

        /**
         * 是否存在非法值
         */
        function splitExpression(expression: any) {
            const regex = /[+\-*/%^()]|\d+(\.\d+)?/g;
            // 将匹配到的运算符和数字分割出来
            const tokens = expression.match(regex);
            // 检查相邻的运算符是否出现
            for (let i = 0; i < tokens.length - 1; i++) {
                const current = tokens[i];
                const next = tokens[i + 1];
                // 如果连续出现两个运算符（除了括号外），则抛出错误
                if (/^[+\-*/%^]$/.test(current) && /^[+\-*/%^]$/.test(next)) {
                    return false;
                }
            }

            return true;
        }
    }
}