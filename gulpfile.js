var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('react', function () {
  return gulp.src([
    'src/*.jsx', 'src/**/*.jsx', 'src/**/**/*.jsx',
    'src/*.js', 'src/**/*.js', 'src/**/**/*.js'
  ])
  .pipe(babel({
    sourceMaps: 'inline',
    presets: ['es2015', 'stage-0', 'react'],
    plugins: ['transform-es2015-modules-amd']
  }))
  .pipe(gulp.dest('dist'));
});

gulp.task('watch', function(){
  gulp.watch([
    'src/*.jsx', 'src/**/*.jsx', 'src/**/**/*.jsx',
    'src/*.js', 'src/**/*.js', 'src/**/**/*.js'
  ], ['react']);
});

gulp.task('copy-vendor', function() {
  // the base option sets the relative root for the set of files,
  // preserving the folder structure
  gulp.src([
    'node_modules/react/**/*',
    'node_modules/react-dom/**/*',
    'node_modules/react-bootstrap/**/*',
    'node_modules/redux/**/*',
    'node_modules/react-redux/**/*',
    'node_modules/redux-thunk/**/*',    
    'node_modules/font-awesome/**/*'
    ], {
      base: './node_modules'
    })
    .pipe(gulp.dest('vendor'));
});

gulp.task('default', ['react']);
