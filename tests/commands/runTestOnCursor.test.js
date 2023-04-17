const vscode = require('vscode')

const { makeExtensionContext } = require('../helpers')
const { runTestOnCursor } = require('../../src/commands/runTestOnCursor')

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
  vscode.window._lastErrorMessage = undefined
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
    const extensionContext = makeExtensionContext()
    await runTestOnCursor(extensionContext, configuration)
    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest foo/bar/baz.py -k test_foo')
  })

  it('handles no test detected', async () => {
    const extensionContext = makeExtensionContext()
    vscode.window.activeTextEditor.selection.active.line = 2

    await runTestOnCursor(extensionContext, configuration)

    expect(vscode.window.terminals[0]._lastCommand).toBe(undefined)
    expect(vscode.window._lastErrorMessage).toBe('No test detected!')
  })

  it('handles no file being open', async () => {
    const extensionContext = makeExtensionContext()
    vscode.window.activeTextEditor = undefined

    await runTestOnCursor(extensionContext, configuration)

    expect(vscode.window.terminals[0]._lastCommand).toBe(undefined)
    expect(vscode.window._lastErrorMessage).toBe('No file open!')
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
      const extensionContext = makeExtensionContext()
      await runTestOnCursor(extensionContext, configuration)
      expect(vscode.window.terminals[0]._lastCommand).toBe('python manage.py test foo.bar.baz.FooTestCase.test_foo')
    })

    it('handles custom expressions without a match', async () => {
      const badConfiguration = new Map(configuration)
      badConfiguration.set('expressions', {
        className: { regex: 'class (.+NotATestCase)\\(' }
      })
      const extensionContext = makeExtensionContext()

      await runTestOnCursor(extensionContext, badConfiguration)

      expect(vscode.window.terminals[0]._lastCommand).toBe(undefined)
      expect(vscode.window._lastErrorMessage).toBe('Invalid expression for "className"')
    })
  })
})
