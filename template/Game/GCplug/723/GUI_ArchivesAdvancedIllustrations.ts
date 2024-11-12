class GUI_ArchivesAdvancedIllustrations extends GUI_15004 {
    static IllustrationsData: Module_advancedIllustrations | null = null
    static isListShow: boolean = false
    /**
     * 构造函数
     */
    constructor() {
        super();
        // 标准化
        GUI_AdvancedIllustrations.standardList(this.list);
        // 监听：界面显示时事件
        this.on(EventObject.DISPLAY, this, this.onDisplay);
        this.list.on(UIList.ITEM_CREATE, this, this.onCreateItem);
        this.fileTags.on(EventObject.CHANGE, this, this.refreshList);
        this.avatarTags.on(EventObject.CHANGE, this, this.refreshAvatar);
        this.on(EventObject.UNDISPLAY, this, this.closeClick);
    }

    /**
    * 当显示时：产生焦点，刷新列表
    */
    private onDisplay() {
        UIList.focus = this.list;
        this.title.text = GUI_ArchivesAdvancedIllustrations.IllustrationsData.name
        this.list.setSelectedIndexForce(0);
        this.fileTags.setSelectedForce(0)
        this.avatarTags.setSelectedForce(0)
        this.avatar.visible = false
        this.refreshCategory();
        this.refreshAvatarCategory();
        this.refreshList();
        this.refreshAvatar();
        this.setAllAvatarRead()
        this.close.on(EventObject.CLICK, this, this.closeClick);
    }


    /**
     * 刷新图鉴档案分类
     */
    private refreshCategory() {
        this.fileTags.items = ""
        const arr = []
        const tabName = WorldData.fileTags_advancedIllustrations.split(',')
        for (let i = 0; i < this.archivesCategory.length; i++) {
            if (!tabName[i]) continue
            const d = new ListItem_15005;
            const category = this.archivesCategory[i];
            d.data = category;
            arr.push(d);
            if (this.fileTags.items != "")
                this.fileTags.items += `,`;
            this.fileTags.items += tabName[i]
        }
        this.fileTags.data = arr;
    }

    /**
     * 刷新图鉴立绘分类
     */
    private refreshAvatarCategory() {
        this.avatarTags.items = ""
        const arr = []
        const tabName = WorldData.avatarTags_advancedIllustrations.split(',')
        for (let i = 0; i < this.avatarCategory.length; i++) {
            if (!tabName[i]) continue
            const d = new ListItem_15005;
            const category = this.avatarCategory[i];
            d.data = category;
            arr.push(d);
            if (this.avatarTags.items != "")
                this.avatarTags.items += `,`;
            this.avatarTags.items += tabName[i]
        }
    }

    /**
     * 刷新图鉴档案线索列表
     */
    private refreshList() {
        const arr = [] as ListItem_15006[];
        const archive = this.archivesData[this.fileTags.selectedIndex]
        for (let i = 0; i < archive.archives.length; i++) {
            const d = new ListItem_15006;
            d.data = archive.archives[i];
            d.data.culeIndex = i
            d.data.hasOwnIndex = WorldData.unlock_archives_advancedIllustrations.findIndex(v => v.actor == GUI_ArchivesAdvancedIllustrations.IllustrationsData.id && v.archive == archive.id && v.clue == i)
            arr.push(d);
        }
        this.list.items = arr;
    }

    /**
     * 刷新图鉴立绘
     */
    private refreshAvatar() {
        const Illustrations = GUI_ArchivesAdvancedIllustrations.IllustrationsData
        const hasOwn = this.hasOwnAvatar()
        if (hasOwn) {
            const itemDS = GameData.getModuleData(GUI_AdvancedIllustrations.PLUGIN_MODULE_TYPE_AvatarAdvancedIllustrationsCategory, hasOwn.avatar) as Module_avatar_advancedIllustrations
            this.avatar.avatarID = itemDS.unlock || 0
            hasOwn.isNew = false
        } else {
            const itemDS = GameData.getModuleData(GUI_AdvancedIllustrations.PLUGIN_MODULE_TYPE_AvatarAdvancedIllustrationsCategory, Illustrations.avatar[this.avatarTags.selectedIndex]) as Module_avatar_advancedIllustrations
            this.avatar.avatarID = itemDS?.unlocked || 0
        }
        setFrameout(() => {
            this.avatar.visible = true
        }, 1)
    }

    /**
     * 创建时
     */
    private onCreateItem(ui: GUI_15006, data: ListItem_15006, index: number) {
        if (!data || !data.data) {
            ui.isNew.visible = false;
            return
        };
        const hasOwn = WorldData.unlock_archives_advancedIllustrations[data.data.hasOwnIndex]
        const archive = data.data as DataStructure_clues_advancedIllustrations
        if (hasOwn) {
            ui.image.image = archive.image || ''
            ui.text.text = archive.text || ''
            ui.isNew.visible = hasOwn.isNew;
            hasOwn.isNew = false
        } else {
            ui.image.image = GUI_ArchivesAdvancedIllustrations.IllustrationsData.archive_unlocked
            ui.text.text = ''
            ui.isNew.visible = false;
        };
    }

    /**
     * 查询是否解锁立绘
     */
    private hasOwnAvatar(): DataStructure_unlock_avatar_advancedIllustrations {
        const m = GUI_ArchivesAdvancedIllustrations.IllustrationsData.avatar[this.avatarTags.selectedIndex]
        if (!this.avatarTags || !m) return null
        if (GUI_ArchivesAdvancedIllustrations.IllustrationsData.avatar.indexOf(m) == -1) return null
        const avatar = WorldData.unlock_avatars_advancedIllustrations.find(v => v.actor == GUI_ArchivesAdvancedIllustrations.IllustrationsData.id && v.avatar == m)
        return avatar;
    }

    /**
     * 将立绘都设为已读
     */
    private setAllAvatarRead() {
        const Illustrations = GUI_ArchivesAdvancedIllustrations.IllustrationsData
        if (!Illustrations) return
        for (let i = 0; i < Illustrations.avatar.length; i++) {
            const avatar = WorldData.unlock_avatars_advancedIllustrations.filter(v => v.actor == Illustrations.id)
            for (let j = 0; j < avatar.length; j++) {
                avatar[j].isNew = false
            }
        }
    }

    /**
     * 获取图鉴档案分类
     */
    private get archivesCategory(): { category: number, cName: string }[] | null {
        const IllustrationsData = GUI_ArchivesAdvancedIllustrations.IllustrationsData
        if (!IllustrationsData) return
        const archives = IllustrationsData.archive
        const data = []
        for (let i = 0; i < archives.length; i++) {
            const item = archives[i]
            const m = GameData.getModuleData(GUI_AdvancedIllustrations.PLUGIN_MODULE_TYPE_ArchivesAdvancedIllustrations, item)
            if (m) {
                data.push({ category: m.id, cName: m.name })
            }
        }
        return data
    }

    /**
     * 获取当前选中的档案分类
     */
    private get selectedArchivesCategory(): number {
        if (!this.archivesCategory) return 0
        return this.archivesCategory[this.fileTags.selectedIndex].category
    }

    /**
     * 获取图鉴立绘分类
     */
    private get avatarCategory(): { category: number, cName: string }[] | null {
        const IllustrationsData = GUI_ArchivesAdvancedIllustrations.IllustrationsData
        if (!IllustrationsData) return
        const avatar = IllustrationsData.avatar
        const data = []
        for (let i = 0; i < avatar.length; i++) {
            const item = avatar[i]
            const m = GameData.getModuleData(GUI_AdvancedIllustrations.PLUGIN_MODULE_TYPE_AvatarAdvancedIllustrationsCategory, item)
            if (m) {
                data.push({ category: m.id, cName: m.name })
            }
        }
        return data
    }

    /**
     * 获取图鉴档案的数据源
     */
    private get archivesData(): Module_archives_advancedIllustrations[] | null {
        const IllustrationsData = GUI_ArchivesAdvancedIllustrations.IllustrationsData
        if (!IllustrationsData) return
        const archives = IllustrationsData.archive
        const data: Module_archives_advancedIllustrations[] = []
        for (let i = 0; i < archives.length; i++) {
            const item = archives[i]
            const m = GameData.getModuleData(GUI_AdvancedIllustrations.PLUGIN_MODULE_TYPE_ArchivesAdvancedIllustrations, item)
            if (m) {
                data.push(m)
            }
        }
        return data
    }

    private closeClick() {
        GameUI.hide(GUI_AdvancedIllustrations.PLUGIN_GUI_ArchivesAdvancedIllustrations)
        GUI_ArchivesAdvancedIllustrations.IllustrationsData = null
        if (GUI_ArchivesAdvancedIllustrations.isListShow) {
            GUI_ArchivesAdvancedIllustrations.isListShow = false
            const ui = GameUI.get(GUI_AdvancedIllustrations.PLUGIN_GUI_AdvancedIllustrations) as GUI_AdvancedIllustrations
            EventUtils.happen(GUI_AdvancedIllustrations, GUI_AdvancedIllustrations.EVENT_NEED_REFRESH)
            UIList.focus = ui.list
        }
        if (WorldData.gSaved_advancedIllustrations) {
            SinglePlayerGame.regSaveCustomGlobalData("GUI_AdvancedIllustrations_unlock_archives_advancedIllustration", Callback.New(() => {
                return WorldData.unlock_archives_advancedIllustrations;
            }, this));
            SinglePlayerGame.regSaveCustomGlobalData("GUI_AdvancedIllustrations_unlock_avatars_advancedIllustrations", Callback.New(() => {
                return WorldData.unlock_avatars_advancedIllustrations;
            }, this));
            // 立刻储存全局数据（与存档无关）
            SinglePlayerGame.saveGlobalData(null);
        }
    }
}