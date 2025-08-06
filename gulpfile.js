const autoprefixer = require('autoprefixer')
const connect = require('gulp-connect')
const cssnano = require('cssnano')
const gulp = require('gulp')
const postcss = require('gulp-postcss')
const sass = require('gulp-dart-sass')
const sourcemaps = require('gulp-sourcemaps')

gulp.task('sass', function () {
	return gulp.src('css/**/*.scss', { allowEmpty: true })
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss([autoprefixer(), cssnano()]))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/theme'))
		.pipe(connect.reload())
})

gulp.task('copy-reveal-js', function () {
	return gulp.src(['node_modules/reveal.js/{css,dist,js,plugin}/**/*', '!node_modules/reveal.js/dist/theme/*.css'])
		.pipe(gulp.dest('dist'));
		
})
		
gulp.task('copy-assets', function () {
	return gulp.src('css/theme/assets/**/*', { allowEmpty: true })
		.pipe(gulp.dest('dist/theme/assets'))
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
		root: './dist'
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
	console.log('Watching for changes...');
	gulp.watch('css/**/*.scss', gulp.series('sass'))
	gulp.watch('css/**/assets/**/*', gulp.series('copy-assets'))
	gulp.watch('index.html', gulp.series('copy-index'))
})

gulp.task('build', gulp.series('clean', gulp.parallel('copy-reveal-js', 'sass', 'copy-assets', 'copy-index')))
gulp.task('default', gulp.series('build', gulp.parallel('serve', 'watch')))