const vscode = require('vscode')

const { makeExtensionContext } = require('../helpers')
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
    ['runOnCursorCommand', '{base} {root}/{fileName} -k {testName}'],
    ['runOnCursorRegex', 'def (test_.+)\\('],
    ['expressions', {}]
  ])

  it('runs a single test', async () => {
    const extensionContext = makeExtensionContext()

    await runTestOnCursor(extensionContext, configuration)

    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest /root/foo/bar/baz.py -k test_foo')
    expect(extensionContext.workspaceState.get('lastCommand')).toBe('pytest /root/foo/bar/baz.py -k test_foo')
  })

  it('handles no test detected', async () => {
    const extensionContext = makeExtensionContext()
    vscode.window.activeTextEditor.selection.active.line = 2

    expect(() => runTestOnCursor(extensionContext, configuration)).toThrow(new ExtensionError('No test detected!'))

    expect(vscode.window.terminals[0]._lastCommand).toBe(undefined)
  })

  it('handles no file being open', async () => {
    const extensionContext = makeExtensionContext()
    vscode.window.activeTextEditor = undefined

    expect(() => runTestOnCursor(extensionContext, configuration)).toThrow(new ExtensionError('No file open!'))

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

      expect(() => runTestOnCursor(extensionContext, badConfiguration))
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
      const extensionContext = makeExtensionContext()

      await runTestOnCursor(extensionContext, configuration)

      expect(vscode.window.terminals[0]._lastCommand).toBe('rspec foo/bar/baz.py:5')
    })
  })
})
