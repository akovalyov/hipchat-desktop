gulp = require 'gulp'
githubRelease = require 'gulp-github-release'
manifest = require '../src/package.json'
env = require 'node-env-file'

env(__dirname + '/../.env')
# Upload every file in ./dist to GitHub
gulp.task 'publish:github', ['pack:linux32:deb', 'pack:linux64:deb'], ->
  if not process.env.GITHUB_TOKEN
    return console.warn 'GITHUB_TOKEN env var not set.'

  gulp.src './dist/*'
    .pipe githubRelease
      token: process.env.GITHUB_TOKEN
      manifest: manifest
      prerelease: true,
      repo: 'hipchat-desktop'
      owner: 'akovalyov'

# TODO: Upload to PPA
