/**
 * This script is executed on each page in a dedicated extension scope
 */

import { logger } from './common'

const injectScriptToPage = (scriptUri: string) => {
  const scriptTag = document.createElement('script')
  scriptTag.id = 'mobx_prettier_extension_script'
  scriptTag.className = 'mobx_prettier extension_script'
  scriptTag.type = 'text/javascript'
  scriptTag.src = scriptUri

  document.head.appendChild(scriptTag)
}

window.onload = () => {
  logger.info('Injecting page script...')

  injectScriptToPage(chrome.runtime.getURL('page_script.min.js'))
}
