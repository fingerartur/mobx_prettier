const LIMITS = {
  MAX_COLLECTION_ITEMS: 300,
  MAX_CHARACTERS: 500,
}

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

const inline = (value: unknown) => {
  if (value == null) {
    return ''
  }

  if (Array.isArray(value)) {
    return inlineArray(value)
  }

  if (value instanceof Set) {
    return inlineSet(value)
  }

  if (value instanceof Map) {
    return inlineMap(value)
  }

  if (typeof value === 'object') {
    return inlineObject(value as Record<ObjectKey, unknown>)
  }

  return TEXTS.UNKNOWN
}

type ObjectKey = string | number | symbol

type StringifyOptions = {
  quoteStrings?: boolean
}

const stringifyValue = (value: unknown, options?: StringifyOptions): string => {
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

type CollectionConfig = {
  collection: unknown[]
  prefix: string
  suffix: string
  quoteStrings?: boolean
  isCropped?: boolean
}

type CropConfig = {
  maxLength: number
  padding: number
}

const cropToTextLength = (collection: string[], config: CropConfig) => {
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

const inlineCollection = (config: CollectionConfig) => {
  const { prefix, suffix, collection } = config
  const textValues = collection.map(item => stringifyValue(item, config))
  const values = cropToTextLength(textValues, {
    maxLength: LIMITS.MAX_CHARACTERS,
    padding: TEXTS.SEPARATOR.length,
  })

  const hasEllipsis = config.isCropped || (values.length < textValues.length)
  const ellipsis = hasEllipsis ? TEXTS.ELLIPSIS : ''

  const body = values.join(TEXTS.SEPARATOR)

  return `${prefix}${body}${ellipsis}${suffix}`
}

const cropCollection = <T>(collection: T[]) => {
  if (collection.length > LIMITS.MAX_COLLECTION_ITEMS) {
    return {
      collection: collection.slice(0, LIMITS.MAX_COLLECTION_ITEMS),
      isCropped: true,
    }
  } else {
    return {
      collection,
      isCropped: false,
    }
  }
}

const inlineObject = (value: Record<ObjectKey, unknown>) => {
  const keyValues = Object.keys(value).map(key => {
    return { key, value: value[key] }
  })

  const { collection, isCropped } = cropCollection(keyValues)

  const texts = collection.map(entry => {
    return `${entry.key}: ${stringifyValue(entry.value)}`
  })

  return inlineCollection({ collection: texts, prefix: '{', suffix: '}', isCropped, quoteStrings: false })
}

const inlineArray = (value: unknown[]) => {
  const { collection, isCropped } = cropCollection(value)

  return inlineCollection({ collection, prefix: '[', suffix: ']', isCropped })
}

const inlineSet = (value: Set<unknown>) => {
  const { collection, isCropped } = cropCollection(Array.from(value.values()))

  return inlineCollection({ collection, prefix: '{', suffix: '}', isCropped })
}

const inlineMap = (value: Map<unknown, unknown>) => {
  const { collection, isCropped } = cropCollection(Array.from(value.entries()))

  const texts = collection.map(entry => {
    const key = stringifyValue(entry[0])
    const value = stringifyValue(entry[1])
    return `${key} => ${value}`
  })

  return inlineCollection({ collection: texts, prefix: '{', suffix: '}', isCropped, quoteStrings: false })
}

export { inline }
