const gulp = require('gulp');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');

function compileEjs() {
  return gulp.src('./src/*.ejs') // Путь к вашим исходным EJS файлам
    .pipe(ejs()) // Компилируем EJS в HTML
    .pipe(rename({ extname: '.html' })) // Меняем расширение на .html
    .pipe(gulp.dest('./dist')); // Папка для скомпилированных файлов HTML
}

exports.default = gulp.series(compileEjs);
