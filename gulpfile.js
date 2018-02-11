'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    debug = require('gulp-debug'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    jshintfileoutput = require('gulp-jshint-html-reporter'),
    browserify = require('gulp-browserify'),
    sass = require('gulp-sass'),
    concatCss = require('gulp-concat-css'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    gulpif = require('gulp-if'),
    webserver = require('gulp-webserver'),
    path = require('path'),
    swPrecache = require('sw-precache'),
    csv = require('csvtojson'),
    jsonfile = require('jsonfile');

var src = './src',
    dest = './public',
    environment = 'production1',
    CONFIG = require('./src/js/config');

gulp.task('csvtojson:bus', function () {
  var busJSON = [];
  csv()
    .fromFile(src + '/data/dublin-bus-stops.csv')
    .on('json', (busStop) => {
      if (busStop.position.lat >= CONFIG.MAP_CONFIG.maxBounds[0][0] &&
        busStop.position.lat <= CONFIG.MAP_CONFIG.maxBounds[1][0] &&
        busStop.position.lng <= CONFIG.MAP_CONFIG.maxBounds[1][1] &&
        busStop.position.lng >= CONFIG.MAP_CONFIG.maxBounds[0][1]) {
        busJSON.push(busStop);
        console.log(busStop);
      }
    })
    .on('done', (error) => {
      jsonfile.writeFile(dest + '/data/dublin-bus-stops.json', busJSON, function (err) {
        console.error(err)
      })
    })
});

gulp.task('generate-service-worker', function(callback) {
  swPrecache.write(path.join(dest, 'service-worker.js'), {
    staticFileGlobs: [
      dest + '/**/*.{js,html,json,css,png,jpg,gif,svg,eot,ttf,woff}'
    ],
    stripPrefix: dest,
    runtimeCaching: [{
      urlPattern:  /^https:\/\/mysterious-temple-97993.herokuapp\.com\/stations/,
      handler: 'networkFirst'
    }]
  }, callback);
});

gulp.task('js:lint', function() {
  return gulp.src(src + '/js/**/*.js')
    .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter(stylish))
      .pipe(jshint.reporter('gulp-jshint-html-reporter', { filename: 'jshint-output.html' }));
});

gulp.task('js:build', function() {
  return gulp.src(src + '/js/app.js')
    .pipe(browserify())
    .pipe(gulpif(environment === 'production', uglify()))
    .on('error', function (err) {
      gutil.log('Error!', err.message);
    })
    .pipe(gulp.dest(dest + '/js'));
});

gulp.task('html', function() {
});

gulp.task('scss:build', function () {
  return gulp.src(src + '/scss/**/*.scss')
    .pipe(debug())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest + '/css'));
});

gulp.task('css', function() {
  gulp.src( src + '/css/app.css')
    //.pipe(concatCss('app.css', { rebaseUrls: false }))
    .pipe(gulpif(environment === 'production', cleanCSS()))
    .pipe(gulp.dest(dest + '/css'));
});

gulp.task('watch', function() {
    gulp.watch([src + '/js/**/*', dest + '/data/**/*'], ['generate-service-worker','js']);
    gulp.watch(src + '/scss/**/*.scss', ['generate-service-worker','scss']);
    gulp.watch(dest + '/*.html', ['generate-service-worker','html']);
});

gulp.task('webserver', ['generate-service-worker','html', 'scss', 'js'], function() {
  gulp.src(dest)
    .pipe(webserver({
      livereload: true,
      open: true
    })
  );
});

gulp.task('default', ['watch', 'webserver']);
gulp.task('build', ['generate-service-worker','html', 'scss', 'js']);

gulp.task('js', ['js:lint', 'js:build']);
gulp.task('scss', ['scss:build']);
