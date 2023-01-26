## 目录结构
src //开发
public //存放第三方库, 尽可能修改命名空间防止冲突
dist //发布

## 开发流程
基于 **src** 目录开始开发, 完毕后使用命令 **dist** 或者 **dist-ts**, 会将所有ts打包成一个ts, 主要方便发布插件。
打包过程可能会有报错, 这是正常情况, 因为没有相关环境存在。
确保最终代码是正常的即可。

### 注意事项
如果打包包含第三方库, 请使用命令 **dist**
如果打包不包含第三方库, 请使用命令 **dist-ts**

### 第三方库
可以直接下js然后放到 **public**, 之后在 **gulpfile.js** 配置下打包到 **dist** 即可。
也可以 **npm i** 然后拷贝到 **public**。
一旦使用了第三方库, 都请注意冲突问题, 因为这是插件, 不确定用户会不会有第二个相同的库存在。

## 命令
### dist
合并ts到dist、拷贝public内的js到dist、生成d.ts到dist

### dist-ts
生成d.ts到dist

### dist-js
拷贝public内的js到dist

### plug-dist
拷贝dist内文件到插件目录, 可以手动填写路径

### public
将第三方库拷贝到public