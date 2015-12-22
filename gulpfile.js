var gulp = require('gulp'),
    haml = require('gulp-ruby-haml'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    connect = require('connect'),
    iconfont = require('gulp-iconfont'),
    consolidate = require('gulp-consolidate'),
    // iconfontCss = require('gulp-iconfont-css'),
    serveStatic = require('serve-static'),
    path = require('path'),
    nib = require('nib');
var runTimestamp = Math.round(Date.now()/1000);


/*
 * Создаём задачи
 *
 * sass – для CSS-препроцессора sass
 * haml – для HTML-препроцессора Haml
 * coffee – для JavaScript-препроцессора CoffeеScript
 * concat – для склейки всех CSS и JS в отдельные файлы
 */

gulp.task('sass', function() {
  gulp.src('./sass/*.scss')
    .pipe(sass({use: nib(), compress: true}))
	  .pipe(sass().on('error', sass.logError)) // Выводим ошибки в консоль
	  .pipe(gulp.dest('./public/css/')) // Выводим сгенерированные CSS-файлы в ту же папку по тем же именем, но с другим расширением
	  .pipe(livereload()); // Перезапускаем сервер LiveReload
});

gulp.task('haml', function(){
	gulp.src('./*.haml')
		.pipe(haml({pretty: true}))
		.on('error', console.log) // Выводим ошибки в консоль
	  .pipe(gulp.dest('./public/')) // Выводим сгенерированные HTML-файлы в ту же папку по тем же именем, но с другим расширением
	  .pipe(livereload()); // Перезапускаем сервер LiveReload
});

gulp.task('prefix', function () {
  gulp.src('sass/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 3 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./public/css/'))
    .pipe(livereload()); // Перезапускаем сервер LiveReload
});

gulp.task('Iconfont', function(){
  return gulp.src(['icons/*.svg'])
    .pipe(iconfont({
      fontName: 'myfont', // required
      appendUnicode: true, // recommended option
      // startUnicode: 0xEA01,
      normalize: true,
      formats: ['ttf', 'eot', 'woff', 'svg'], // default, 'woff2' and 'svg' are available
      timestamp: runTimestamp, // recommended to get consistent builds when watching files
    }))
      .on('glyphs', function(glyphs, options) {
        // CSS templating, e.g.
        console.log(glyphs, options);
      })
    .pipe(gulp.dest('./public/fonts/'));
});

gulp.task('concat', function(){
  gulp.task('scss');
	gulp.src('./public/css/*.css')
		.pipe(concat('styles.css'))
    .pipe(gulp.dest('./public/min/'))
		.pipe(livereload());
});

gulp.task('imagemin',function(){
	 gulp.src('./img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./public/img/'));
});

/*
 * Создадим веб-сервер, чтобы работать с проектом через браузер
 */
 gulp.task('server', function() {
    connect()
    	.use(require('connect-livereload')())
    	.use(serveStatic(__dirname + '/public'))
      .listen('3333');

    console.log('Сервер работает по адресу http://localhost:3333');
});

 /*
  * Создадим задачу, смотрящую за изменениями
  */
 gulp.task('watch', function(){
      livereload.listen();
  		gulp.watch('./sass/*.scss',['sass']);
    	gulp.watch('./*.haml',['haml']);
      gulp.watch('./public/css/*.css',['prefix']);
   		gulp.watch(['./public/css/*.css'],['concat']);
    	gulp.watch('./img/**/*',['imagemin']);
  	  gulp.start('server');
  });

 gulp.task('default',['watch','sass','haml','prefix','concat','imagemin','Iconfont']);
