type CssString = string

type FormatterStyle = { style?: CssString }

type FormatterTagName = 'div' | 'span' | 'ol' | 'li' | 'table' | 'tr' | 'td'

type FormatterObjectReference = ['object', { object: unknown }]

type FormattedOutput = JsonMl | string | FormatterObjectReference

type JsonMl = [FormatterTagName, FormatterStyle, ...FormattedOutput[]]

/**
 * Formatter to format a variable in console and debugger of Chrome dev tools
 *
 * More info: https://docs.google.com/document/d/18GbcfQ4ddHgwbUzQgALQ6o8VFxtS9eJUD-xl9EjfxOU/edit#
 */
type ChromeFormatter = {
  /**
   * @param {unknown} argument - variable to format
   * @param {Record<string, unknown>} [options] - seems to be custom options (passed by me from parent)
   *
   * @returns custom JsonML formatting for an entity or null if default formatting should be used. The custom formatting
   * is only one line. If it should be expandable, use `this.hasBody(): true` and format the expandable content with `this.body()`
   */
  header: (argument: unknown, options?: Record<string, unknown>) => FormattedOutput | null
  /**
   * @returns true if the line is expandable (e.g. an object such as { x: 4, y: 5 } can be expanded to see its attributes)
   */
  hasBody: (argument: unknown) => boolean
  /**
   * @returns expandable content, should be defined if and only if `this.hasBody()` is `true`
   */
  body?: (argument: unknown) => FormattedOutput | null
}

export { ChromeFormatter, FormattedOutput }
