import { existsSync, mkdirSync, readdirSync, lstatSync, createReadStream, createWriteStream } from 'fs';
import { join } from 'path';
import { rm } from 'node:fs/promises';
import dotenv from 'dotenv';

// 从 .env 文件中加载环境变量
dotenv.config();

// 获取环境变量
const outputPath = process.env.OUTPUT_PATH;
const outputFolderName = process.env.OUTPUT_FOLDER_NAME;
const outputName = process.env.OUTPUT_NAME;
const env = [
    {
        var: outputPath,
        name: 'OUTPUT_PATH',
        type: 'ts合并路径',
    },
    {
        var: outputFolderName,
        name: 'OUTPUT_FOLDER_NAME',
        type: 'ts目录名称',
    },
    {
        var: outputName,
        name: 'OUTPUT_NAME',
        type: 'ts文件名称',
    },
];
for (const i in env) {
    if (!env[i].var) {
        console.error(`未找到${env[i].type}，请在 .env 文件中设置 ${env[i].name} 变量。`);
        process.exit(1);
    }
}

// 定义源目录和目标目录的路径
const currentWorkingDirectory = process.cwd(); // 获取当前工作目录
const sourceDirectory = join(currentWorkingDirectory, 'public');
const targetDirectory = join('template', 'asset', 'myally_modules');

// 删除目标目录（如果存在），然后重新创建目录
if (existsSync(targetDirectory)) {
    rm(targetDirectory, { recursive: true, force: true })
        .then(() => {
            mkdirSync(targetDirectory);
            copyFiles(sourceDirectory, targetDirectory);
        })
        .catch((error) => {
            console.error('删除目标目录时出错：', error);
            process.exit(1);
        });
} else {
    mkdirSync(targetDirectory);
    copyFiles(sourceDirectory, targetDirectory);
}

// 递归拷贝文件和子目录到目标目录
function copyFiles(source, target) {
    const files = readdirSync(source);
    files.forEach((file) => {
        if (file === 'config.mjs') return; // 排除名为config.mjs的文件
        const sourceFilePath = join(source, file);
        const targetFilePath = join(target, file);
        const stat = lstatSync(sourceFilePath);

        if (stat.isDirectory()) {
            mkdirSync(targetFilePath); // 创建目录
            copyFiles(sourceFilePath, targetFilePath); // 递归拷贝子目录中的文件
        } else {
            // 使用流来拷贝文件
            const readStream = createReadStream(sourceFilePath);
            const writeStream = createWriteStream(targetFilePath);
            readStream.pipe(writeStream);

            // 监听拷贝完成事件
            writeStream.on('finish', () => {
                console.log(`拷贝 ${file} 到 ${join(currentWorkingDirectory, target)}`);
            });
        }
    });
}
