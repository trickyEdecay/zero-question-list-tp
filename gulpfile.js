const {watch,src,dest,parallel} = require("gulp");
const less = require("gulp-less");
const csso = require('gulp-csso');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const buffer = require('vinyl-buffer');

// 样式的路径
const stylePath = [
    'src/styles/**/*.less'
];
// js入口文件的路径
const javaScriptPath = 'src/js/main.js';

// 样式输出的路径
const styleDist = "public/static/styles";
// js输出的路径
const javaScriptDist = "public/static/js";

// 构建 less
function buildLess(cb){
    // console.log("building less...");
    // cb();
    return src(stylePath)
            .pipe(less()) // less -> css
            .pipe(csso()) // css压缩
            .pipe(dest(styleDist));
}

// 构建 js
function buildJs(){
    // const browserify = require('browserify');
    // const source = require('vinyl-source-stream');
    // babelify
    // @babel/preset-env
    // @babel/core
    console.log("正在构建新的bundle.js");
    return browserify(javaScriptPath)
        .transform("babelify",{presets:['@babel/preset-env']}) // es6 -> es5
        .bundle() // 打包所有文件
        .pipe(source('bundle.js')) // 给打包完的文件起个名字
        .pipe(buffer()) // 我没讲过，但是这里的作用是将虚拟文件变成 buffer 格式，要不然下面的uglify会理解不了
        .pipe(uglify()) // js 压缩/丑化
        .pipe(dest(javaScriptDist));
}

// 监控所有文件的变化，一旦文件发生变更，自己执行相关任务
function watchFiles(){
    watch('src/js/**/*.js',buildJs);
    watch('src/styles/**/*.less',buildLess);
}

exports.buildLess = buildLess;
exports.buildJs = buildJs;
exports.watch = watchFiles;
exports.buildAll = parallel(buildJs,buildLess);;
