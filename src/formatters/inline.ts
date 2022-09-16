const TEXTS = {
  UNKNOWN: '(Unknown)',
  OBJECT: 'Object',
  NULL: 'null',
  UNDEFINED: 'undefined',
  FUNCTION: 'f()',
  SET: 'Set',
  MAP: 'Map',
  ARRAY: 'Array',
  SEPARATOR: ', ',
  ELLIPSIS: '...',
}

type ObjectKey = string | number | symbol

type StringifyOptions = {
  quoteStrings?: boolean
}

type CollectionConfig = {
  collection: unknown[]
  prefix: string
  suffix: string
  /**
   * True if strings should be quoted
   *
   * @default true
   * @example "hello" -> "'hello'"
   */
  quoteStrings?: boolean
  /**
   * True if collection has been cropped (is shorter than original)
   */
  isCropped?: boolean
}

type CropConfig = {
  maxLength: number
  /**
   * How many characters padding will be between two string from the array
   *
   * e.g. If the strings will be joined by ', ' then padding is 2
   */
  padding: number
}

type Inlineable = Set<unknown> | Map<unknown, unknown> | unknown[] | Record<ObjectKey, unknown>

type Limits = {
  MAX_COLLECTION_ITEMS: number
  MAX_CHARACTERS: number
}

/**
 * Inliner stringifies variables into a nice one-line preview
 */
class Inliner {
  private limits: Limits = {
    MAX_COLLECTION_ITEMS: 300,
    MAX_CHARACTERS: 500,
  }

  /**
   * Stringify the variable into a nice one-line preview, something like JSON.stringify(), but the result is more suited
   * for a one-line preview of the object in Console.
   *
   * @example // returns "{color: 'blue', jump: f(), layers: Array(3)}""
   */
  inline(value: Inlineable) {
    if (Array.isArray(value)) {
      return this.inlineArray(value)
    }

    if (value instanceof Set) {
      return this.inlineSet(value)
    }

    if (value instanceof Map) {
      return this.inlineMap(value)
    }

    if (typeof value === 'object') {
      return this.inlineObject(value)
    }

    // This should never happen
    return TEXTS.UNKNOWN
  }

  setLimits(limits: Limits) {
    this.limits = limits
  }

  private inlineObject(value: Record<ObjectKey, unknown>) {
    const keyValues = Object.keys(value).map(key => {
      return { key, value: value[key] }
    })

    const { collection, isCropped } = this.cropCollection(keyValues)

    const texts = collection.map(entry => {
      return `${entry.key}: ${this._stringifyValue(entry.value)}`
    })

    return this.inlineCollection({ collection: texts, prefix: '{', suffix: '}', isCropped, quoteStrings: false })
  }

  private inlineArray(value: unknown[]) {
    const { collection, isCropped } = this.cropCollection(value)

    return this.inlineCollection({ collection, prefix: '[', suffix: ']', isCropped })
  }

  private inlineSet(value: Set<unknown>) {
    const { collection, isCropped } = this.cropCollection(Array.from(value.values()))

    return this.inlineCollection({ collection, prefix: '{', suffix: '}', isCropped })
  }

  private inlineMap(value: Map<unknown, unknown>) {
    const { collection, isCropped } = this.cropCollection(Array.from(value.entries()))

    const texts = collection.map(entry => {
      const key = this._stringifyValue(entry[0])
      const value = this._stringifyValue(entry[1])
      return `${key} => ${value}`
    })

    return this.inlineCollection({ collection: texts, prefix: '{', suffix: '}', isCropped, quoteStrings: false })
  }

  private inlineCollection(config: CollectionConfig) {
    const { prefix, suffix, collection } = config
    const textValues = collection.map(item => this._stringifyValue(item, config))
    const values = this.cropToTextLength(textValues, {
      maxLength: this.limits.MAX_CHARACTERS,
      padding: TEXTS.SEPARATOR.length,
    })

    const hasEllipsis = config.isCropped || (values.length < textValues.length)
    const ellipsis = hasEllipsis ? TEXTS.ELLIPSIS : ''

    const body = values.join(TEXTS.SEPARATOR)

    return `${prefix}${body}${ellipsis}${suffix}`
  }

  /**
* Converts value to a short descriptive string.
*/
  _stringifyValue = (value: unknown, options?: StringifyOptions): string => {
    if (value === null) {
      return TEXTS.NULL
    }

    if (value === undefined) {
      return TEXTS.UNDEFINED
    }

    if (typeof value === 'string') {
      if (options?.quoteStrings === false) {
        return value
      }

      return `'${value}'`
    }

    if (typeof value === 'number') {
      return `${value}`
    }

    if (typeof value === 'symbol') {
      return value.toString()
    }

    if (Array.isArray(value)) {
      return `${TEXTS.ARRAY}(${value.length})`
    }

    if (value instanceof Set) {
      return `${TEXTS.SET}(${value.size})`
    }

    if (value instanceof Map) {
      return `${TEXTS.MAP}(${value.size})`
    }

    if (typeof value === 'object') {
      return TEXTS.OBJECT
    }

    if (typeof value === 'function') {
      return TEXTS.FUNCTION
    }

    return TEXTS.UNKNOWN
  }

  /**
   * Crops an array of strings so that the sum of all its elements is not more than `config.maxLength`
   */
  private cropToTextLength = (collection: string[], config: CropConfig) => {
    const { maxLength, padding } = config

    let length = 0
    let lastIndex: number | null = null

    for (let i = 0; i < collection.length; i++) {
      length += collection[i].length + TEXTS.SEPARATOR.length

      if (i > 0) {
        length += padding
      }

      if (length > maxLength) {
        lastIndex = i
        break
      }
    }

    if (lastIndex == null) {
      return collection
    } else {
      const count = lastIndex
      return collection.slice(0, count)
    }
  }

  /**
   * If the collection is very large, it exceeds a limit, this returns only the first N elements
   * so that the limit is satisfied.
   */
  private cropCollection = <T>(collection: T[]) => {
    if (collection.length > this.limits.MAX_COLLECTION_ITEMS) {
      return {
        collection: collection.slice(0, this.limits.MAX_COLLECTION_ITEMS),
        isCropped: true,
      }
    } else {
      return {
        collection,
        isCropped: false,
      }
    }
  }
}

export { Inliner, Inlineable }
