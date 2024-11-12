var OpenAPI;
(function (OpenAPI) {
    var AdvancedNumberVariables = (function () {
        function AdvancedNumberVariables() {
        }
        AdvancedNumberVariables.Version = 1.0;
        AdvancedNumberVariables.Installed = true;
        return AdvancedNumberVariables;
    }());
    OpenAPI.AdvancedNumberVariables = AdvancedNumberVariables;
})(OpenAPI || (OpenAPI = {}));
(function (CommandExecute) {
    function customCommand_15005(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        if (typeof OpenAPI == 'undefined' || typeof OpenAPI.System == 'undefined' || OpenAPI.System.Version < 2.9) {
            alert("\u3010\u9AD8\u7EA7\u6570\u503C\u8FD0\u7B97\u3011\n\u8BF7\u5B89\u88C5\u524D\u7F6E\u63D2\u4EF6 \"OpenAPI\" \u5927\u4E8E\u7B49\u4E8E v2.9 \u7248\u672C");
            return;
        }
        if (!p.set)
            return trace("\u3010\u9AD8\u7EA7\u6570\u503C\u8FD0\u7B97\u3011\u672A\u8BBE\u7F6E\u8BBE\u503C\u503C\u53D8\u91CF");
        var math = OpenAPI.Method.parseVarPlaceholderData(p.math);
        if (p.setGameNumber && p.gameNumber.length > 0)
            math = OpenAPI.Method.parseGameVarPlaceholderData(math, p.gameNumber);
        var prevText;
        do {
            prevText = math;
            math = OpenAPI.Method.parseCombinedFunctions(math);
        } while (prevText !== math);
        if (!splitExpression(math)) {
            alert("\u3010\u9AD8\u7EA7\u6570\u503C\u8FD0\u7B97\u3011\n\u8FD0\u7B97\u9519\u8BEF! \u8BF7\u8054\u7CFB\u6E38\u620F\u4F5C\u8005\u8FDB\u884C\u5904\u7406! \n\u5177\u4F53\u62A5\u9519\u6E90: " + math + "\n\u539F\u59CB\u62A5\u9519\u6E90: " + p.math);
        }
        var operators = [
            { regex: /([\d.]+|\w+)\^([\d.]+|\w+)/, func: function (a, b) { return Math.pow(a, b); } },
            { regex: /([\d.]+|\w+)\*([\d.]+|\w+)/, func: function (a, b) { return a * b; } },
            { regex: /([\d.]+|\w+)\/([\d.]+|\w+)/, func: function (a, b) { return a / b; } },
            { regex: /([\d.]+|\w+)%([\d.]+|\w+)/, func: function (a, b) { return a % b; } },
            { regex: /([\d.]+|\w+)\+([\d.]+|\w+)/, func: function (a, b) { return a + b; } },
            { regex: /([\d.]+|\w+)-([\d.]+|\w+)/, func: function (a, b) { return a - b; } },
            { regex: /([\d.]+|\w+)\>([\d.]+|\w+)/, func: function (a, b) { return a > b; } },
            { regex: /([\d.]+|\w+)\<([\d.]+|\w+)/, func: function (a, b) { return a < b; } },
            { regex: /([\d.]+|\w+)==([\d.]+|\w+)/, func: function (a, b) { return a == b; } },
        ];
        var num = OpenAPI.Method.evaluateComplexExpression(math, operators);
        if (num == null || num == undefined)
            alert("\u3010\u9AD8\u7EA7\u6570\u503C\u8FD0\u7B97\u3011\n\u8FD0\u7B97\u9519\u8BEF! \u8BF7\u8054\u7CFB\u6E38\u620F\u4F5C\u8005\u8FDB\u884C\u5904\u7406! \n\u5177\u4F53\u62A5\u9519\u6E90: " + math + "\n\u539F\u59CB\u62A5\u9519\u6E90: " + p.math);
        if (p.abs)
            num = Math.abs(num);
        if (p.sqrt)
            num = Math.sqrt(num);
        if (p.round)
            num = Math.round(num);
        else if (p.decimal > 0) {
            var pow = Math.pow(10, p.decimal);
            num = Math.round(num * pow) / pow;
        }
        if (!Config.RELEASE_GAME && p.debug)
            trace(math + " \u7ED3\u679C: " + num);
        if (p.gVar)
            ClientWorld.variable.setVariable(p.set, num);
        else
            Game.player.variable.setVariable(p.set, num);
        function splitExpression(expression) {
            var regex = /[+\-*/%^()]|\d+(\.\d+)?/g;
            var tokens = expression.match(regex);
            for (var i = 0; i < tokens.length - 1; i++) {
                var current = tokens[i];
                var next = tokens[i + 1];
                if (/^[+\-*/%^]$/.test(current) && /^[+\-*/%^]$/.test(next)) {
                    return false;
                }
            }
            return true;
        }
    }
    CommandExecute.customCommand_15005 = customCommand_15005;
})(CommandExecute || (CommandExecute = {}));
//# sourceMappingURL=NumberVariables.js.map