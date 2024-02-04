const vscode = require('vscode')

const { runTestOnCursor } = require('../../src/commands/runTestOnCursor')
const { ExtensionError } = require('../../src/errors')

beforeEach(() => {
  vscode.window.activeTextEditor = {
    document: {
      _lines: [
        'class FooTestCase(TestCase):',
        '    def bar_test():',
        '        ...',
        '    def test_foo():',
        '        ...'
      ],
      fileName: '/root/foo/bar/baz.py',
      lineAt (i) {
        return { text: this._lines[i] }
      }
    },
    selection: { active: { line: 4 } }
  }
  vscode.window.terminals[0]._lastCommand = undefined
})

describe('runTestOnCursor', () => {
  const configuration = new Map([
    ['baseCommand', 'pytest'],
    ['runOnCursorCommand', '{base} {fileName} -k {testName}'],
    ['runOnCursorRegex', 'def (test_.+)\\('],
    ['expressions', {}]
  ])

  it('runs a single test', async () => {
    await runTestOnCursor(configuration)

    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest foo/bar/baz.py -k test_foo')
  })

  it('handles no test detected', async () => {
    vscode.window.activeTextEditor.selection.active.line = 2

    expect(() => runTestOnCursor(configuration)).toThrow(new ExtensionError('No test detected!'))

    expect(vscode.window.terminals[0]._lastCommand).toBe(undefined)
  })

  it('handles no file being open', async () => {
    vscode.window.activeTextEditor = undefined

    expect(() => runTestOnCursor(configuration)).toThrow(new ExtensionError('No file open!'))

    expect(vscode.window.terminals[0]._lastCommand).toBe(undefined)
  })

  describe('given django-like configuration', () => {
    const configuration = new Map([
      ['baseCommand', 'python manage.py test'],
      ['runOnCursorCommand', '{base} {module}.{className}.{testName}'],
      ['runOnCursorRegex', 'def (test_.+)\\('],
      ['expressions', {
        className: { regex: 'class (.+TestCase)\\(' }
      }]
    ])

    it('runs a single test', async () => {
      await runTestOnCursor(configuration)
      expect(vscode.window.terminals[0]._lastCommand).toBe('python manage.py test foo.bar.baz.FooTestCase.test_foo')
    })

    it('handles custom expressions without a match', async () => {
      const badConfiguration = new Map(configuration)
      badConfiguration.set('expressions', {
        className: { regex: 'class (.+NotATestCase)\\(' }
      })

      expect(() => runTestOnCursor(badConfiguration))
        .toThrow(new ExtensionError('Invalid expression for "className"'))

      expect(vscode.window.terminals[0]._lastCommand).toBe(undefined)
    })
  })

  describe('given rspec-like configuration', () => {
    const configuration = new Map([
      ['baseCommand', 'rspec'],
      ['runOnCursorCommand', '{base} {fileName}:{line}'],
      ['expressions', {}]
    ])

    it('runs a single test', async () => {
      await runTestOnCursor(configuration)

      expect(vscode.window.terminals[0]._lastCommand).toBe('rspec foo/bar/baz.py:5')
    })
  })
})
