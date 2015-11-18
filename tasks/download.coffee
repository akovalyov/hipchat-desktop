fs = require 'fs-extra'
gulp = require 'gulp'

electronDownloader = require 'gulp-electron-downloader'
manifest = require '../src/package.json'

# Flags to keep track of downloads
downloaded =
  linux32: false
  linux64: false

[
  ['linux', 'ia32', 'linux32', './build/linux32/opt/' + manifest.name]
  ['linux', 'x64', 'linux64', './build/linux64/opt/' + manifest.name]
].forEach (release) ->
  [platform, arch, dist, outputDir] = release

  gulp.task 'download:' + dist, ['kill:' + dist], (done) ->
    # Skip if already downloaded to speed up auto-reload
    if downloaded[dist]
      return done()

    electronDownloader
      version: 'v0.35.0'
      cacheDir: './cache'
      outputDir: outputDir
      platform: platform
      arch: arch
    , ->
      downloaded[dist] = true

      done()

# Download the Electron binaries for all platforms
gulp.task 'download', [
  'download:linux32'
  'download:linux64'
]
