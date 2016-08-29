'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var karma = require('karma').Server;
var stylish = require('jshint-stylish');
var browserSync = require('browser-sync').create();


gulp.task('serve', ['sass'], function() {

  browserSync.init({
    server: {
      baseDir: "./public"
    }
  });

  gulp.watch("public/build/styles/*.css").on('change', browserSync.reload);
});

/////////////// tasks ////////////////
gulp.task('connect', function() {
  connect.server();
});


// JSHint checks code for errors
gulp.task('jshint', function() {
  gulp.src('./public/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});


// TDD
gulp.task('test', function(done) {
  new karma({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});


gulp.task('sass', function() {
  return gulp.src('./public/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
});

// JS concat, strip debugging and minify
gulp.task('scripts', function() {
  gulp.src(['./public/js/app.js', './public/js/**/*.js'])
    .pipe(concat('script.js'))
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest('./public/build/scripts/'));
});

// CSS concat, auto-prefix and minify
gulp.task('styles', function() {
  gulp.src(['./public/css/*.css'])
    .pipe(concat('styles.css'))
    .pipe(autoprefix('last 2 versions'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./public/build/styles/'))
    .pipe(browserSync.stream());
});



gulp.task('default', ['jshint', 'test', 'sass', 'scripts', 'styles', 'connect'], function() {

});
gulp.watch('./public/css/**/*.css', ['styles']);
gulp.watch('./public/scss/**/*.scss', ['sass']);

gulp.watch('./public/js/**/*.js', function() {
  gulp.run('scripts');
});
