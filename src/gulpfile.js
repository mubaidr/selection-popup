// generated on 2017-12-21 using generator-chrome-extension 0.7.0
const gulp = require('gulp')
const gulpLoadPlugins = require('gulp-load-plugins')
const del = require('del')
const runSequence = require('run-sequence')
const { stream } = require('wiredep')

const $ = gulpLoadPlugins()

gulp.task('extras', () =>
  gulp
    .src(['app/*.*', 'app/_locales/**', '!app/*.json', '!app/*.html'], {
      base: 'app',
      dot: true
    })
    .pipe(gulp.dest('dist'))
)

gulp.task('images', () =>
  gulp
    .src('app/images/**/*')
    .pipe(
      $.if(
        $.if.isFile,
        $.cache(
          $.imagemin({
            progressive: true,
            interlaced: true,
            // don't remove IDs from SVGs, they are often used
            // as hooks for embedding and styling
            svgoPlugins: [{ cleanupIDs: false }]
          })
        ).on('error', err => {
          console.log(err)
          this.end()
        })
      )
    )
    .pipe(gulp.dest('dist/images'))
)

gulp.task('html', () =>
  gulp
    .src('app/*.html')
    .pipe($.useref({ searchPath: ['.tmp', 'app', '.'] }))
    // .pipe($.sourcemaps.init())
    // .pipe($.if('*.js', uglify()))
    .pipe($.if('*.css', $.cleanCss({ compatibility: '*' })))
    // .pipe($.sourcemaps.write())
    .pipe(
      $.if(
        '*.html',
        $.htmlmin({
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
          removeComments: true
        })
      )
    )
    .pipe(gulp.dest('dist'))
)

gulp.task('chromeManifest', () =>
  gulp
    .src('app/manifest.json')
    .pipe(
      $.chromeManifest({
        buildnumber: true,
        background: {
          target: 'scripts/background.js',
          exclude: ['scripts/chromereload.js']
        }
      })
    )
    .pipe($.if('*.css', $.cleanCss({ compatibility: '*' })))
    // .pipe($.if('*.js', $.sourcemaps.init()))
    // .pipe($.if('*.js', uglify()))
    // .pipe($.if('*.js', $.sourcemaps.write('.')))
    .pipe(gulp.dest('dist'))
)

gulp.task('clean', del.bind(null, ['.tmp', 'dist']))

gulp.task('watch', [], () => {
  $.livereload.listen()

  gulp
    .watch([
      'app/*.html',
      'app/scripts/**/*.js',
      'app/images/**/*',
      'app/styles/**/*',
      'app/_locales/**/*.json'
    ])
    .on('change', $.livereload.reload)

  gulp.watch('bower.json', ['wiredep'])
})

gulp.task('size', () =>
  gulp.src('dist/**/*').pipe($.size({ title: 'build', gzip: true }))
)

gulp.task('wiredep', () => {
  gulp
    .src('app/*.html')
    .pipe(
      stream({
        ignorePath: /^(\.\.\/)*\.\./
      })
    )
    .pipe(gulp.dest('app'))
})

gulp.task('package', () => {
  // eslint-disable-next-line
  const manifest = require('./dist/manifest.json')
  return gulp
    .src('dist/**')
    .pipe($.zip(`selection-popup-${manifest.version}.zip`))
    .pipe(gulp.dest('package'))
})

gulp.task('build', cb => {
  runSequence('chromeManifest', ['html', 'images', 'extras'], 'size', cb)
})

gulp.task('default', ['clean'], cb => {
  runSequence('build', cb)
})
