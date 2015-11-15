gulp = require 'gulp'
filter = require 'gulp-filter'
mustache = require 'gulp-mustache'
manifest = require '../src/package.json'

gulp.task 'resources:linux', ->
  templateFilter = filter(['*.desktop', '*.sh'], {restore: true})

  manifest.linux.name = manifest.name
  manifest.linux.productName = manifest.productName
  manifest.linux.description = manifest.description
  manifest.linux.version = manifest.version
  gulp.src './resources/linux/**/*'
    .pipe templateFilter
    .pipe mustache manifest.linux
    .pipe templateFilter.restore
    .pipe gulp.dest './build/resources/linux'

gulp.task 'resources', [
  'resources:linux'
]
