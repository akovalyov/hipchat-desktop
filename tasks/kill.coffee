cp = require 'child_process'
gulp = require 'gulp'

manifest = require '../src/package.json'
killed = false

gulp.task 'kill:linux32', (done) ->
  return done() if killed
  cp.exec 'pkill -9 ' + manifest.name, -> done()
  killed = true

gulp.task 'kill:linux64', (done) ->
  return done() if killed
  cp.exec 'pkill -9 ' + manifest.name, -> done()
  killed = true
