/**
 * This script is executed in the scope of the real page
 */

import { logger } from '../common'
import { validateMobxApi } from '../mobx.api'

import { MOBX_FORMATTERS } from './formatters'

declare global {
  interface Window { devtoolsFormatters: unknown[] }
}

const installFormatters = () => {
  window.devtoolsFormatters = window.devtoolsFormatters ?? []

  MOBX_FORMATTERS.forEach(formatter => {
    window.devtoolsFormatters.push(formatter)
  })
}

/**
 * Install Dev Tool Formatters that convert Mobx data to plain easily readable objects.
 *
 * If Mobx is not present in `window.mobx` nothing happens.
 */
const installChromeFormattersForMobx = () => {
  const errors = validateMobxApi()

  if (errors.length > 0) {
    logger.info('Mobx not detected, if you are using mobx, make sure to "import * as mobx from mobx; window.mobx = mobx;"')
    return
  }

  logger.info('Installing chrome formatters for Mobx objects...')

  installFormatters()

  logger.info('Formatters installed.')

}

export { installChromeFormattersForMobx }
