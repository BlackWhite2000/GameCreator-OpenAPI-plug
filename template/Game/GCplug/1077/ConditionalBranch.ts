module OpenAPI {
    export class AdvancedConditionalBranch {
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

module CustomCondition {
    /**
     * 高级条件分歧
     */
    export function f8(trigger: CommandTrigger, p: CustomConditionParams_8): boolean {
        //* * 是否安装OpenAPI*/
        if (typeof OpenAPI == 'undefined' || typeof OpenAPI.System == 'undefined' || OpenAPI.System.Version < 2.9) {
            alert(`【高级数值运算】\n请安装前置插件 "OpenAPI" 大于等于 v2.9 版本`)
            return false
        }

        const nesting = p.gameVar.findIndex(v => v.type == 2 && v.gameBoolean && v.gameBoolean[0] == 10);
        if (nesting !== -1) {
            alert(`【高级条件分歧】\n禁止通过游戏开关嵌套高级条件分歧! 请联系游戏作者进行处理!\n具体报错索引: ${nesting}\n原始报错源: ${p.comparison}`);
            return false;
        }

        let comparison = OpenAPI.Method.parseVarPlaceholderData(` ${p.comparison}`)
        if (p.setGameVar && p.gameVar.length > 0) {
            const gameVar: any[] = []
            p.gameVar.forEach(v => {
                if (v.type == 0) gameVar.push(v.gameNumber)
                if (v.type == 1) gameVar.push(v.gameString)
                if (v.type == 2) gameVar.push(v.gameBoolean)
            })
            comparison = OpenAPI.Method.parseGameVarPlaceholderData(comparison, gameVar)
        }

        const operators = [
            // 字符串比较运算符
            { regex: /(["'][^"']*["'])\s*>\s*(["'][^"']*["'])/, func: (a: any, b: any) => a.replace(/["']/g, '') > b.replace(/["']/g, '') }, // 大于
            { regex: /(["'][^"']*["'])\s*<\s*(["'][^"']*["'])/, func: (a: any, b: any) => a.replace(/["']/g, '') < b.replace(/["']/g, '') }, // 小于
            { regex: /(["'][^"']*["'])\s*==\s*(["'][^"']*["'])/, func: (a: any, b: any) => a.replace(/["']/g, '') == b.replace(/["']/g, '') }, // 等于
            { regex: /(["'][^"']*["'])\s*!=\s*(["'][^"']*["'])/, func: (a: any, b: any) => a.replace(/["']/g, '') != b.replace(/["']/g, '') }, // 不等于
            { regex: /(["'][^"']*["'])\s*>=\s*(["'][^"']*["'])/, func: (a: any, b: any) => a.replace(/["']/g, '') >= b.replace(/["']/g, '') }, // 大于等于
            { regex: /(["'][^"']*["'])\s*<=\s*(["'][^"']*["'])/, func: (a: any, b: any) => a.replace(/["']/g, '') <= b.replace(/["']/g, '') }, // 小于等于
            { regex: /(["'][^"']*["'])\s*\!<>\s*(["'][^"']*["'])/, func: (a: string, b: string) => a.indexOf(b.replace(/["']/g, '')) == -1 }, // 字符串不包含
            { regex: /(["'][^"']*["'])\s*<>\s*(["'][^"']*["'])/, func: (a: string, b: string) => a.indexOf(b.replace(/["']/g, '')) != -1 }, // 字符串包含

            // 数值运算符
            { regex: /([\d.]+)\s*>\s*([\d.]+)/, func: (a: number, b: number) => a > b }, // 大于
            { regex: /([\d.]+)\s*<\s*([\d.]+)/, func: (a: number, b: number) => a < b }, // 小于
            { regex: /([\d.]+)\s*==\s*([\d.]+)/, func: (a: number, b: number) => a == b }, // 等于
            { regex: /([\d.]+)\s*!=\s*([\d.]+)/, func: (a: number, b: number) => a != b }, // 不等于
            { regex: /([\d.]+)\s*>=\s*([\d.]+)/, func: (a: number, b: number) => a >= b }, // 大于等于
            { regex: /([\d.]+)\s*<=\s*([\d.]+)/, func: (a: number, b: number) => a <= b }, // 小于等于

            // 布尔运算符
            { regex: /(.+?)&&\s*(.+)/, func: (a: any, b: any) => a && b }, // 逻辑与
            { regex: /(.+?)\|\|\s*(.+)/, func: (a: boolean, b: boolean) => a || b }, // 逻辑或
        ]

        const data = OpenAPI.Method.evaluateComplexExpression(comparison, operators)
        if (!Config.RELEASE_GAME && p.debug)
            trace(`${comparison} 结果: ${data} 转为开关结果: ${!!data}`)

        return !!data
    }
}

