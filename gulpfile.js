/// <reference path="typings/gulp/gulp.d.ts" />

var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');

gulp.task('build', function () {

  var firefoxContentScriptTSResult = gulp.src([
      'src/storage-proxy-interface.ts',
      'src/firefox/firefox-storage-proxy.ts',
      'src/user-tagger.ts',
      'src/firefox/main.ts'])
    .pipe(ts({
        noImplicitAny: true,
        out: 'main.js'
      }));

  var firefoxBackgroundScriptTSResult = gulp.src('src/firefox/background.ts')
    .pipe(ts({
        noImplicitAny: true,
        out: 'background.js'
      }));

  var chromeTSResult = gulp.src([
        'src/storage-proxy-interface.ts',
        'src/chrome/chrome-storage-proxy.ts',
        'src/user-tagger.ts',
        'src/chrome/main.ts'])
      .pipe(ts({
          noImplicitAny: true,
          out: 'main.js'
        }));

  var libraryCopyResult = gulp.src('node_modules/jquery/dist/jquery.min.js')
    .pipe(gulp.dest('chrome/dist'))
    .pipe(gulp.dest('firefox/dist'));

  return merge([

    firefoxContentScriptTSResult.js
      .pipe(gulp.dest('firefox')),

    firefoxBackgroundScriptTSResult.js
      .pipe(gulp.dest('firefox')),

    chromeTSResult.js
      .pipe(gulp.dest('chrome')),

    libraryCopyResult

    ]);

});