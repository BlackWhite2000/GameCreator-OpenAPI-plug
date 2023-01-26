const gulp = require('gulp');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const prompt = require('gulp-prompt');
const ignore = require('gulp-ignore');

// 合并
gulp.task('concat-ts', function () {
  return gulp.src('src/**/*.ts')
    .pipe(concat('OpenAPI.ts'))
    .pipe(gulp.dest('dist'));
});

// 第三方库
gulp.task('concat-distCryptoJS', function () {
  return gulp.src('public/CryptoJS.min.js')
    .pipe(concat('CryptoJS.min.js'))
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

// 清空后拷贝到插件目录
gulp.task('plug', function (cb) {
  return gulp.src(['dist/*', '!dist/tsconfig.json'])
    .pipe(prompt.prompt({
      type: 'input',
      name: 'path',
      message: '请输入插件路径',
      default: '../Game/GCplug/641/'
    }, function (res) {
      gulp.src(res.path + '*', { read: false })
        .pipe(clean({ force: true }))
        .pipe(gulp.dest(res.path))
        .on('end', function () {
          gulp.src(['dist/*', '!dist/tsconfig.json'])
            .pipe(ignore.exclude(['**/*.d.ts']))
            .pipe(gulp.dest(res.path))
            .on('end', cb);
        });
    }));
});


// 拷贝到插件目录
gulp.task('plug-dist', function () {
  return gulp.src(['dist/*', '!dist/tsconfig.json'])
    .pipe(prompt.prompt({
      type: 'input',
      name: 'path',
      message: '请输入插件路径',
      default: '../Game/GCplug/641/'
    }, function (res) {
      return gulp.src(['dist/*', '!dist/tsconfig.json'])
        .pipe(ignore.exclude(['**/*.d.ts']))
        .pipe(gulp.dest(res.path))
    }))
});

// 清空插件目录
gulp.task('plug-clean', function (cb) {
  return gulp.src('../Game/GCplug/641/')
    .pipe(prompt.prompt({
      type: 'input',
      name: 'path',
      message: '请输入将要清空文件的插件路径',
      default: '../Game/GCplug/641/'
    }, function (res) {
      gulp.src(res.path + '*', { read: false })
        .pipe(clean({ force: true }))
        .pipe(gulp.dest(res.path))
      cb();
    }));
});
