const childProcess = require('child_process')

const { log } = require('./utils.js')

const ARCHIVE = 'epic_screenshot.zip'
const DIRS = {
  DIST: './dist',
}
const FINAL_ARCHIVE = `${DIRS.DIST}/${ARCHIVE}`

log.info('Zipping...')

try {
  // Macbook zip command
  childProcess.execSync(`cd ${DIRS.DIST}; zip -r ${ARCHIVE} .`, { stdio: 'inherit' })
} catch (error) {
  log.error(`Failed to zip ${DIRS.DIST}`)
  throw error
}

log.success('Success!')
log.success(`Zipped package is located in ${FINAL_ARCHIVE}`)
