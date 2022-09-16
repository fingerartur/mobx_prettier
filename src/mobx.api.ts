interface MobxApi {
  toJS: (value: unknown) => unknown
  isObservable: (value: unknown) => unknown
}

declare global {
  interface Window {
    mobx: MobxApi
  }
}

/**
 * Make sure Mobx API is available on `window.mobx`
 *
 * @returns {string[]} errors when Mobx API is not available
 */
const validateMobxApi = () => {
  const errors: string[] = []

  if (!window.mobx) {
    errors.push('window.mobx undefined')
    return errors
  }

  if (!window.mobx.isObservable) {
    errors.push('window.mobx.isObservable undefined')
  }

  if (!window.mobx.toJS) {
    errors.push('window.mobx.toJS undefined')
  }

  return errors
}

/**
 * Gets mobx API
 *
 * @throws when mobx API is not present on `window.mobx`
 */
const getMobxApi = () => {
  const errors = validateMobxApi()

  if (errors.length > 0) {
    throw new Error(errors.join(', '))
  } else {
    return window.mobx
  }
}

export {
  getMobxApi,
  validateMobxApi,
}
