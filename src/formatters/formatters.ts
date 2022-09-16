import { getMobxApi } from '../mobx.api'

import { inline } from './inline'

import type { ChromeFormatter, FormattedOutput } from './types'

const styles = {
  mobxTag: { style: 'color: rgb(0, 136, 54); font-size: 80%; font-weight: bold; margin: 2px;' },
  inlinePreview: { style: 'font-style: italic; color: rgb(1, 30, 26); font-size: 90%;' },
}

/**
 * Formatter for Mobx sets
 */
class MobxFormatter implements ChromeFormatter {
  header(argument: unknown): FormattedOutput | null {
    if (getMobxApi().isObservable(argument)) {
      const jsValue = getMobxApi().toJS(argument)

      return [
        'span', {},
        ['object', { object: jsValue }],
        ['span', styles.mobxTag, 'mobx'],
        ['span', styles.inlinePreview, inline(jsValue)],
      ]
    }

    return null
  }

  hasBody(): boolean {
    return false
  }
}

/**
 * Formatters for mobx data
 */
const MOBX_FORMATTERS = [
  new MobxFormatter(),
]

export { MOBX_FORMATTERS }
