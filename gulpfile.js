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

function defaultTask(cb) {
    // place code for your default task here
    console.log("hello world");
    cb();
}
function buildLess(cb){
    // console.log("building less...");
    // cb();
    return src(stylePath)
            .pipe(less())
            .pipe(csso())
            .pipe(dest(styleDist));
}


function buildJs(){
    // const browserify = require('browserify');
    // const source = require('vinyl-source-stream');
    // babelify
    // @babel/preset-env
    // @babel/core
    console.log("正在构建新的bundle.js");
    return browserify(javaScriptPath)
        .transform("babelify",{presets:['@babel/preset-env']})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(dest(javaScriptDist));
}

function watchFiles(){
    watch('src/js/**/*.js',buildJs);
    watch('src/styles/**/*.less',buildLess);
}
exports.default = defaultTask;
exports.buildLess = buildLess;
exports.buildJs = buildJs;
exports.watch = watchFiles;
exports.buildAll = parallel(buildJs,buildLess);;
