(function (OpenAPI) {
    var ServerTimeStamp = (function () {
        function ServerTimeStamp() {
        }
        ServerTimeStamp.requestTimeStamp = function (timeData, trigger) {
            if (trigger === void 0) { trigger = null; }
            var ur = new HttpRequest();
            ur.send(WorldData.timeApi_yyvhc, JSON.stringify(null), "get", "json", ["Content-Type", "application/json"]);
            if (trigger) {
                trigger.pause = true;
                trigger.offset(1);
            }
            ur.once(EventObject.COMPLETE, this, function (content) {
                if (content.type != 0) {
                    trace(content.text);
                }
                timeData(content);
                if (trigger) {
                    CommandPage.executeEvent(trigger);
                }
            });
            ur.once(EventObject.ERROR, this, function (content) {
                trace("【获取服务器时间】请求服务器时间戳错误，请检查api或网络");
                if (trigger) {
                    CommandPage.executeEvent(trigger);
                }
            });
        };
        ServerTimeStamp.Version = 1.5;
        ServerTimeStamp.Installed = true;
        ServerTimeStamp.OpenAPI_MinVersion = 2.1;
        return ServerTimeStamp;
    }());
    OpenAPI.ServerTimeStamp = ServerTimeStamp;
})(OpenAPI || (OpenAPI = {}));
(function (CommandExecute) {
    function customCommand_15001(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        if (typeof OpenAPI == 'undefined' || typeof OpenAPI.System == 'undefined' || OpenAPI.System.Version < OpenAPI.ServerTimeStamp.OpenAPI_MinVersion) {
            alert("\u3010\u83B7\u53D6\u670D\u52A1\u5668\u65F6\u95F4\u3011\n\u672C\u63D2\u4EF6\u4E8E v1.4 \u5F00\u59CB\u9700\u8981\u524D\u7F6E\u63D2\u4EF6 \"OpenAPI\" \u652F\u6301\n\u8BF7\u5B89\u88C5\u524D\u7F6E\u63D2\u4EF6 \"OpenAPI\" \u5927\u4E8E\u7B49\u4E8E v" + OpenAPI.ServerTimeStamp.OpenAPI_MinVersion.toFixed(1) + " \u7248\u672C");
            return;
        }
        OpenAPI.ServerTimeStamp.requestTimeStamp(function (timeData) {
            if (p.yy)
                Game.player.variable.setVariable(p.yyVar, Number(OpenAPI.Method.timestampToDate(timeData.time, 'y')));
            if (p.mm)
                Game.player.variable.setVariable(p.mmVar, Number(OpenAPI.Method.timestampToDate(timeData.time, 'm')));
            if (p.dd)
                Game.player.variable.setVariable(p.ddVar, Number(OpenAPI.Method.timestampToDate(timeData.time, 'd')));
            if (p.hh)
                Game.player.variable.setVariable(p.hhVar, Number(OpenAPI.Method.timestampToDate(timeData.time, 'h')));
            if (p.min)
                Game.player.variable.setVariable(p.minVar, Number(OpenAPI.Method.timestampToDate(timeData.time, 'i')));
            if (p.ss)
                Game.player.variable.setVariable(p.ssVar, Number(OpenAPI.Method.timestampToDate(timeData.time, 's')));
            if (p.ret)
                Game.player.variable.setSwitch(p.retVar, 1);
        }, trigger);
    }
    CommandExecute.customCommand_15001 = customCommand_15001;
})(CommandExecute || (CommandExecute = {}));
//# sourceMappingURL=ServerTimeStamp.js.map