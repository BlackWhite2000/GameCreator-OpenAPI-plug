/**
 * #1 preloadAsset
 */
class DataStructure_preloadAsset {
    assetType: number; // = 0; 资源类型
    asset0: string; // = ""; 图片
    asset1: string; // = ""; 音频
    asset2: number; // = 1; 行走图
    asset3: number; // = 1; 立绘
    asset4: number; // = 1; 动画
    asset5: number; // = 1; 界面
    asset6: number; // = 1; 对话框
}
/**
 * #2 packageItem
 */
class DataStructure_packageItem {
    item: Module_Item; // = 0; 道具
    number: number; // = 1; 数目
}
/**
 * #3 keys
 */
class DataStructure_keys {
    key: number; // = 0; 按键
}
/**
 * #4 
 */
class DataStructure_unnamed4 {
}
/**
 * #5 shopItem
 */
class DataStructure_shopItem {
    item: number; // = 1; 道具
    numberType: number; // = 0;
    number: number; // = 0;
    numberVar: number; // = 1;
    priceType: number; // = 0;
    price: number; // = 0;
    priceVar: number; // = 1;
}
/**
 * #6 gameKeyboard
 */
class DataStructure_gameKeyboard {
    gameKey: number; // = 0; 键位
    keyCode1: number; // = 0; 值1
    keyCode2: number; // = 0; 值2
    keyCode3: number; // = 0; 值3
    keyCode4: number; // = 0; 值4
}
/**
 * #7 inputMessage
 */
class DataStructure_inputMessage {
    type: number; // = 0; 类别
    numberValue: any; // 游戏数值
    booleanValue: any; // 游戏开关
    stringValue: any; // 游戏字符串
}
/**
 * #8 collisionGroupSetting
 */
class DataStructure_collisionGroupSetting {
    group1: number; // = 0; 组-1
    group2: number; // = 0; 组-2
}
/**
 * #14001 定义游戏变量
 */
class DataStructure_定义游戏变量 {
    type: number; // = 0;  
    gameNumber: any; //  
    gameString: any; //  
    gameBoolean: any; //  
}
/**
 * #15001 禁用状态_立绘自动动画
 */
class DataStructure_AvatarAutoAnimation_disable {
    r: number; // = -0.1; 红
    g: number; // = -0.1; 绿
    b: number; // = -0.1; 蓝
    gray: number; // = 0.5; 灰度
    mr: number; // = 0.5; 红曝光
    mg: number; // = 0.5; 绿曝光
    mb: number; // = 0.5; 蓝曝光
}
/**
 * #15002 线索信息_高级图鉴
 */
class DataStructure_clues_advancedIllustrations {
    image: string; // = ""; 指定图片
    text: string; // = ""; 指定文本
}
/**
 * #15003 解锁档案_高级图鉴
 */
class DataStructure_unlock_archive_advancedIllustrations {
    archive: number; // = 0; 角色的档案
    clue: number; // = 0; 档案线索编号
    actor: number; // = 0; 角色
    isNew: boolean; // = false;
}
/**
 * #15004 解锁立绘_高级图鉴
 */
class DataStructure_unlock_avatar_advancedIllustrations {
    avatar: number; // = 0; 角色的立绘
    actor: number; // = 0; 角色
    isNew: boolean; // = false;
}
/**
 * #15005 设定_绑定触发文本颜色
 */
class DataStructure_textColor_GameDialogColorShowUI {
    textColor: string; // = "#ffffff"; 颜色
    textShowUI: number; // = 0; 显示界面
    textShowEvent: string; // = ""; 显示时
    textHideEvent: string; // = ""; 关闭时
}