import { getMobxApi } from '../mobx.api'

import { Inliner } from './inline'

import type { Inlineable } from './inline'
import type { ChromeFormatter, FormattedOutput } from './types'

const styles = {
  mobxTag: { style: 'color: rgb(0, 136, 54); font-size: 80%; font-weight: bold; margin: 2px;' },
  inlinePreview: { style: 'font-style: italic; color: rgb(1, 30, 26); font-size: 90%;' },
}

/**
 * Formatter for Mobx variables
 */
class MobxFormatter implements ChromeFormatter {
  private inliner = new Inliner()

  header(argument: unknown): FormattedOutput | null {
    if (getMobxApi().isObservable(argument)) {
      const jsValue = getMobxApi().toJS(argument) as Inlineable

      return [
        'span', {},
        // Let chrome format it with default formatting
        ['object', { object: jsValue }],
        // Tag (just for style)
        ['span', styles.mobxTag, 'mobx'],
        // Inline preview of the data
        ['span', styles.inlinePreview, this.inliner.inline(jsValue)],
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
