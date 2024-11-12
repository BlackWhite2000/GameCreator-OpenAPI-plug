(function (OpenAPI) {
    var AdvancedConditionalBranch = (function () {
        function AdvancedConditionalBranch() {
        }
        AdvancedConditionalBranch.Version = 1.0;
        AdvancedConditionalBranch.Installed = true;
        return AdvancedConditionalBranch;
    }());
    OpenAPI.AdvancedConditionalBranch = AdvancedConditionalBranch;
})(OpenAPI || (OpenAPI = {}));
(function (CustomCondition) {
    function f7(trigger, p) {
        if (typeof OpenAPI == 'undefined' || typeof OpenAPI.System == 'undefined' || OpenAPI.System.Version < 2.9) {
            alert("\u3010\u9AD8\u7EA7\u6570\u503C\u8FD0\u7B97\u3011\n\u8BF7\u5B89\u88C5\u524D\u7F6E\u63D2\u4EF6 \"OpenAPI\" \u5927\u4E8E\u7B49\u4E8E v2.9 \u7248\u672C");
            return false;
        }
        var nesting = p.gameVar.findIndex(function (v) { return v.type == 2 && v.gameBoolean && v.gameBoolean[0] == 10; });
        if (nesting !== -1) {
            alert("\u3010\u9AD8\u7EA7\u6761\u4EF6\u5206\u6B67\u3011\n\u7981\u6B62\u901A\u8FC7\u6E38\u620F\u5F00\u5173\u5D4C\u5957\u9AD8\u7EA7\u6761\u4EF6\u5206\u6B67! \u8BF7\u8054\u7CFB\u6E38\u620F\u4F5C\u8005\u8FDB\u884C\u5904\u7406!\n\u5177\u4F53\u62A5\u9519\u7D22\u5F15: " + nesting + "\n\u539F\u59CB\u62A5\u9519\u6E90: " + p.comparison);
            return false;
        }
        var comparison = OpenAPI.Method.parseVarPlaceholderData(" " + p.comparison);
        if (p.setGameVar && p.gameVar.length > 0) {
            var gameVar_1 = [];
            p.gameVar.forEach(function (v) {
                if (v.type == 0)
                    gameVar_1.push(v.gameNumber);
                if (v.type == 1)
                    gameVar_1.push(v.gameString);
                if (v.type == 2)
                    gameVar_1.push(v.gameBoolean);
            });
            comparison = OpenAPI.Method.parseGameVarPlaceholderData(comparison, gameVar_1);
        }
        var operators = [
            { regex: /(["'][^"']*["'])\s*>\s*(["'][^"']*["'])/, func: function (a, b) { return a.replace(/["']/g, '') > b.replace(/["']/g, ''); } },
            { regex: /(["'][^"']*["'])\s*<\s*(["'][^"']*["'])/, func: function (a, b) { return a.replace(/["']/g, '') < b.replace(/["']/g, ''); } },
            { regex: /(["'][^"']*["'])\s*==\s*(["'][^"']*["'])/, func: function (a, b) { return a.replace(/["']/g, '') == b.replace(/["']/g, ''); } },
            { regex: /(["'][^"']*["'])\s*!=\s*(["'][^"']*["'])/, func: function (a, b) { return a.replace(/["']/g, '') != b.replace(/["']/g, ''); } },
            { regex: /(["'][^"']*["'])\s*>=\s*(["'][^"']*["'])/, func: function (a, b) { return a.replace(/["']/g, '') >= b.replace(/["']/g, ''); } },
            { regex: /(["'][^"']*["'])\s*<=\s*(["'][^"']*["'])/, func: function (a, b) { return a.replace(/["']/g, '') <= b.replace(/["']/g, ''); } },
            { regex: /(["'][^"']*["'])\s*\!<>\s*(["'][^"']*["'])/, func: function (a, b) { return a.indexOf(b.replace(/["']/g, '')) == -1; } },
            { regex: /(["'][^"']*["'])\s*<>\s*(["'][^"']*["'])/, func: function (a, b) { return a.indexOf(b.replace(/["']/g, '')) != -1; } },
            { regex: /([\d.]+)\s*>\s*([\d.]+)/, func: function (a, b) { return a > b; } },
            { regex: /([\d.]+)\s*<\s*([\d.]+)/, func: function (a, b) { return a < b; } },
            { regex: /([\d.]+)\s*==\s*([\d.]+)/, func: function (a, b) { return a == b; } },
            { regex: /([\d.]+)\s*!=\s*([\d.]+)/, func: function (a, b) { return a != b; } },
            { regex: /([\d.]+)\s*>=\s*([\d.]+)/, func: function (a, b) { return a >= b; } },
            { regex: /([\d.]+)\s*<=\s*([\d.]+)/, func: function (a, b) { return a <= b; } },
            { regex: /(.+?)&&\s*(.+)/, func: function (a, b) { return a && b; } },
            { regex: /(.+?)\|\|\s*(.+)/, func: function (a, b) { return a || b; } },
        ];
        var data = OpenAPI.Method.evaluateComplexExpression(comparison, operators);
        if (!Config.RELEASE_GAME && p.debug)
            trace(comparison + " \u7ED3\u679C: " + data + " \u8F6C\u4E3A\u5F00\u5173\u7ED3\u679C: " + !!data);
        return !!data;
    }
    CustomCondition.f7 = f7;
})(CustomCondition || (CustomCondition = {}));
//# sourceMappingURL=ConditionalBranch.js.map