const vscode = require('vscode')

const { runAllTestsInPath } = require('../src/commands')
const { makeExtensionContext } = require('./helpers')

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
      },
      languageId: 'python'
    },
    selection: { active: { line: 4 } }
  }
  vscode.window._lastErrorMessage = undefined
  vscode.window.terminals[0]._lastCommand = undefined
})

describe('runAllTestsInPath', () => {
  it('runs tests in a selected file', async () => {
    const extensionContext = makeExtensionContext()
    const configuration = new Map([
      ['baseCommand', 'pytest'],
      ['runFileCommand', '{base} {fileName}']
    ])
    const uri = { path: '/root/tests/foo/test_bar.py' }

    await runAllTestsInPath(extensionContext, configuration, uri)

    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest tests/foo/test_bar.py')
  })

  it('runs tests in a selected directory', async () => {
    const extensionContext = makeExtensionContext()
    const configuration = new Map([
      ['baseCommand', 'pytest'],
      ['runFileCommand', '{base} {fileName}']
    ])
    const uri = { path: '/root/tests/foo/' }

    await runAllTestsInPath(extensionContext, configuration, uri)

    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest tests/foo/')
  })

  it('runs tests in a selected file as module', async () => {
    const extensionContext = makeExtensionContext()
    const configuration = new Map([
      ['baseCommand', 'pytest'],
      ['runFileCommand', '{base} {module}']
    ])
    const uri = { path: '/root/tests/foo/test_bar.py' }

    await runAllTestsInPath(extensionContext, configuration, uri)

    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest tests.foo.test_bar')
  })

  it('runs tests in a selected directory as module', async () => {
    const extensionContext = makeExtensionContext()
    const configuration = new Map([
      ['baseCommand', 'pytest'],
      ['runFileCommand', '{base} {module}']
    ])
    const uri = { path: '/root/tests/foo' }

    await runAllTestsInPath(extensionContext, configuration, uri)

    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest tests.foo')
  })
})
