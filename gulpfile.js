var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minify = require('gulp-clean-css');

var scripts = [
	"src/_js/Core/Kube.js",
	"src/_js/Core/Kube.Plugin.js",
	"src/_js/Core/Kube.Animation.js",
	"src/_js/Core/Kube.Detect.js",
	"src/_js/Core/Kube.FormData.js",
	"src/_js/Core/Kube.Response.js",
	"src/_js/Core/Kube.Utils.js",
	"src/_js/Message/Kube.Message.js",
	"src/_js/Sticky/Kube.Sticky.js",
	"src/_js/Toggleme/Kube.Toggleme.js",
	"src/_js/Offcanvas/Kube.Offcanvas.js",
	"src/_js/Collapse/Kube.Collapse.js",
	"src/_js/Dropdown/Kube.Dropdown.js",
	"src/_js/Tabs/Kube.Tabs.js",
	"src/_js/Modal/Kube.Modal.js"
];

gulp.task('sass', function() {
    return gulp.src('src/kube.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/css'))
        .pipe(rename('kube.min.css'))
        .pipe(minify())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('combine', function() {
    return gulp.src([
            'src/_scss/_variables.scss',
            'src/_scss/mixins/_breakpoints.scss',
            'src/_scss/mixins/_fonts.scss',
            'src/_scss/mixins/_flex.scss',
            'src/_scss/mixins/_grid.scss',
            'src/_scss/mixins/_utils.scss',
            'src/_scss/mixins/_buttons.scss',
            'src/_scss/mixins/_gradients.scss',
            'src/_scss/mixins/_labels.scss'
        ])
        .pipe(concat('kube.scss'))
        .pipe(gulp.dest('dist/scss'));
});

gulp.task('scripts', function() {
    return gulp.src(scripts)
        .pipe(concat('kube.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename('kube.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('watch', function() {

    gulp.watch(scripts, ['scripts']);
    gulp.watch(['src/_scss/*.scss', 'src/_scss/components/*.scss', 'src/_scss/mixins/*.scss'], ['sass', 'combine']);

});

gulp.task('default', ['sass', 'combine', 'scripts',  'watch']);