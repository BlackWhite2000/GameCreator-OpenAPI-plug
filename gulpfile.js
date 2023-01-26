const gulp = require('gulp');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const prompt = require('gulp-prompt');

// 合并
gulp.task('concat-ts', function () {
  return gulp.src('src/**/*.ts')
    .pipe(concat('OpenAPI.ts'))
    .pipe(gulp.dest('dist'));
});

// 第三方库
gulp.task('concat-CryptoJS', function () {
  return gulp.src('node_modules/crypto-js/crypto-js.js')
    .pipe(concat('CryptoJS.js'))
    .pipe(gulp.dest('public'))
});

gulp.task('concat-distCryptoJS', function () {
  return gulp.src('public/CryptoJS.js')
    .pipe(concat('CryptoJS.js'))
    .pipe(gulp.dest('dist'))
});

// 清空
gulp.task('clean', function () {
  return gulp.src(['dist/*', '!dist/tsconfig.json'], { read: false, allowEmpty: true })
    .pipe(clean());
});

gulp.task('clean-ts', function () {
  return gulp.src(['dist/*', '!dist/tsconfig.json', '!dist/*.js'], { read: false, allowEmpty: true })
    .pipe(clean());
});

// 拷贝到插件目录
gulp.task('plug-dist', function() {
  return gulp.src(['dist/*', '!dist/tsconfig.json'])
    .pipe(prompt.prompt({
      type: 'input',
      name: 'path',
      message: '请输入插件路径',
      default: '../Game/GCplug/641/'
    }, function(res){
      return gulp.src(['dist/*', '!dist/tsconfig.json'])
        .pipe(gulp.dest(res.path))
    }))
});
