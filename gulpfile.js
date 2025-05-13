const autoprefixer = require('autoprefixer')
const connect = require('gulp-connect')
const cssnano = require('cssnano')
const gulp = require('gulp')
const path = require('path')
const postcss = require('gulp-postcss')
const sass = require('gulp-dart-sass')
const sourcemaps = require('gulp-sourcemaps')
const fs = require('fs')
const through2 = require('through2')

gulp.task('build', function () {
	return gulp.src('css/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss([autoprefixer(), cssnano()]))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/dist'))
		.pipe(connect.reload())
})

gulp.task('copy-reveal-js', function () {
	return gulp.src(['node_modules/reveal.js/{css,dist,js,plugin}/**/*', '!node_modules/reveal.js/dist/theme/*.css'])
		.pipe(gulp.dest('dist'));
		
})
		
gulp.task('copy-assets', function () {
	return gulp.src('css/**/assets/**/*')
		.pipe(through2.obj(function (file, _, cb) {
			if (file.isDirectory()) {
				cb(null, file);
				return;
			}
			const newPath = path.join('css', path.relative('css', file.path));
			file.path = newPath;
			cb(null, file);
		}
		))
		.pipe(gulp.dest('dist/dist'))
		.pipe(connect.reload())
})

gulp.task('copy-index', function () {
	return gulp.src('index.html')
		.pipe(gulp.dest('dist'))
		.pipe(connect.reload())
})

gulp.task('serve', function () {
	connect.server({
		livereload: true,
		port: 8000,
		root: 'dist'
	})
})

gulp.task('reload', function () {
	return gulp.src('dist/**/*')
		.pipe(connect.reload())
})

// Clean the dist folder
gulp.task('clean', function () {
	return gulp.src('dist', { read: false, allowEmpty: true })
		.pipe(require('gulp-clean')())
})

// Watch for changes
gulp.task('watch', function () {
	gulp.watch('css/**/*.scss', gulp.series('build', 'reload'))
	gulp.watch('css/**/assets/**/*', gulp.series('copy-assets', 'reload'))
	gulp.watch('index.html', gulp.series('copy-index', 'reload'))
})