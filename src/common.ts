const LOGGER_PREFIX = 'mobx_prettier'

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

export { logger }
