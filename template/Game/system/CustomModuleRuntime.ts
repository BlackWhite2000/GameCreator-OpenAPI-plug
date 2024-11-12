/**
 * #1 道具
 */
class Module_Item {
    id: number;
    name: string;
    icon: string; // = ""; 图标
    intro: string; // = "";
    sell: number; // = 0; 商店售价
    isUse: boolean; // = false; 可使用
    sellEnabled: boolean; // = false; 允许出售给商店
    isConsumables: boolean; // = false; 消耗品
    se: string; // = ""; 使用时音效
    callEvent: string; // = ""; 使用后执行的事件
}
/**
 * #2 表情气泡
 */
class Module_表情气泡 {
    id: number;
    name: string;
    emojiType: number; // = 0;  
    emojiImg: string; // = ""; 指定图片
    emojiAni: number; // = 0; 指定动画
    time: number; // = 10;  
    actionID: number; // = 0;  
    is_actionID: boolean; // = false; 设置立绘表情
    is_time: boolean; // = true; 设置淡入帧数
    se: string; // = "";  
    is_se: boolean; // = false; 设置音效
    emojiTime: number; // = 1000; 表情停留时间(毫秒)
    is_attributeCalculation: boolean; // = false; 原属性基础上叠加
    x_attributeCalculation: number; // = 0; x
    y_attributeCalculation: number; // = 0; y
}
/**
 * #3 图鉴信息
 */
class Module_advancedIllustrations {
    id: number;
    name: string;
    unlocked: string; // = ""; 未解锁
    unlock: string; // = ""; 解锁
    category: number; // = 0; 图鉴分类
    avatar: number[]; // = [];
    archive_unlocked: string; // = ""; 档案未解锁时图片
    archive: number[]; // = [];
}
/**
 * #4 图鉴档案
 */
class Module_archives_advancedIllustrations {
    id: number;
    name: string;
    archives: DataStructure_clues_advancedIllustrations[]; // = [];
}
/**
 * #5 图鉴分类
 */
class Module_category_advancedIllustrations {
    id: number;
    name: string;
}
/**
 * #6 图鉴立绘
 */
class Module_avatar_advancedIllustrations {
    id: number;
    name: string;
    unlocked: number; // = 0; 未解锁的立绘
    unlock: number; // = 0; 解锁的立绘
}
/**
 * #7 对话悬浮框
 */
class Module_GameDialogColorShowUI {
    id: number;
    name: string;
    setID: string; // = ""; 标识符
    setColor: string; // = ""; 标识色
    setImageData: string; // = ""; 图片
    setTextData: string; // = ""; 文本
    setDataList: boolean; // = false; 更多数据拓展
    setImageDataList: string[]; // = [];
    setTextDataList: string[]; // = [];
}