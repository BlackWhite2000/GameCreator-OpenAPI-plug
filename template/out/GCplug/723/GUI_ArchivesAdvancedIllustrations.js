














var GUI_ArchivesAdvancedIllustrations = (function (_super) {
    __extends(GUI_ArchivesAdvancedIllustrations, _super);
    function GUI_ArchivesAdvancedIllustrations() {
        var _this = _super.call(this) || this;
        GUI_AdvancedIllustrations.standardList(_this.list);
        _this.on(EventObject.DISPLAY, _this, _this.onDisplay);
        _this.list.on(UIList.ITEM_CREATE, _this, _this.onCreateItem);
        _this.fileTags.on(EventObject.CHANGE, _this, _this.refreshList);
        _this.avatarTags.on(EventObject.CHANGE, _this, _this.refreshAvatar);
        _this.on(EventObject.UNDISPLAY, _this, _this.closeClick);
        return _this;
    }
    GUI_ArchivesAdvancedIllustrations.prototype.onDisplay = function () {
        UIList.focus = this.list;
        this.title.text = GUI_ArchivesAdvancedIllustrations.IllustrationsData.name;
        this.list.setSelectedIndexForce(0);
        this.fileTags.setSelectedForce(0);
        this.avatarTags.setSelectedForce(0);
        this.avatar.visible = false;
        this.refreshCategory();
        this.refreshAvatarCategory();
        this.refreshList();
        this.refreshAvatar();
        this.setAllAvatarRead();
        this.close.on(EventObject.CLICK, this, this.closeClick);
    };
    GUI_ArchivesAdvancedIllustrations.prototype.refreshCategory = function () {
        this.fileTags.items = "";
        var arr = [];
        var tabName = WorldData.fileTags_advancedIllustrations.split(',');
        for (var i = 0; i < this.archivesCategory.length; i++) {
            if (!tabName[i])
                continue;
            var d = new ListItem_15005;
            var category = this.archivesCategory[i];
            d.data = category;
            arr.push(d);
            if (this.fileTags.items != "")
                this.fileTags.items += ",";
            this.fileTags.items += tabName[i];
        }
        this.fileTags.data = arr;
    };
    GUI_ArchivesAdvancedIllustrations.prototype.refreshAvatarCategory = function () {
        this.avatarTags.items = "";
        var arr = [];
        var tabName = WorldData.avatarTags_advancedIllustrations.split(',');
        for (var i = 0; i < this.avatarCategory.length; i++) {
            if (!tabName[i])
                continue;
            var d = new ListItem_15005;
            var category = this.avatarCategory[i];
            d.data = category;
            arr.push(d);
            if (this.avatarTags.items != "")
                this.avatarTags.items += ",";
            this.avatarTags.items += tabName[i];
        }
    };
    GUI_ArchivesAdvancedIllustrations.prototype.refreshList = function () {
        var arr = [];
        var archive = this.archivesData[this.fileTags.selectedIndex];
        var _loop_3 = function (i) {
            var d = new ListItem_15006;
            d.data = archive.archives[i];
            d.data.culeIndex = i;
            d.data.hasOwnIndex = WorldData.unlock_archives_advancedIllustrations.findIndex(function (v) { return v.actor == GUI_ArchivesAdvancedIllustrations.IllustrationsData.id && v.archive == archive.id && v.clue == i; });
            arr.push(d);
        };
        for (var i = 0; i < archive.archives.length; i++) {
            _loop_3(i);
        }
        this.list.items = arr;
    };
    GUI_ArchivesAdvancedIllustrations.prototype.refreshAvatar = function () {
        var _this = this;
        var Illustrations = GUI_ArchivesAdvancedIllustrations.IllustrationsData;
        var hasOwn = this.hasOwnAvatar();
        if (hasOwn) {
            var itemDS = GameData.getModuleData(GUI_AdvancedIllustrations.PLUGIN_MODULE_TYPE_AvatarAdvancedIllustrationsCategory, hasOwn.avatar);
            this.avatar.avatarID = itemDS.unlock || 0;
            hasOwn.isNew = false;
        }
        else {
            var itemDS = GameData.getModuleData(GUI_AdvancedIllustrations.PLUGIN_MODULE_TYPE_AvatarAdvancedIllustrationsCategory, Illustrations.avatar[this.avatarTags.selectedIndex]);
            this.avatar.avatarID = (itemDS === null || itemDS === void 0 ? void 0 : itemDS.unlocked) || 0;
        }
        setFrameout(function () {
            _this.avatar.visible = true;
        }, 1);
    };
    GUI_ArchivesAdvancedIllustrations.prototype.onCreateItem = function (ui, data, index) {
        if (!data || !data.data) {
            ui.isNew.visible = false;
            return;
        }
        ;
        var hasOwn = WorldData.unlock_archives_advancedIllustrations[data.data.hasOwnIndex];
        var archive = data.data;
        if (hasOwn) {
            ui.image.image = archive.image || '';
            ui.text.text = archive.text || '';
            ui.isNew.visible = hasOwn.isNew;
            hasOwn.isNew = false;
        }
        else {
            ui.image.image = GUI_ArchivesAdvancedIllustrations.IllustrationsData.archive_unlocked;
            ui.text.text = '';
            ui.isNew.visible = false;
        }
        ;
    };
    GUI_ArchivesAdvancedIllustrations.prototype.hasOwnAvatar = function () {
        var m = GUI_ArchivesAdvancedIllustrations.IllustrationsData.avatar[this.avatarTags.selectedIndex];
        if (!this.avatarTags || !m)
            return null;
        if (GUI_ArchivesAdvancedIllustrations.IllustrationsData.avatar.indexOf(m) == -1)
            return null;
        var avatar = WorldData.unlock_avatars_advancedIllustrations.find(function (v) { return v.actor == GUI_ArchivesAdvancedIllustrations.IllustrationsData.id && v.avatar == m; });
        return avatar;
    };
    GUI_ArchivesAdvancedIllustrations.prototype.setAllAvatarRead = function () {
        var Illustrations = GUI_ArchivesAdvancedIllustrations.IllustrationsData;
        if (!Illustrations)
            return;
        for (var i = 0; i < Illustrations.avatar.length; i++) {
            var avatar = WorldData.unlock_avatars_advancedIllustrations.filter(function (v) { return v.actor == Illustrations.id; });
            for (var j = 0; j < avatar.length; j++) {
                avatar[j].isNew = false;
            }
        }
    };
    Object.defineProperty(GUI_ArchivesAdvancedIllustrations.prototype, "archivesCategory", {
        get: function () {
            var IllustrationsData = GUI_ArchivesAdvancedIllustrations.IllustrationsData;
            if (!IllustrationsData)
                return;
            var archives = IllustrationsData.archive;
            var data = [];
            for (var i = 0; i < archives.length; i++) {
                var item = archives[i];
                var m = GameData.getModuleData(GUI_AdvancedIllustrations.PLUGIN_MODULE_TYPE_ArchivesAdvancedIllustrations, item);
                if (m) {
                    data.push({ category: m.id, cName: m.name });
                }
            }
            return data;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GUI_ArchivesAdvancedIllustrations.prototype, "selectedArchivesCategory", {
        get: function () {
            if (!this.archivesCategory)
                return 0;
            return this.archivesCategory[this.fileTags.selectedIndex].category;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GUI_ArchivesAdvancedIllustrations.prototype, "avatarCategory", {
        get: function () {
            var IllustrationsData = GUI_ArchivesAdvancedIllustrations.IllustrationsData;
            if (!IllustrationsData)
                return;
            var avatar = IllustrationsData.avatar;
            var data = [];
            for (var i = 0; i < avatar.length; i++) {
                var item = avatar[i];
                var m = GameData.getModuleData(GUI_AdvancedIllustrations.PLUGIN_MODULE_TYPE_AvatarAdvancedIllustrationsCategory, item);
                if (m) {
                    data.push({ category: m.id, cName: m.name });
                }
            }
            return data;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GUI_ArchivesAdvancedIllustrations.prototype, "archivesData", {
        get: function () {
            var IllustrationsData = GUI_ArchivesAdvancedIllustrations.IllustrationsData;
            if (!IllustrationsData)
                return;
            var archives = IllustrationsData.archive;
            var data = [];
            for (var i = 0; i < archives.length; i++) {
                var item = archives[i];
                var m = GameData.getModuleData(GUI_AdvancedIllustrations.PLUGIN_MODULE_TYPE_ArchivesAdvancedIllustrations, item);
                if (m) {
                    data.push(m);
                }
            }
            return data;
        },
        enumerable: false,
        configurable: true
    });
    GUI_ArchivesAdvancedIllustrations.prototype.closeClick = function () {
        GameUI.hide(GUI_AdvancedIllustrations.PLUGIN_GUI_ArchivesAdvancedIllustrations);
        GUI_ArchivesAdvancedIllustrations.IllustrationsData = null;
        if (GUI_ArchivesAdvancedIllustrations.isListShow) {
            GUI_ArchivesAdvancedIllustrations.isListShow = false;
            var ui = GameUI.get(GUI_AdvancedIllustrations.PLUGIN_GUI_AdvancedIllustrations);
            EventUtils.happen(GUI_AdvancedIllustrations, GUI_AdvancedIllustrations.EVENT_NEED_REFRESH);
            UIList.focus = ui.list;
        }
        if (WorldData.gSaved_advancedIllustrations) {
            SinglePlayerGame.regSaveCustomGlobalData("GUI_AdvancedIllustrations_unlock_archives_advancedIllustration", Callback.New(function () {
                return WorldData.unlock_archives_advancedIllustrations;
            }, this));
            SinglePlayerGame.regSaveCustomGlobalData("GUI_AdvancedIllustrations_unlock_avatars_advancedIllustrations", Callback.New(function () {
                return WorldData.unlock_avatars_advancedIllustrations;
            }, this));
            SinglePlayerGame.saveGlobalData(null);
        }
    };
    GUI_ArchivesAdvancedIllustrations.IllustrationsData = null;
    GUI_ArchivesAdvancedIllustrations.isListShow = false;
    return GUI_ArchivesAdvancedIllustrations;
}(GUI_15004));
//# sourceMappingURL=GUI_ArchivesAdvancedIllustrations.js.map