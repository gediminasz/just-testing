const { interpolate } = require('../src/interpolate')

describe('Interpolator', () => {
  it('interpolates base', () => {
    expect(interpolate('{base}')).toEqual('pytest')
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

  it('interpolates static expressions', () => {
    expect(interpolate('{valueExpression}')).toEqual('static-value')
  })

  it('interpolates regex expressions', () => {
    expect(interpolate('{regexExpression}')).toEqual('bar_test')
  })
})
