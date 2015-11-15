gulp = require 'gulp'
async = require 'async'
rcedit = require 'rcedit'

cp = require 'child_process'
fs = require 'fs-extra'
path = require 'path'

utils = require './utils'
manifest = require '../src/package.json'

['linux32', 'linux64'].forEach (dist) ->
  gulp.task 'build:' + dist, ['resources:linux', 'compile:' + dist, 'clean:build:' + dist], (done) ->
    async.series [
      # Rename the executable
      (callback) ->
        exeDir = './build/' + dist + '/opt/' + manifest.name + '/'
        fromPath = exeDir + 'electron'
        toPath = exeDir + manifest.name

        fs.rename fromPath, toPath, utils.log callback, fromPath, '=>', toPath

      # Move the app's .desktop file
      (callback) ->
        fromPath = './build/resources/linux/app.desktop'
        toPath = './build/' + dist + '/usr/share/applications/' + manifest.name + '.desktop'
        fs.copy fromPath, toPath, utils.log callback, fromPath, '=>', toPath

      # Move icons
      async.apply async.waterfall, [
        async.apply fs.readdir, './build/resources/linux/icons'
        (files, callback) ->
          async.map files, (file, callback) ->
            size = path.basename file, '.png'
            fromPath = path.join './build/resources/linux/icons', file
            toPath = './build/' + dist + '/usr/share/icons/hicolor/' + size + 'x' + size + '/apps/' + manifest.name + '.png'
            fs.copy fromPath, toPath, utils.log callback, fromPath, '=>', toPath
          , callback
      ]
    ], done

gulp.task 'build', [
  'build:linux32'
  'build:linux64'
]
