const { Interpolator } = require('../src/interpolate') // TODO GZL interpolator

describe('Interpolator', () => {
  const helpers = {
    getSetting: (key) => {
      switch (key) {
        case 'baseCommand': return 'base-command'
        case 'runOnCursorRegex': return '(line-3)'
        case 'expressions': return {}
      }
    },
    getActiveEditor: () => ({
      document: {
        fileName: 'foo/bar/baz.py',
        lineAt: (i) => ({ text: `line-${i}` })
      },
      selection: { active: { line: 5 } }
    }),
    asRelativePath: (path) => path
  }

  const interpolator = new Interpolator(helpers)
  const interpolate = (template) => interpolator.interpolate(template)

  it('interpolates base', () => {
    expect(interpolate('{base}')).toEqual('base-command')
  })

  it('interpolates fileName', () => {
    expect(interpolate('{fileName}')).toEqual('foo/bar/baz.py')
  })

  it('interpolates module', () => {
    expect(interpolate('{module}')).toEqual('foo.bar.baz')
  })

  it('interpolates testName', () => {
    expect(interpolate('{testName}')).toEqual('line-3')
  })

  it('interpolates line', () => {
    expect(interpolate('{line}')).toEqual('6')
  })

  describe('expressions', () => {
    const helpersWithExpressions = {
      ...helpers,
      getSetting: (key) => {
        switch (key) {
          case 'expressions': return {
            valueExpression: { value: 'foo' },
            regexExpression: { regex: '(line-2)' }
          }
          default: return helpers.getSetting(key)
        }
      }
    }

    const interpolator = new Interpolator(helpersWithExpressions)
    const interpolate = (template) => interpolator.interpolate(template)

    it('interpolates static expressions', () => {
      expect(interpolate('{valueExpression}')).toEqual('foo')
    })

    it('interpolates regex expressions', () => {
      expect(interpolate('{regexExpression}')).toEqual('line-2')
    })
  })
})
