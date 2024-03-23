/**
 * steam SDK
 * Created by Karson.DS on 2024-03-17 10:15:09.
 */
class SteamSDK {
    static isInitSuccess = false;
    static steamSdk: any; // 来自 greenworks 的SDK
    static safeCode: number;
    /**
     * 验证模式 0-无 1-弹出提示后关闭 2-静默数分钟后自动闪退
     */
    private static validationMode: number;
    private static validationPrompt: string;
    /**
     * 初始化
     * @param validationMode 验证模式
     * @param validationPrompt 验证提示
     */
    static init(validationMode: number, validationPrompt: string = ``): boolean {
        SteamSDK.validationMode = validationMode;
        SteamSDK.validationPrompt = validationPrompt;
        if (os.inGC()) {
            return false;
        }
        //@ts-ignore
        if (typeof require == "undefined") {
            return false;
        }
        try {
            //@ts-ignore
            var sdkPath = FileUtils.nativePath + '/asset/greenworks/greenworks';
            //@ts-ignore
            SteamSDK.steamSdk = require(sdkPath);
            SteamSDK.isInitSuccess = SteamSDK.steamSdk.init();
        }
        catch (e) {
            SteamSDK.safeCode = 2345;
            this.safeTest();
            return false;
        }
        if (!SteamSDK.isInitSuccess) {
            SteamSDK.safeCode = 2346;
            this.safeTest();
            return false;
        }
        //@ts-ignore
        if (!SteamSDK.isSubscribedApp()) {
            SteamSDK.safeCode = 2347;
            this.safeTest();
            return false;
        }
        return true;
    }
    /**
    * 安全测试
    */
    static safeTest(): boolean {
        let code = SteamSDK.safeCode;
        if (code == 2345 || code == 2346) {
            alert(`please run steam !`);
            window.close();
            return false;
        }
        else if (code == 2347) {
            if (SteamSDK.validationMode == 1) {
                alert(SteamSDK.validationPrompt);
                window.close();
            }
            else if (SteamSDK.validationMode == 2) {
                var rd = Math.floor(Math.random() * 1000 * 60 * 5) + 1000 * 60 * 2;
                setTimeout(function () {
                    window.close();
                }, rd);
            }
            return false;
        }
        return true;
    }
    /**
     * 检测是否购买本体
     * @returns 
     */
    static isSubscribedApp(): boolean {
        if (!SteamSDK.isInitSuccess)
            return false;
        var appid = SteamSDK.steamSdk.getAppId();
        return SteamSDK.steamSdk.isSubscribedApp(appid);
    }
    /**
     * 获取用户唯一Steam标识
     * @returns 
     */
    static getUserSteamID(): string {
        if (!SteamSDK.isInitSuccess) {
            return null;
        }
        return SteamSDK.steamSdk.getSteamId().steamId;
    }
    /**
     * 检查steam是否正在运行
     * @returns 
     */
    static isSteamRunning(): boolean {
        if (!SteamSDK.isInitSuccess) {
            return false;
        }
        return SteamSDK.steamSdk.isSteamRunning();
    }
    /**
     * 通过 IP 地址位置返回国家代码
     * @returns 如（"CN"）
     */
    static getIPCountry(): string {
        if (!SteamSDK.isInitSuccess) {
            return null;
        }
        return SteamSDK.steamSdk.getIPCountry();
    }
    //------------------------------------------------------------------------------------------------------
    // 成就
    //------------------------------------------------------------------------------------------------------
    /**
    * 激活成就
    * @param achievement 成就标识
    * @param onSuccess 成功回调 
    * @param onError 失败回调
    */
    static activateAchievement(achievement: string, onSuccess: Function, onError: Function = null) {
        if (!SteamSDK.isInitSuccess) {
            onError && onError.apply(SteamSDK);
            return;
        }
        var steamIDInfo = SteamSDK.steamSdk.getSteamId();
        if (steamIDInfo) {
            //激活成功就
            SteamSDK.steamSdk.activateAchievement(achievement, () => {
                onSuccess && onSuccess.apply(SteamSDK);
            }, () => {
                onError && onError.apply(SteamSDK);
            });
        } else {
            onError && onError.apply(SteamSDK);
        }
    }
    /**
     * 获取成就信息
     * @param achievement 成就标识
     * @param onSuccess 成功回调 onSuccess(is_achieved :boolean); 成就是否实现
     * @param onError  [可选] 默认值=null 失败回调
     */
    static getAchievement(achievement: string, onSuccess: Function, onError: Function = null) {
        if (!SteamSDK.isInitSuccess) {
            onError && onError.apply(SteamSDK);
            return;
        }
        var steamIDInfo = SteamSDK.steamSdk.getSteamId();
        if (steamIDInfo) {
            //激活成功就
            SteamSDK.steamSdk.getAchievement(achievement, (is_achieved: boolean) => {
                onSuccess && onSuccess.apply(SteamSDK, [is_achieved]);
            }, () => {
                onError && onError.apply(SteamSDK);
            });
        } else {
            onError && onError.apply(SteamSDK);
        }
    }
    /**
     * 清理成就
     * @param achievement 成就标识
     * @param onSuccess 
     * @param onError [可选] 默认值=null 
     */
    static clearAchievement(achievement: string, onSuccess: Function, onError: Function = null) {
        if (!SteamSDK.isInitSuccess) {
            onError && onError.apply(SteamSDK);
            return;
        }
        var steamIDInfo = SteamSDK.steamSdk.getSteamId();
        if (steamIDInfo) {
            //删除成功就
            SteamSDK.steamSdk.clearAchievement(achievement, () => {
                onSuccess && onSuccess.apply(SteamSDK);
            }, () => {
                onError && onError.apply(SteamSDK);
            });
        } else {
            onError && onError.apply(SteamSDK);
        }
    }
    /**
     * 获得应用的所有成就名称
     * @returns 
     */
    static getAchievementNames() {
        if (!SteamSDK.isInitSuccess) {
            return "";
        }
        return SteamSDK.steamSdk.getAchievementNames();
    }
    /**
     * 获得当前steam界面的语言
     * @returns 
     */
    static getSteamUILanguage() {
        if (!SteamSDK.isInitSuccess) {
            return "";
        }
        return SteamSDK.steamSdk.getCurrentUILanguage();
    }
    //------------------------------------------------------------------------------------------------------
    // DLC
    //------------------------------------------------------------------------------------------------------
    /**
     * 获取当前应用的 DLC 数量
     * @returns 
     */
    static getDLCCount(): number {
        if (!SteamSDK.isInitSuccess) {
            return 0;
        }
        return SteamSDK.steamSdk.getDLCCount();
    }
    /**
     * 按索引返回 DLC 元数据
     * @param index 索引
     */
    static getDLCDataByIndex(index: number) {
        if (!SteamSDK.isInitSuccess) {
            return null;
        }
        return SteamSDK.steamSdk.getDLCDataByIndex(index);
    }
    /**
     * 检查用户是否拥有特定 DLC 且该 DLC 已安装
     * @param dlcID 要检查的 DLC 的 AppID
     */
    static isDLCInstalled(dlcID: number): boolean {
        if (!SteamSDK.isInitSuccess) {
            return false;
        }
        return SteamSDK.steamSdk.isDLCInstalled(dlcID);
    }
    /**
    * 检查用户是否拥有特定 DLC（无论是否安装）
    * @param dlcID 要检查的 DLC 的 AppID
    */
    static isDLCOwned(dlcID: number): boolean {
        if (!SteamSDK.isInitSuccess) {
            return false;
        }
        var len = SteamSDK.steamSdk.getDLCCount();
        for (var i = 0; i < len; i++) {
            var data = SteamSDK.steamSdk.getDLCDataByIndex(i);
            if (data && data.available && data.appId == dlcID) return true;
        }
        return false;
    }
    /**
     * 安装可选的 DLC
     * @param dlcID 要安装的 DLC 的AppID
     * @returns 
     */
    static installDLC(dlcID: number) {
        if (!SteamSDK.isInitSuccess) {
            return;
        }
        SteamSDK.steamSdk.installDLC(dlcID);
    }
    /**
     * 卸载可选的 DLC
     * @param dlcID 要卸载的 DLC 的AppID
     * @returns 
     */
    static uninstallDLC(dlcID: number) {
        if (!SteamSDK.isInitSuccess) {
            return;
        }
        SteamSDK.steamSdk.uninstallDLC(dlcID);
    }
}
//------------------------------------------------------------------------------------------------------
// 可视化支持
//------------------------------------------------------------------------------------------------------
module CustomGameNumber {
    /**
     * 获取DLC总数
     */
    export function f10(trigger: CommandTrigger, p: CustomGameNumberParams_10): number {
        switch (p.type) {
            case 0:
                return SteamSDK.getDLCCount();
        }
        return 0;
    }
}
module CustomGameString {
    export function f8(trigger: CommandTrigger, p: CustomGameStringParams_8): string {
        switch (p.type) {
            case 0:
                return SteamSDK.getUserSteamID();
            case 1:
                return SteamSDK.getIPCountry();
            case 2:
                return SteamSDK.getSteamUILanguage();
        }
        return "";
    }
}
module CustomCondition {
    export function f7(trigger: CommandTrigger, p: CustomConditionParams_7): boolean {
        switch (p.type) {
            case 0:
                return SteamSDK.isSubscribedApp();
            case 1:
                return SteamSDK.isSteamRunning();
            case 2:
                return SteamSDK.isDLCInstalled(p.dlcID);
            case 3:
                return SteamSDK.isDLCOwned(p.dlcID);
        }
        return false;
    }
}
module CommandExecute {
    export function customCommand_15006(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_15006): void {
        SteamSDK.init(cp.validationMode, cp.validationPrompt);
    }
    export function customCommand_15007(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_15007): void {
        SteamSDK.installDLC(cp.dlc);
    }
    export function customCommand_15008(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_15008): void {
        SteamSDK.uninstallDLC(cp.dlc);
    }
    export function customCommand_15009(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_15009): void {
        SteamSDK.activateAchievement(cp.achieveID, () => {
            if (cp.onSuccess) CommandPage.startTriggerFragmentEvent(cp.onSuccess, Game.player.sceneObject, Game.player.sceneObject);
        }, () => {
            if (cp.onFail) CommandPage.startTriggerFragmentEvent(cp.onFail, Game.player.sceneObject, Game.player.sceneObject);
        });
    }
    export function customCommand_15010(commandPage: CommandPage, cmd: Command, trigger: CommandTrigger, triggerPlayer: ClientPlayer, playerInput: any[], cp: CustomCommandParams_15010): void {
        SteamSDK.clearAchievement(cp.achieveID, () => {
            if (cp.onSuccess) CommandPage.startTriggerFragmentEvent(cp.onSuccess, Game.player.sceneObject, Game.player.sceneObject);
        }, () => {
            if (cp.onFail) CommandPage.startTriggerFragmentEvent(cp.onFail, Game.player.sceneObject, Game.player.sceneObject);
        });
    }
}