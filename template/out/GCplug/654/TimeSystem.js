(function (OpenAPI) {
    var TimeSystemModule = (function () {
        function TimeSystemModule() {
            this.timerDataID = -1;
            this.timerStatus = false;
            this.timerStatusID = 0;
            this.timerVarID = 0;
            this.timerTimeStamp = 0;
            this.timerTimeStampVarID = 0;
            this.timerGetDataType = 0;
        }
        TimeSystemModule.checkTimeData = function (timer, timerStatus, timerGetDataType, timerTimeStamp, timeStampVarID, timerStatusID, timerVarID, trigger) {
            if (trigger === void 0) { trigger = null; }
            if (timerStatus === false)
                return;
            timer.timerStatus = timerStatus;
            timer.timerGetDataType = timerGetDataType;
            if (timerGetDataType === 0) {
                timer.timerTimeStamp = Math.floor(Date.now() / 1000);
                checkData();
            }
            if (timerGetDataType === 2) {
                timer.timerTimeStamp = timerTimeStamp;
                checkData();
            }
            if (timerGetDataType === 1) {
                OpenAPI.ServerTimeStamp.requestTimeStamp(function (timeData) {
                    timer.timerTimeStamp = timeData.time;
                    checkData();
                }, trigger);
            }
            function checkData() {
                if (timeStampVarID) {
                    timer.timerTimeStampVarID = timeStampVarID;
                    Game.player.variable.setVariable(timeStampVarID, timer.timerTimeStamp * 1000);
                }
                if (timerStatusID) {
                    timer.timerStatusID = timerStatusID;
                    Game.player.variable.setSwitch(timerStatusID, 1);
                }
                timer.timerVarID = timerVarID;
                timer.timerIntervalIdStart();
            }
        };
        TimeSystemModule.prototype.timerIntervalIdStart = function () {
            var _this = this;
            this.checkTimerTimeStatus();
            this.timerIntervalId = setInterval(function () {
                _this.checkTimerTimeStatus();
            }, 300000);
        };
        TimeSystemModule.prototype.checkTimerTimeStatus = function () {
            var _this = this;
            if (this.timerStatus) {
                clearInterval(this.timerIncrementIntervalId);
                this.checkTimerTimeStamp();
                Game.player.variable.setString(this.timerVarID, OpenAPI.Method.timestampToDate(this.timerTimeStamp));
                this.timerIncrementIntervalId = setInterval(function () {
                    _this.checkStatus();
                    _this.updateTimerData();
                    if (!_this.timerStatus) {
                        clearInterval(_this.timerIntervalId);
                        clearInterval(_this.timerIncrementIntervalId);
                    }
                    _this.timerTimeStamp += 1;
                    Game.player.variable.setString(_this.timerVarID, OpenAPI.Method.timestampToDate(_this.timerTimeStamp));
                }, 1000);
            }
            else {
                clearInterval(this.timerIntervalId);
                clearInterval(this.timerIncrementIntervalId);
            }
        };
        TimeSystemModule.prototype.checkTimerTimeStamp = function () {
            var _this = this;
            if (this.timerGetDataType === 1) {
                OpenAPI.ServerTimeStamp.requestTimeStamp(function (timeData) {
                    _this.timerTimeStamp = timeData.time;
                });
            }
            if (this.timerGetDataType === 0)
                this.timerTimeStamp = Math.floor(Date.now() / 1000);
        };
        TimeSystemModule.prototype.checkStatus = function () {
            if (this.timerStatusID) {
                if (Game.player.variable.getSwitch(this.timerStatusID))
                    this.timerStatus = true;
                else
                    this.timerStatus = false;
            }
            if (this.timerTimeStampVarID)
                Game.player.variable.setVariable(this.timerTimeStampVarID, this.timerTimeStamp * 1000);
        };
        TimeSystemModule.prototype.updateTimerData = function (dataName) {
            if (dataName === void 0) { dataName = TimeSystemModule.TimeSystemModuleData; }
            if (this.timerDataID === -1)
                this.timerDataID = dataName.length;
            dataName[this.timerDataID] = {
                timerStatus: this.timerStatus,
                timerTimeStampVarID: this.timerTimeStampVarID,
                timerTimeStamp: this.timerTimeStamp,
                timerDataID: this.timerDataID,
                timerGetDataType: this.timerGetDataType,
                timerStatusID: this.timerStatusID,
                timerVarID: this.timerVarID,
            };
        };
        TimeSystemModule.Version = 1.3;
        TimeSystemModule.Installed = true;
        TimeSystemModule.OpenAPI_MinVersion = 2.1;
        TimeSystemModule.ServerTimeStamp_MinVersion = 1.4;
        TimeSystemModule.TimeSystemModuleData = [];
        return TimeSystemModule;
    }());
    OpenAPI.TimeSystemModule = TimeSystemModule;
})(OpenAPI || (OpenAPI = {}));
(function (CommandExecute) {
    function customCommand_15002(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        if (typeof OpenAPI == 'undefined' || typeof OpenAPI.System == 'undefined' || OpenAPI.System.Version < OpenAPI.TimeSystemModule.OpenAPI_MinVersion) {
            alert("\u3010\u65F6\u95F4\u7CFB\u7EDF\u3011\n\u8BF7\u5B89\u88C5\u524D\u7F6E\u63D2\u4EF6 \"OpenAPI\" \u5927\u4E8E\u7B49\u4E8E v" + OpenAPI.TimeSystemModule.OpenAPI_MinVersion.toFixed(1) + " \u7248\u672C\n\u5982\u9700\u4F7F\u7528\u7F51\u7EDC\u529F\u80FD, \u8BF7\u5B89\u88C5\u524D\u7F6E\u63D2\u4EF6 \"\u83B7\u53D6\u670D\u52A1\u5668\u65F6\u95F4\" \u5927\u4E8E\u7B49\u4E8E v" + OpenAPI.TimeSystemModule.ServerTimeStamp_MinVersion.toFixed(1) + " \u7248\u672C");
            return;
        }
        var typeData = ['y', 'm', 'd', 'h', 'i', 's'];
        var timeStamp;
        if (p.timeDataTypeList === 1) {
            if (typeof OpenAPI.ServerTimeStamp == 'undefined' || OpenAPI.ServerTimeStamp.Version < OpenAPI.TimeSystemModule.ServerTimeStamp_MinVersion) {
                alert("\u3010\u65F6\u95F4\u7CFB\u7EDF\u3011\n\u5982\u9700\u4F7F\u7528\u7F51\u7EDC\u529F\u80FD, \u8BF7\u5B89\u88C5\u524D\u7F6E\u63D2\u4EF6 \"\u83B7\u53D6\u670D\u52A1\u5668\u65F6\u95F4\" \u5927\u4E8E\u7B49\u4E8E v" + OpenAPI.TimeSystemModule.ServerTimeStamp_MinVersion.toFixed(1) + " \u7248\u672C");
                return;
            }
            OpenAPI.ServerTimeStamp.requestTimeStamp(function (timeData) {
                setTimeStampData(timeData.time);
            }, trigger);
        }
        if (p.timeDataTypeList === 0) {
            timeStamp = Math.floor(Date.now() / 1000);
            setTimeStampData(timeStamp);
        }
        if (p.timeDataTypeList === 2) {
            timeStamp = OpenAPI.Method.JudgeTypeConstantVariable(p.timeStamp, p.timeStampVar, p.timeStampType);
            setTimeStampData(timeStamp / 1000);
        }
        function setTimeStampData(timeStampData) {
            var data;
            if (!p.setType)
                data = OpenAPI.Method.timestampToDate(timeStampData);
            else
                data = OpenAPI.Method.timestampToDate(timeStampData, typeData[p.setTypeDataList]);
            if (!p.setType || p.isDataIndex)
                Game.player.variable.setString(p.setStr, data);
            else
                Game.player.variable.setVariable(p.setNum, Number(data));
        }
    }
    CommandExecute.customCommand_15002 = customCommand_15002;
    function customCommand_15003(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        if (typeof OpenAPI == 'undefined' || typeof OpenAPI.System == 'undefined' || OpenAPI.System.Version < OpenAPI.TimeSystemModule.OpenAPI_MinVersion) {
            alert("\u3010\u65F6\u95F4\u7CFB\u7EDF\u3011\n\u8BF7\u5B89\u88C5\u524D\u7F6E\u63D2\u4EF6 \"OpenAPI\" \u5927\u4E8E\u7B49\u4E8E v" + OpenAPI.TimeSystemModule.OpenAPI_MinVersion.toFixed(1) + " \u7248\u672C\n\u5982\u9700\u4F7F\u7528\u7F51\u7EDC\u529F\u80FD, \u8BF7\u5B89\u88C5\u524D\u7F6E\u63D2\u4EF6 \"\u83B7\u53D6\u670D\u52A1\u5668\u65F6\u95F4\" \u5927\u4E8E\u7B49\u4E8E v" + OpenAPI.TimeSystemModule.ServerTimeStamp_MinVersion.toFixed(1) + " \u7248\u672C");
            return;
        }
        if (!p.timeStamp) {
            trace('【时间系统】请指定 "输出至" 的变量');
            return;
        }
        ;
        if (p.timeDataTypeList === 1) {
            if (typeof OpenAPI.ServerTimeStamp == 'undefined' || OpenAPI.ServerTimeStamp.Version < OpenAPI.TimeSystemModule.ServerTimeStamp_MinVersion) {
                alert("\u3010\u65F6\u95F4\u7CFB\u7EDF\u3011\n\u8BF7\u5B89\u88C5\u524D\u7F6E\u63D2\u4EF6 \"\u83B7\u53D6\u670D\u52A1\u5668\u65F6\u95F4\" \u5927\u4E8E\u7B49\u4E8E v" + OpenAPI.TimeSystemModule.ServerTimeStamp_MinVersion.toFixed(1) + " \u7248\u672C");
                return;
            }
            OpenAPI.ServerTimeStamp.requestTimeStamp(function (timeData) {
                Game.player.variable.setVariable(p.timeStamp, timeData.time * 1000);
            }, trigger);
        }
        if (p.timeDataTypeList === 0)
            Game.player.variable.setVariable(p.timeStamp, Math.floor(Date.now()));
        if (p.timeDataTypeList === 2) {
            var timeData = void 0;
            var yy = OpenAPI.Method.JudgeTypeConstantVariable(p.timeNum_y, p.timeNumVar_y, p.timeNumType_y);
            var mm = OpenAPI.Method.JudgeTypeConstantVariable(p.timeNum_m, p.timeNumVar_m, p.timeNumType_m);
            var dd = OpenAPI.Method.JudgeTypeConstantVariable(p.timeNum_d, p.timeNumVar_d, p.timeNumType_d);
            var hh = OpenAPI.Method.JudgeTypeConstantVariable(p.timeNum_h, p.timeNumVar_h, p.timeNumType_h);
            var ii = OpenAPI.Method.JudgeTypeConstantVariable(p.timeNum_i, p.timeNumVar_i, p.timeNumType_i);
            var ss = OpenAPI.Method.JudgeTypeConstantVariable(p.timeNum_s, p.timeNumVar_s, p.timeNumType_s);
            if (p.isTimeType)
                timeData = yy + "/" + mm + "/" + dd + " " + hh + ":" + ii + ":" + ss;
            else
                timeData = Game.player.variable.getString(p.timeStr);
            Game.player.variable.setVariable(p.timeStamp, OpenAPI.Method.dateToTimestamp(timeData));
        }
    }
    CommandExecute.customCommand_15003 = customCommand_15003;
    function customCommand_15004(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        if (typeof OpenAPI == 'undefined' || typeof OpenAPI.System == 'undefined' || OpenAPI.System.Version < OpenAPI.TimeSystemModule.OpenAPI_MinVersion) {
            alert("\u3010\u65F6\u95F4\u7CFB\u7EDF\u3011\n\u8BF7\u5B89\u88C5\u524D\u7F6E\u63D2\u4EF6 \"OpenAPI\" \u5927\u4E8E\u7B49\u4E8E v" + OpenAPI.TimeSystemModule.OpenAPI_MinVersion.toFixed(1) + " \u7248\u672C\n\u5982\u9700\u4F7F\u7528\u7F51\u7EDC\u529F\u80FD, \u8BF7\u5B89\u88C5\u524D\u7F6E\u63D2\u4EF6 \"\u83B7\u53D6\u670D\u52A1\u5668\u65F6\u95F4\" \u5927\u4E8E\u7B49\u4E8E v" + OpenAPI.TimeSystemModule.ServerTimeStamp_MinVersion.toFixed(1) + " \u7248\u672C");
            return;
        }
        if (!p.setTime) {
            trace('【时间系统】请指定 "输出至" 的变量');
            return;
        }
        ;
        var timer = new OpenAPI.TimeSystemModule();
        var timerTimeStamp;
        if (p.timeDataTypeList === 1) {
            if (typeof OpenAPI.ServerTimeStamp == 'undefined' || OpenAPI.ServerTimeStamp.Version < OpenAPI.TimeSystemModule.ServerTimeStamp_MinVersion) {
                alert("\u3010\u65F6\u95F4\u7CFB\u7EDF\u3011\n\u8BF7\u5B89\u88C5\u524D\u7F6E\u63D2\u4EF6 \"\u83B7\u53D6\u670D\u52A1\u5668\u65F6\u95F4\" \u5927\u4E8E\u7B49\u4E8E v" + OpenAPI.TimeSystemModule.ServerTimeStamp_MinVersion.toFixed(1) + " \u7248\u672C");
                return;
            }
            timerTimeStamp = Math.floor(Date.now() / 1000);
            OpenAPI.TimeSystemModule.checkTimeData(timer, true, p.timeDataTypeList, 0, p.setTimeStamp, p.timeGetStatus, p.setTime);
        }
        if (p.timeDataTypeList === 0) {
            timerTimeStamp = Math.floor(Date.now() / 1000);
            OpenAPI.TimeSystemModule.checkTimeData(timer, true, p.timeDataTypeList, timerTimeStamp, p.setTimeStamp, p.timeGetStatus, p.setTime);
        }
        if (p.timeDataTypeList === 2) {
            var yy = OpenAPI.Method.JudgeTypeConstantVariable(p.timeNum_y, p.timeNumVar_y, p.timeNumType_y);
            var mm = OpenAPI.Method.JudgeTypeConstantVariable(p.timeNum_m, p.timeNumVar_m, p.timeNumType_m);
            var dd = OpenAPI.Method.JudgeTypeConstantVariable(p.timeNum_d, p.timeNumVar_d, p.timeNumType_d);
            var hh = OpenAPI.Method.JudgeTypeConstantVariable(p.timeNum_h, p.timeNumVar_h, p.timeNumType_h);
            var ii = OpenAPI.Method.JudgeTypeConstantVariable(p.timeNum_i, p.timeNumVar_i, p.timeNumType_i);
            var ss = OpenAPI.Method.JudgeTypeConstantVariable(p.timeNum_s, p.timeNumVar_s, p.timeNumType_s);
            var timeData = yy + "/" + mm + "/" + dd + " " + hh + ":" + ii + ":" + ss;
            timerTimeStamp = OpenAPI.Method.dateToTimestamp(timeData) / 1000;
            OpenAPI.TimeSystemModule.checkTimeData(timer, true, p.timeDataTypeList, timerTimeStamp, p.setTimeStamp, p.timeGetStatus, p.setTime);
        }
    }
    CommandExecute.customCommand_15004 = customCommand_15004;
})(CommandExecute || (CommandExecute = {}));
SinglePlayerGame.regSaveCustomData('OpenAPI_TimeSystemModule_Data', Callback.New(function () {
    return OpenAPI.TimeSystemModule.TimeSystemModuleData;
}, null));
EventUtils.addEventListenerFunction(SinglePlayerGame, SinglePlayerGame.EVENT_ON_AFTER_RECOVERY_DATA, function (trigger) {
    var data = SinglePlayerGame.getSaveCustomData('OpenAPI_TimeSystemModule_Data');
    for (var i = 0; i < data.length; i++) {
        var timer = new OpenAPI.TimeSystemModule();
        var _data = data[i];
        OpenAPI.TimeSystemModule.checkTimeData(timer, _data.timerStatus, _data.timerGetDataType, _data.timerTimeStamp, _data.timerTimeStampVarID, _data.timerStatusID, _data.timerVarID);
    }
}, null);
//# sourceMappingURL=TimeSystem.js.map