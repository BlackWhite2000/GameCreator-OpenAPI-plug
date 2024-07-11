## 说明

OpenAPI 更多API插件。

## 在线文档

https://new.gcw.wiki/zh_hans/plug/openapi

## 开始

### 1、安装依赖

```shell
npm install pnpm -g
pnpm install
```

### 2、开发

从 `src` 文件开始，开发完毕后执行 `pnpm run build` 将自动合并ts并拷贝至工程内。

### 3、填写开发文档

`docs` 内置了md文档，可查看 `docs/README.md` 来开始。

## 命令说明

```shell
pnpm run build # 合并 src 目录内的ts文件并拷贝至工程内。
pnpm run build:w # 持续监听执行 pnpm run build，当 src 目录内有变更时，自动合并更新。
pnpm run build:public # 将 public 目录内的文件并拷贝至工程内。
pnpm run build:ts # 将 build 目录内的文件编译成js，并拷贝至工程内。
pnpm run build:allTs # 将 src 目录内的文件并拷贝至工程内，与 pnpm run build 区别在于不会合并ts。
```

## 目录说明

```shell
docs # 项目配套文档。
template # 项目工程存放目录。
script # 该项目运行脚本。
build # 该目录下的文件将会被编译成一个 js 文件，固定名称为 main.js。
public # 该目录下的文件不会被编译、合并。将会直接被拷贝。
src # 该目录下的文件将被合并成一个 ts 文件，文件名跟随环境变量 OUTPUT_NAME。
```
