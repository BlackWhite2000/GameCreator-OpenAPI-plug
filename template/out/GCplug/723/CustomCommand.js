(function (CommandExecute) {
    function customCommand_15010(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        if (typeof OpenAPI == 'undefined' || typeof OpenAPI.System == 'undefined' || OpenAPI.System.Version < 3.5) {
            alert('【高级图鉴系统】\n本插件于 v2.0 开始需要前置插件 "OpenAPI" 支持\n请安装前置插件 "OpenAPI" 大于等于 v3.5 版本');
            return;
        }
        var monsterID = p.des;
        var monsterData = GameData.getModuleData(GUI_AdvancedIllustrations.PLUGIN_MODULE_TYPE_AdvancedIllustrations, monsterID);
        if (!monsterData) {
            return trace('【高级图鉴系统】未指定图鉴');
        }
        if (p.opt == 0) {
            if (!p.archivesNum || p.clueNum < 0) {
                return trace('【高级图鉴系统】档案或者线索参数错误');
            }
            if (WorldData.unlock_archives_advancedIllustrations.find(function (v) { return v.actor == monsterID && v.archive == p.archivesNum && v.clue == p.clueNum; }))
                return;
            var m = GameData.getModuleData(GUI_AdvancedIllustrations.PLUGIN_MODULE_TYPE_AdvancedIllustrations, p.des);
            if (m.archive.indexOf(p.archivesNum) == -1)
                return;
            var m2 = GameData.getModuleData(GUI_AdvancedIllustrations.PLUGIN_MODULE_TYPE_ArchivesAdvancedIllustrations, p.archivesNum);
            if (!m2 || m2.archives.length <= p.clueNum)
                return;
            WorldData.unlock_archives_advancedIllustrations.push({ actor: monsterID, archive: p.archivesNum, clue: p.clueNum, isNew: true });
            if (WorldData.gSaved_advancedIllustrations) {
                SinglePlayerGame.regSaveCustomGlobalData("GUI_AdvancedIllustrations_unlock_archives_advancedIllustration", Callback.New(function () {
                    return WorldData.unlock_archives_advancedIllustrations;
                }, this));
                SinglePlayerGame.saveGlobalData(null);
            }
        }
        else {
            if (!p.avatarNum) {
                return trace('【高级图鉴系统】立绘参数错误');
            }
            if (WorldData.unlock_avatars_advancedIllustrations.find(function (v) { return v.actor == monsterID && v.avatar == p.avatarNum; }))
                return;
            var m = GameData.getModuleData(GUI_AdvancedIllustrations.PLUGIN_MODULE_TYPE_AdvancedIllustrations, p.des);
            if (m.avatar.indexOf(p.avatarNum) == -1)
                return;
            WorldData.unlock_avatars_advancedIllustrations.push({ actor: monsterID, avatar: p.avatarNum, isNew: true });
            if (WorldData.gSaved_advancedIllustrations) {
                SinglePlayerGame.regSaveCustomGlobalData("GUI_AdvancedIllustrations_unlock_avatars_advancedIllustrations", Callback.New(function () {
                    return WorldData.unlock_avatars_advancedIllustrations;
                }, this));
                SinglePlayerGame.saveGlobalData(null);
            }
        }
    }
    CommandExecute.customCommand_15010 = customCommand_15010;
    function customCommand_15011(commandPage, cmd, trigger, triggerPlayer, playerInput, p) {
        if (typeof OpenAPI == 'undefined' || typeof OpenAPI.System == 'undefined' || OpenAPI.System.Version < 3.5) {
            alert('【高级图鉴系统】\n本插件于 v2.0 开始需要前置插件 "OpenAPI" 支持\n请安装前置插件 "OpenAPI" 大于等于 v3.5 版本');
            return;
        }
        var monsterID = p.des;
        var monsterData = GameData.getModuleData(GUI_AdvancedIllustrations.PLUGIN_MODULE_TYPE_AdvancedIllustrations, monsterID);
        if (!monsterData) {
            return trace('【高级图鉴系统】未指定图鉴');
        }
        if (p.event) {
            if (!WorldData.unlock_archives_advancedIllustrations.find(function (v) { return v.actor == monsterID; }) && !WorldData.unlock_avatars_advancedIllustrations.find(function (v) { return v.actor == monsterID; })) {
                GameCommand.startCommonCommand(p.event);
                return;
            }
        }
        GUI_ArchivesAdvancedIllustrations.IllustrationsData = monsterData;
        GameUI.show(GUI_AdvancedIllustrations.PLUGIN_GUI_ArchivesAdvancedIllustrations);
    }
    CommandExecute.customCommand_15011 = customCommand_15011;
})(CommandExecute || (CommandExecute = {}));
//# sourceMappingURL=CustomCommand.js.map