fs = require 'fs-extra'
gulp = require 'gulp'
del = require 'del'

manifest = require '../src/package.json'

['linux32', 'linux64'].forEach (dist) ->
  gulp.task 'clean:build:' + dist, ['download:' + dist], (done) ->
    del './build/' + dist + '/opt/' + manifest.name + '/resources/default_app', done

gulp.task 'clean:build', [
  'clean:build:linux32'
  'clean:build:linux64'
]

# Just ensure the dir exists
['linux32', 'linux64'].forEach (dist) ->
  gulp.task 'clean:dist:' + dist, (done) ->
    fs.ensureDir './dist', done

gulp.task 'clean:dist', [
  'clean:dist:linux32'
  'clean:dist:linux64'
]
