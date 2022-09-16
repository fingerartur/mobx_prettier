const fs = require('fs')

const chalk = require('chalk')

const log = {
  info: message => console.info(chalk.yellowBright(message)),
  success: message => console.info(chalk.green(message)),
  error: message => console.error(chalk.red(message)),
}

/**
 * Make sure node version in which this script is running is at least,
 * otherwise exit
 *
 * @param {number} version
 */
const assertMinNodeVersion = (version) => {
  const [majorVersion] = process.version.substr(1).split('.')

  if (majorVersion < version) {
    console.error(`Node version must be at least Node.js ${version}`)
    process.exit(1)
  }
}

/**
 * Remove all files in directory (not recursive)
 *
 * @param {string} directory - directory path
 */
const clearDirectory = (directory) => {
  const assetFilenames = fs.readdirSync(directory)

  assetFilenames.forEach(filename => {
    fs.rmSync(`${directory}/${filename}`)
  })
}

/**
 * Copy one files
 *
 * @param {string} source - source path
 * @param {string} target - destination path
 */
const copyFile = (source, target) => {
  fs.copyFileSync(source, target)
}

/**
 * Copy all files from one directory to another
 *
 * @param {string} sourceDirectory - source directory path
 * @param {string} destinationDirectory - destination directory path
 */
const copyFiles = (sourceDirectory, destinationDirectory) => {
  const assetFilenames = fs.readdirSync(sourceDirectory)

  assetFilenames.forEach(filename => {
    copyFile(`${sourceDirectory}/${filename}`, `${destinationDirectory}/${filename}`)
  })
}

module.exports = {
  assertMinNodeVersion,
  clearDirectory,
  copyFile,
  copyFiles,
  log,
}
