const { Interpolator } = require('../src/interpolate')

describe('Interpolator', () => {
  const lines = [
    'def test_foo():',
    '    assert True',
    'def bar_test():',
    '    assert True'
  ]

  const helpers = {
    getSetting: (key) => {
      switch (key) {
        case 'baseCommand': return 'base-command'
        case 'runOnCursorRegex': return 'def (test_.+)\\('
        case 'expressions': return {}
      }
    },
    getActiveEditor: () => ({
      document: {
        fileName: 'foo/bar/baz.py',
        lineAt: (i) => ({ text: lines[i] })
      },
      selection: { active: { line: 3 } }
    }),
    asRelativePath: (path) => path
  }

  const interpolate = (template) => (new Interpolator(helpers)).interpolate(template)

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
    expect(interpolate('{testName}')).toEqual('test_foo')
  })

  it('interpolates line', () => {
    expect(interpolate('{line}')).toEqual('4')
  })

  describe('expressions', () => {
    const helpersWithExpressions = {
      ...helpers,
      getSetting: (key) => {
        switch (key) {
          case 'expressions': return {
            valueExpression: { value: 'static-value' },
            regexExpression: { regex: 'def (.+_test)' }
          }
          default: return helpers.getSetting(key)
        }
      }
    }

    const interpolate = (template) => (new Interpolator(helpersWithExpressions)).interpolate(template)

    it('interpolates static expressions', () => {
      expect(interpolate('{valueExpression}')).toEqual('static-value')
    })

    it('interpolates regex expressions', () => {
      expect(interpolate('{regexExpression}')).toEqual('bar_test')
    })
  })
})
