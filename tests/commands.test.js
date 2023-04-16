const vscode = require('vscode')

const { runallTests, runallTestsInActiveFile, runTestOnCursor, runAllTestsInPath } = require('../src/commands')

const makeExtensionContext = () => (
  {
    workspaceState: {
      data: new Map(),
      update (key, value) {
        this.data.set(key, value)
      }
    }
  }
)

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

describe('runallTests', () => {
  it('runs all tests', async () => {
    const extensionContext = makeExtensionContext()
    const configuration = new Map([
      ['baseCommand', 'pytest'],
      ['runAllCommand', '{base} --cov']
    ])

    await runallTests(extensionContext, configuration)

    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest --cov')
  })
})

describe('runallTestsInActiveFile', () => {
  it('runs all tests in the active file', async () => {
    const extensionContext = makeExtensionContext()
    const configuration = new Map([
      ['baseCommand', 'pytest'],
      ['runFileCommand', '{base} {fileName}']
    ])

    await runallTestsInActiveFile(extensionContext, configuration)

    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest foo/bar/baz.py')
  })

  it('runs all tests in the active file as module', async () => {
    const extensionContext = makeExtensionContext()
    const configuration = new Map([
      ['baseCommand', 'pytest'],
      ['runFileCommand', '{base} {module}']
    ])

    await runallTestsInActiveFile(extensionContext, configuration)

    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest foo.bar.baz')
  })

  it('handles no file being open', async () => {
    const extensionContext = makeExtensionContext()
    const configuration = new Map([
      ['baseCommand', 'pytest'],
      ['runFileCommand', '{base} {module}']
    ])
    vscode.window.activeTextEditor = undefined

    await runallTestsInActiveFile(extensionContext, configuration)

    expect(vscode.window.terminals[0]._lastCommand).toBe(undefined)
    expect(vscode.window._lastErrorMessage).toBe('No file open!')
  })
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
