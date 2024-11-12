














var GUI_AdvancedIllustrations = (function (_super) {
    __extends(GUI_AdvancedIllustrations, _super);
    function GUI_AdvancedIllustrations() {
        var _this = _super.call(this) || this;
        GUI_AdvancedIllustrations.standardList(_this.list);
        _this.on(EventObject.DISPLAY, _this, _this.onDisplay);
        _this.list.on(UIList.ITEM_CLICK, _this, _this.onItemClick);
        _this.list.on(UIList.ITEM_CREATE, _this, _this.onCreateItem);
        _this.category.on(EventObject.CHANGE, _this, _this.refreshList);
        _this.closeTipBox.on(EventObject.CLICK, _this, _this.closeTipBoxClick);
        _this.close.on(EventObject.CLICK, _this, _this.closeClick);
        EventUtils.addEventListener(GUI_AdvancedIllustrations, GUI_AdvancedIllustrations.EVENT_NEED_REFRESH, Callback.New(function () {
            if (_this.stage)
                _this.refreshList();
        }, _this));
        return _this;
    }
    GUI_AdvancedIllustrations.standardList = function (list, useItemClickSe) {
        if (useItemClickSe === void 0) { useItemClickSe = true; }
        list.on(EventObject.CHANGE, this, function (list, state) {
            if (state == 0)
                list.scrollTo(list.selectedIndex, true, true, 300, Ease.strongOut);
        }, [list]);
        if (useItemClickSe) {
            list.on(UIList.ITEM_CLICK, this, function (list) {
                GameAudio.playSE(ClientWorld.data.sureSE);
            }, [list]);
        }
    };
    GUI_AdvancedIllustrations.prototype.onDisplay = function () {
        UIList.focus = this.list;
        this.tipBox.visible = false;
        this.category.visible = WorldData.isCategory_advancedIllustrations;
        this.list.setSelectedIndexForce(0);
        this.refreshCategory();
        this.refreshList();
    };
    GUI_AdvancedIllustrations.prototype.refreshCategory = function () {
        this.category.items = "";
        var arr = [];
        for (var i = 0; i < this.categoryData.length; i++) {
            var d = new ListItem_15005;
            var category = this.categoryData[i];
            d.data = category;
            arr.push(d);
            if (this.category.items != "")
                this.category.items += ",";
            this.category.items += category.cName;
        }
        this.category.data = arr;
    };
    GUI_AdvancedIllustrations.prototype.refreshList = function () {
        var arr = [];
        for (var i = 0; i < this.IllustrationsData.length; i++) {
            var d = new ListItem_15003;
            var Illustrations = this.IllustrationsData[i];
            if (WorldData.isCategory_advancedIllustrations && (this.selectedCategory != Illustrations.category && this.selectedCategory != 0))
                continue;
            d.data = Illustrations;
            arr.push(d);
        }
        this.list.items = arr;
    };
    GUI_AdvancedIllustrations.prototype.onCreateItem = function (ui, data, index) {
        if (!data || !data.data)
            return;
        var itemDS = data.data;
        var hasOwn = this.hasOwnIllustration(itemDS);
        if (hasOwn) {
            ui.image.image = itemDS.unlock;
            ui.isNew.visible = hasOwn.isNew;
        }
        else {
            ui.image.image = itemDS.unlocked;
            ui.isNew.visible = false;
        }
        ;
    };
    GUI_AdvancedIllustrations.prototype.hasOwnIllustration = function (Illustrations) {
        var archives = WorldData.unlock_archives_advancedIllustrations.find(function (v) { return v.actor == Illustrations.id; });
        if (archives)
            return archives;
        var avatars = WorldData.unlock_avatars_advancedIllustrations.find(function (v) { return v.actor == Illustrations.id; });
        if (avatars)
            return avatars;
        return null;
    };
    GUI_AdvancedIllustrations.prototype.onItemClick = function () {
        if (!this.list.selectedItem || !this.list.selectedItem.data)
            return;
        var hasOwn = this.hasOwnIllustration(this.list.selectedItem.data);
        if (hasOwn) {
            GUI_ArchivesAdvancedIllustrations.IllustrationsData = this.list.selectedItem.data;
            GUI_ArchivesAdvancedIllustrations.isListShow = true;
            GameUI.show(GUI_AdvancedIllustrations.PLUGIN_GUI_ArchivesAdvancedIllustrations);
        }
        else {
            this.tipBox.visible = true;
        }
    };
    Object.defineProperty(GUI_AdvancedIllustrations.prototype, "categoryData", {
        get: function () {
            var data = [];
            if (WorldData.categoryAll_advancedIllustrations) {
                data.push({ category: 0, cName: WorldData.categoryAll_advancedIllustrations });
            }
            for (var i = 0; i < WorldData.category_advancedIllustrations2.length; i++) {
                var category = GameData.getModuleData(GUI_AdvancedIllustrations.PLUGIN_MODULE_TYPE_AdvancedIllustrationsCategory, WorldData.category_advancedIllustrations2[i]);
                data.push({ category: category.id, cName: category.name });
            }
            return data;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GUI_AdvancedIllustrations.prototype, "selectedCategory", {
        get: function () {
            if (WorldData.isCategory_advancedIllustrations) {
                return this.categoryData[this.category.selectedIndex].category;
            }
            return 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GUI_AdvancedIllustrations.prototype, "IllustrationsData", {
        get: function () {
            var data = [];
            OpenAPI.Method.getModuleData(GUI_AdvancedIllustrations.PLUGIN_MODULE_TYPE_AdvancedIllustrations, Callback.New(function (v) {
                if (v && v.name) {
                    data.push(v);
                }
            }, this));
            return data;
        },
        enumerable: false,
        configurable: true
    });
    GUI_AdvancedIllustrations.prototype.closeTipBoxClick = function () {
        this.tipBox.visible = false;
    };
    GUI_AdvancedIllustrations.prototype.closeClick = function () {
        GameUI.hide(GUI_AdvancedIllustrations.PLUGIN_GUI_AdvancedIllustrations);
    };
    GUI_AdvancedIllustrations.PLUGIN_MODULE_TYPE_AdvancedIllustrations = 3;
    GUI_AdvancedIllustrations.PLUGIN_MODULE_TYPE_ArchivesAdvancedIllustrations = 4;
    GUI_AdvancedIllustrations.PLUGIN_MODULE_TYPE_AdvancedIllustrationsCategory = 5;
    GUI_AdvancedIllustrations.PLUGIN_MODULE_TYPE_AvatarAdvancedIllustrationsCategory = 6;
    GUI_AdvancedIllustrations.PLUGIN_GUI_AdvancedIllustrations = 15003;
    GUI_AdvancedIllustrations.PLUGIN_GUI_ArchivesAdvancedIllustrations = 15004;
    GUI_AdvancedIllustrations.EVENT_NEED_REFRESH = "GUI_AdvancedIllustrationsEVENT_NEED_REFRESH";
    return GUI_AdvancedIllustrations;
}(GUI_15003));
//# sourceMappingURL=GUI_AdvancedIllustrations.js.map