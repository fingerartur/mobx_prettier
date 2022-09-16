const childProcess = require('child_process')
const fs = require('fs')

const { assertMinNodeVersion, clearDirectory, copyFiles, log, copyFile } = require('./utils.js')

assertMinNodeVersion(16)

const DIRS = {
  ASSETS: './assets',
  DIST: './dist',
}

const FILES = {
  MANIFEST: 'manifest.json',
}


try {
  log.info(`Cleaning ${DIRS.DIST}...`)
  clearDirectory(DIRS.DIST)
} catch (error) {
  log.error(`Failed to clean ${DIRS.DIST}`)
  throw error
}

try {
  log.info('Building sources...')
  childProcess.execSync('npx webpack', { stdio: 'inherit' })
} catch (error) {
  log.error('Failed to build sources')
  throw error
}

try {
  log.info(`Copying assets from ${DIRS.ASSETS} to ${DIRS.DIST}...`)

  copyFiles(DIRS.ASSETS, DIRS.DIST)
} catch (error) {
  log.error('Failed to copy assets')
  throw error
}

try {
  log.info(`Copying ${FILES.MANIFEST} to ${DIRS.DIST}...`)

  fs.copyFileSync(FILES.MANIFEST, `${DIRS.DIST}/${FILES.MANIFEST}`)
} catch (error) {
  log.error('Failed to copy manifest')
  throw error
}


log.success('Success!')
log.success(`All files of the chrome extension are located in ${DIRS.DIST}`)
