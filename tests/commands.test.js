const vscode = require('vscode')

const { runAllTests, runAllTestsInActiveFile, runAllTestsInPath } = require('../src/commands')
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

describe('runAllTests', () => {
  it('runs all tests', async () => {
    const extensionContext = makeExtensionContext()
    const configuration = new Map([
      ['baseCommand', 'pytest'],
      ['runAllCommand', '{base} --cov']
    ])

    await runAllTests(extensionContext, configuration)

    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest --cov')
  })
})

describe('runAllTestsInActiveFile', () => {
  it('runs all tests in the active file', async () => {
    const extensionContext = makeExtensionContext()
    const configuration = new Map([
      ['baseCommand', 'pytest'],
      ['runFileCommand', '{base} {fileName}']
    ])

    await runAllTestsInActiveFile(extensionContext, configuration)

    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest foo/bar/baz.py')
  })

  it('runs all tests in the active file as module', async () => {
    const extensionContext = makeExtensionContext()
    const configuration = new Map([
      ['baseCommand', 'pytest'],
      ['runFileCommand', '{base} {module}']
    ])

    await runAllTestsInActiveFile(extensionContext, configuration)

    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest foo.bar.baz')
  })

  it('handles no file being open', async () => {
    const extensionContext = makeExtensionContext()
    const configuration = new Map([
      ['baseCommand', 'pytest'],
      ['runFileCommand', '{base} {module}']
    ])
    vscode.window.activeTextEditor = undefined

    await runAllTestsInActiveFile(extensionContext, configuration)

    expect(vscode.window.terminals[0]._lastCommand).toBe(undefined)
    expect(vscode.window._lastErrorMessage).toBe('No file open!')
  })
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
