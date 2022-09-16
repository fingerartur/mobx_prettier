import { Inliner } from './inline'

describe('inline', () => {
  const inliner = new Inliner()

  const shortInliner = new Inliner()
  shortInliner.setLimits({
    MAX_CHARACTERS: 10,
    MAX_COLLECTION_ITEMS: 2,
  })

  describe('can stringify value to a simple descriptive text', () => {
    it('string', () => {
      const result = inliner._stringifyValue('hello')
      expect(result).toBe('\'hello\'')
    })

    it('number', () => {
      const result = inliner._stringifyValue(555)
      expect(result).toBe('555')
    })

    it('null', () => {
      const result = inliner._stringifyValue(null)
      expect(result).toBe('null')
    })

    it('undefined', () => {
      const result = inliner._stringifyValue(undefined)
      expect(result).toBe('undefined')
    })

    it('array', () => {
      const result = inliner._stringifyValue([1, 2, 3])
      expect(result).toBe('Array(3)')
    })

    it('set', () => {
      const result = inliner._stringifyValue(new Set([1, 2, 3, 4]))
      expect(result).toBe('Set(4)')
    })

    it('map', () => {
      const result = inliner._stringifyValue(new Map(Object.entries({
        a: 'aloha',
        b: 'bear',
      })))
      expect(result).toBe('Map(2)')
    })

    it('function', () => {
      const result = inliner._stringifyValue(function HelloWorld() { })
      expect(result).toBe('f()')
    })
  })

  describe('can inline a variable (for preview)', () => {
    describe('array', () => {
      it('empty array', () => {
        const result = inliner.inline([])
        expect(result).toBe('[]')
      })

      it('simple number array', () => {
        const result = inliner.inline([1, 2, 3])
        expect(result).toBe('[1, 2, 3]')
      })

      it('simple string array', () => {
        const result = inliner.inline(['hello', 'world'])
        expect(result).toBe('[\'hello\', \'world\']')
      })

      it('object array', () => {
        const result = inliner.inline([{ name: 'Tom' }, { name: 'Jerry' }])
        expect(result).toBe('[Object, Object]')
      })

      it('extra long array', () => {
        const result = shortInliner.inline([1, 2, 3])
        expect(result).toBe('[1, 2...]')
      })

      it('extra long items', () => {
        const result = shortInliner.inline(['hey', 'this item is very long'])
        expect(result).toBe('[\'hey\'...]')
      })
    })

    describe('set', () => {
      it('empty set', () => {
        const result = inliner.inline(new Set())
        expect(result).toBe('{}')
      })

      it('simple number set', () => {
        const result = inliner.inline(new Set([1, 2, 3]))
        expect(result).toBe('{1, 2, 3}')
      })

      it('simple string set', () => {
        const result = inliner.inline(new Set(['hello', 'world']))
        expect(result).toBe('{\'hello\', \'world\'}')
      })

      it('object set', () => {
        const result = inliner.inline(new Set([{ name: 'Tom' }, { name: 'Jerry' }]))
        expect(result).toBe('{Object, Object}')
      })

      it('extra large set', () => {
        const result = shortInliner.inline(new Set([1, 2, 3]))
        expect(result).toBe('{1, 2...}')
      })
    })

    describe('map', () => {
      const shortInliner2 = new Inliner()
      shortInliner2.setLimits({
        MAX_CHARACTERS: 20,
        MAX_COLLECTION_ITEMS: 2,
      })

      it('empty map', () => {
        const result = inliner.inline(new Map())
        expect(result).toBe('{}')
      })

      it('simple number to number map', () => {
        const result = inliner.inline(new Map(Object.entries({ 1: 10, 2: 15 })))
        expect(result).toBe('{\'1\' => 10, \'2\' => 15}')
      })

      it('simple string to string map', () => {
        const result = inliner.inline(new Map(Object.entries({ hello: 'world', hey: 'Kitty' })))
        expect(result).toBe('{\'hello\' => \'world\', \'hey\' => \'Kitty\'}')
      })

      it('complex map', () => {
        const map = new Map()
        map.set({ x: 1 }, { y: 2 })
        map.set({ x: 1 }, { y: 2 })

        const result = inliner.inline(map)
        expect(result).toBe('{Object => Object, Object => Object}')
      })

      it('extra large map', () => {
        const result = shortInliner2.inline(new Map(Object.entries({ hello: 'hi', hey: 'Kitty' })))
        expect(result).toBe('{\'hello\' => \'hi\'...}')
      })

      it('map with extra large item', () => {
        const result = shortInliner2.inline(new Map(Object.entries({ hello: 'hiiiiiiiiiiiiiiiiii' })))
        expect(result).toBe('{...}')
      })
    })

    describe('object', () => {
      it('simple object', () => {
        const result = inliner.inline({
          name: 'Alfa Romeo',
          year: 2004,
          drive: () => null,
        })

        expect(result).toBe('{name: \'Alfa Romeo\', year: 2004, drive: f()}')
      })

      it('nested object', () => {
        const result = inliner.inline({
          name: 'Alfa Romeo',
          year: 2004,
          repairHistory: [
            { year: 2006 },
            { year: 2007 },
          ],
          carParts: new Set(['wheels', 'wind shield', 'mirrors']),
          drive: () => null,
          status: null,
        })

        expect(result).toBe('{name: \'Alfa Romeo\', year: 2004, repairHistory: Array(2), carParts: Set(3), drive: f(), status: null}')
      })
    })
  })
})
