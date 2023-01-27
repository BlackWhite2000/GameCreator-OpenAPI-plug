## 目录结构
src //开发

public //存放第三方库, 尽可能修改命名空间防止冲突

dist //发布

## 开发流程
### npm
npm i 

### 开始
基于 **src** 目录开始开发, 完毕后使用命令 **dist** 或者 **dist-ts**, 会将所有ts打包成一个ts, 主要方便发布插件。

### 注意事项
如果打包包含第三方库, 请使用命令 **dist**

如果打包不包含第三方库, 请使用命令 **dist-ts**

声明文件不会放到插件目录内, 因为会有重复标识符的问题出现

### 第三方库
可以直接下js然后放到 **public**, 之后在 **gulpfile.js** 配置下打包到 **dist** 即可。

也可以 **npm i** 然后拷贝到 **public**。

一旦使用了第三方库, 都请注意冲突问题, 因为这是插件, 不确定用户会不会有第二个相同的库存在。

## 下载插件
### 发布版本
直接去官网安装下载即可 [安装地址](https://www.gamecreator.com.cn/plug/det/641)。

### 开发版本
可直接下载dist分支内的文件,下载完毕后放到工程的 **Game/GCplug** 内即可。

但是请注意，dist分支是开发版，意味着测试并不充足 [下载地址](https://github.com/BlackWhite2000/GameCreator-OpenAPI-plug/archive/refs/heads/dist.zip)。

## 命令
### dist
合并ts到dist、拷贝public内的js到dist

### dist-ts
合并ts到dist

### dist-js
拷贝public内的js到dist 

### plug
清空插件目录、拷贝dist内除了tsconfig.json、.d.ts的文件到插件目录 -可以手动填写路径

### plug-dist
拷贝dist内除了tsconfig.json、.d.ts的文件到插件目录 -可以手动填写路径

### plug-clean
清空插件目录 -可以手动填写路径

### d-ts 
生成d.ts到dist
声明文件打包过程可能会有报错, 这是正常情况, 因为没有相关环境存在。

### dist-no-d-ts
合并ts到dist、拷贝public内的js到dist
