const getChromeVersion = () => {
  // e.g. 91.0.4472.77
  const versionString = navigator.appVersion.match(/.*Chrome\/([0-9.]+)/)?.[1]

  if (versionString) {
    const [major, minor] = versionString.split('.')

    return {
      major: parseInt(major),
      minor: parseInt(minor),
      versionString,
    }
  }

  return {
    major: 0,
    minor: 0,
    versionString: '0.0',
  }
}

const LOGGER_PREFIX = 'mobx_prettifier'

const logger = {
  info: (...args: unknown[]) => {
    console.info(LOGGER_PREFIX, ...args)
  },
  warn: (...args: unknown[]) => {
    console.warn(LOGGER_PREFIX, ...args)
  },
  error: (...args: unknown[]) => {
    console.error(LOGGER_PREFIX, ...args)
  },
}

export { getChromeVersion, logger }
