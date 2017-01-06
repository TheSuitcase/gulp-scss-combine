import gulp from 'gulp'
import del from 'del'
import watch from 'gulp-watch'
import sass from 'gulp-sass'
import combine from '../dist'

function clean(){
  return del(['./app'])
}

function scss(){
  return gulp
    .src(['./src/**/*.scss'])
    .pipe(combine({
      main: `.src/styles/main.scss`,
      debug: true,
    }))
    .pipe(sass())
    .pipe(gulp.dest('./app'))
}

watch(['./src/**/*.scss'], scss)

gulp.task('default', gulp.series(clean, scss))