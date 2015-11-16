cp = require 'child_process'
path = require 'path'
fs = require 'fs'

asar = require 'asar'
async = require 'async'
del = require 'del'

gulp = require 'gulp'
zip = require 'gulp-zip'

winInstaller = require 'electron-windows-installer'
manifest = require '../src/package.json'

# Create deb and rpm packages for linux32 and linux64
[32, 64].forEach (arch) ->
  ['deb', 'rpm'].forEach (target) ->
    gulp.task 'pack:linux' + arch + ':' + target, ['build:linux' + arch, 'clean:dist:linux' + arch], (done) ->
      if arch == 32
        archName = 'i386'
      else if target is 'deb'
        archName = 'amd64'
      else
        archName = 'x86_64'

      args = [
        '-s dir'
        '-t ' + target
        '--architecture ' + archName
        '--rpm-os linux'
        '--name ' + manifest.name
        '--deb-no-default-config-files'
        '--force' # Overwrite existing files
        '--after-install ./build/resources/linux/after-install.sh'
        '--after-remove ./build/resources/linux/after-remove.sh'
        '--deb-changelog ./CHANGELOG.md'
        '--rpm-changelog ./CHANGELOG.md'
        '--license ' + manifest.license
        '--category "' + manifest.linux.section + '"'
        '--description "' + manifest.description + '"'
        '--url "' + manifest.homepage + '"'
        '--maintainer "' + manifest.author + '"'
        '--vendor "' + manifest.vendorName + '"'
        '--version "' + manifest.version + '"'
        '--package ' + './dist/' + manifest.name + '-VERSION-ARCH.' + target
        '-C ./build/linux' + arch
        '.'
      ]

      async.series [
        # First, compress the source files into an asar archive
        async.apply asar.createPackage,
          './build/linux' + arch + '/opt/' + manifest.name + '/resources/app',
          './build/linux' + arch + '/opt/' + manifest.name + '/resources/app.asar'

        # Remove leftovers
        # async.apply del, './build/linux' + arch + '/opt/' + manifest.name + '/resources/app'

        # Create a file with the target name
        # console.log(target)
        # async.apply fs.writeFile, './build/linux' + arch + '/opt/' + manifest.name + '/pkgtarget', target

        # Package the app

        async.apply cp.exec, 'bundle exec fpm ' + args.join(' ')
      ], done

# Pack for all the platforms
gulp.task 'pack', [
  'pack:linux32:deb'
  'pack:linux64:deb'
  'pack:linux32:rpm'
  'pack:linux64:rpm'
]
