var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minify = require('gulp-clean-css');

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
            'src/_scss/_theming.scss',
            'src/_scss/mixins/_base.scss',
            'src/_scss/mixins/_flex.scss',
            'src/_scss/mixins/_gradients.scss',
            'src/_scss/mixins/_grid.scss',
            'src/_scss/mixins/_labels.scss',
            'src/_scss/mixins/_buttons.scss',
            'src/_scss/mixins/_alerts.scss'
        ])
        .pipe(concat('kube.scss'))
        .pipe(gulp.dest('dist/scss'));
});

gulp.task('scripts', function() {
    return gulp.src([
            'src/_js/*.js'
        ])
        .pipe(concat('kube.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename('kube.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('watch', function() {

    gulp.watch('src/_js/*.js', ['scripts']);

    gulp.watch([
        'src/_scss/*.scss',
        'src/_scss/components/*.scss',
        'src/_scss/mixins/*.scss'
    ], ['sass']);

    gulp.watch('assets/scss/*.scss', ['sass-master']);
});

gulp.task('default', ['sass', 'combine', 'scripts',  'watch']);