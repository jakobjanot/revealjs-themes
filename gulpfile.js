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
		.pipe(gulp.dest('dist'))
		.pipe(connect.reload())
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
			file.contents = fs.readFileSync(file.path); // Ensure file contents are preserved
			cb(null, file);
		}
		))
		.pipe(gulp.dest('dist'))
		.pipe(connect.reload())
})

gulp.task('watch', function () {
	gulp.watch('css/**/*.scss', gulp.series('build'))
	gulp.watch('css/**/assets/**/*', gulp.series('copy-assets'))
})

gulp.task('connect', function () {
	connect.server({
		livereload: true,
		port: 8000,
		root: ['dist/slides', 'dist/css', 'node_modules']
	})
})

// Clean the dist folder
gulp.task('clean', function () {
	return gulp.src('dist', { read: false, allowEmpty: true })
		.pipe(require('gulp-clean')())
})

gulp.task('build', gulp.parallel('build', 'copy-assets'))
gulp.task('default', gulp.series('build'))