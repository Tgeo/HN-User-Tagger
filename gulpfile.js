var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');

gulp.task('build', function () {
  var typeScriptResult = gulp.src('src/*.ts')
    .pipe(ts({
        noImplicitAny: true,
        out: 'main.js'
      }));

  var libraryCopyResult = gulp.src('node_modules/jquery/dist/jquery.min.js')
    .pipe(gulp.dest('chrome/dist'));

  return merge([
    typeScriptResult.js.pipe(gulp.dest('chrome')),
    libraryCopyResult
    ]);

});