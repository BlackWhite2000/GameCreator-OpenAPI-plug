class GUI_AdvancedIllustrations extends GUI_15003 {
    /**
     * 图鉴信息模块
     */
    static PLUGIN_MODULE_TYPE_AdvancedIllustrations: number = 3;
    /**
     * 图鉴档案模块
     */
    static PLUGIN_MODULE_TYPE_ArchivesAdvancedIllustrations: number = 4;
    /**
     * 图鉴分类模块
     */
    static PLUGIN_MODULE_TYPE_AdvancedIllustrationsCategory: number = 5;
    /**
     * 图鉴立绘模块
     */
    static PLUGIN_MODULE_TYPE_AvatarAdvancedIllustrationsCategory: number = 6;
    /**
     * 高级图鉴界面
     */
    static PLUGIN_GUI_AdvancedIllustrations: number = 15003;
    /**
     * 图鉴信息界面
     */
    static PLUGIN_GUI_ArchivesAdvancedIllustrations: number = 15004;
    /**
    * 事件：需要刷新的标记
    */
    static EVENT_NEED_REFRESH: string = "GUI_AdvancedIllustrationsEVENT_NEED_REFRESH";
    /**
    * 构造函数
    */
    constructor() {
        super();
        // 标准化
        GUI_AdvancedIllustrations.standardList(this.list);
        // 监听：界面显示时事件
        this.on(EventObject.DISPLAY, this, this.onDisplay);
        // 事件监听：当项选中时
        this.list.on(UIList.ITEM_CLICK, this, this.onItemClick);
        this.list.on(UIList.ITEM_CREATE, this, this.onCreateItem);
        this.category.on(EventObject.CHANGE, this, this.refreshList);
        // 事件监听：提示框点击
        this.closeTipBox.on(EventObject.CLICK, this, this.closeTipBoxClick);
        this.close.on(EventObject.CLICK, this, this.closeClick);
        // 监听：解锁图鉴事件
        EventUtils.addEventListener(GUI_AdvancedIllustrations, GUI_AdvancedIllustrations.EVENT_NEED_REFRESH, Callback.New(() => {
            if (this.stage) this.refreshList();
        }, this));
    }

    //------------------------------------------------------------------------------------------------------
    // 标准化组件
    //------------------------------------------------------------------------------------------------------
    /**
     * 标准化列表LIST
     * -- 键位滚动至可见区域
     */
    static standardList(list: UIList, useItemClickSe: boolean = true): void {
        list.on(EventObject.CHANGE, this, (list: UIList, state: number) => {
            if (state == 0) list.scrollTo(list.selectedIndex, true, true, 300, Ease.strongOut);
        }, [list]);
        if (useItemClickSe) {
            list.on(UIList.ITEM_CLICK, this, (list: UIList) => {
                GameAudio.playSE(ClientWorld.data.sureSE);
            }, [list]);
        }
    }

    /**
    * 当显示时：产生焦点，刷新列表
    */
    private onDisplay() {
        UIList.focus = this.list;
        this.tipBox.visible = false;
        this.category.visible = WorldData.isCategory_advancedIllustrations;
        this.list.setSelectedIndexForce(0);
        this.refreshCategory();
        this.refreshList();
    }

    /**
     * 刷新图鉴分类
     */
    private refreshCategory() {
        this.category.items = ""
        const arr = []
        for (let i = 0; i < this.categoryData.length; i++) {
            const d = new ListItem_15005;
            const category = this.categoryData[i];
            d.data = category;
            arr.push(d);
            if (this.category.items != "")
                this.category.items += `,`;
            this.category.items += category.cName
        }
        this.category.data = arr;
    }

    /**
     * 刷新图鉴列表
     */
    private refreshList() {
        const arr = [] as ListItem_15003[];
        for (let i = 0; i < this.IllustrationsData.length; i++) {
            const d = new ListItem_15003;
            const Illustrations = this.IllustrationsData[i];
            if (WorldData.isCategory_advancedIllustrations && (this.selectedCategory != Illustrations.category && this.selectedCategory != 0)) continue;
            d.data = Illustrations;
            arr.push(d);
        }
        this.list.items = arr;
    }

    /**
     * 创建时
     */
    private onCreateItem(ui: GUI_15005, data: ListItem_15005, index: number) {
        if (!data || !data.data) return;
        const itemDS = data.data as Module_advancedIllustrations
        // 是否解锁
        const hasOwn = this.hasOwnIllustration(itemDS);
        if (hasOwn) {
            ui.image.image = itemDS.unlock
            ui.isNew.visible = hasOwn.isNew;
        } else {
            ui.image.image = itemDS.unlocked
            ui.isNew.visible = false;
        };
    }

    /**
     * 查询是否解锁图鉴
     */
    private hasOwnIllustration(Illustrations: Module_advancedIllustrations): DataStructure_unlock_archive_advancedIllustrations | DataStructure_unlock_avatar_advancedIllustrations {
        // 查询是否解锁档案
        const archives = WorldData.unlock_archives_advancedIllustrations.find(v => v.actor == Illustrations.id)
        if (archives) return archives;
        // 查询是否解锁立绘
        const avatars = WorldData.unlock_avatars_advancedIllustrations.find(v => v.actor == Illustrations.id)
        if (avatars) return avatars;
        return null;
    }

    /**
     * 列表点击事件
    */
    private onItemClick() {
        if (!this.list.selectedItem || !this.list.selectedItem.data) return;
        const hasOwn = this.hasOwnIllustration(this.list.selectedItem.data);
        if (hasOwn) {
            GUI_ArchivesAdvancedIllustrations.IllustrationsData = this.list.selectedItem.data;
            GUI_ArchivesAdvancedIllustrations.isListShow = true;
            GameUI.show(GUI_AdvancedIllustrations.PLUGIN_GUI_ArchivesAdvancedIllustrations);
        } else {
            this.tipBox.visible = true;
        }
    }

    /**
     * 获取图鉴分类数据源
     */
    private get categoryData(): { category: number, cName: string }[] {
        const data = [] as { category: number, cName: string }[];
        if (WorldData.categoryAll_advancedIllustrations) {
            data.push({ category: 0, cName: WorldData.categoryAll_advancedIllustrations });
        }
        for (let i = 0; i < WorldData.category_advancedIllustrations2.length; i++) {
            const category = GameData.getModuleData(GUI_AdvancedIllustrations.PLUGIN_MODULE_TYPE_AdvancedIllustrationsCategory, WorldData.category_advancedIllustrations2[i]) as Module_category_advancedIllustrations;
            data.push({ category: category.id, cName: category.name });
        }
        return data;
    }

    /**
     * 获取当前选中的分类，如果启用的话
     */
    private get selectedCategory(): number {
        if (WorldData.isCategory_advancedIllustrations) {
            return this.categoryData[this.category.selectedIndex].category;
        }
        return 0;
    }

    /**
     * 获取图鉴模块数据
     */
    private get IllustrationsData(): Module_advancedIllustrations[] {
        const data = [] as Module_advancedIllustrations[]
        OpenAPI.Method.getModuleData(GUI_AdvancedIllustrations.PLUGIN_MODULE_TYPE_AdvancedIllustrations, Callback.New((v: Module_advancedIllustrations) => {
            if (v && v.name) {
                data.push(v);
            }
        }, this));
        return data;
    }


    /**
     * 提示框点击事件
    */
    private closeTipBoxClick() {
        this.tipBox.visible = false;
    }

    private closeClick() {
        GameUI.hide(GUI_AdvancedIllustrations.PLUGIN_GUI_AdvancedIllustrations)
    }

}