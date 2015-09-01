var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('styles', function() {
	gulp.src('scss/kube.scss')
	  	.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./css/'));
});

gulp.task('default',function() {
    gulp.watch('scss/kube.scss',['styles']);
});