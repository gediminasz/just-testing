const { runAllTestsInPath } = require('../src/commands')
const vscode = require('vscode')

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

describe('runAllTestsInPath', () => {
  it('runs tests in a selected file', async () => {
    const extensionContext = makeExtensionContext()
    const configuration = new Map([
      ['baseCommand', 'pytest'],
      ['runFileCommand', '{base} {fileName}']
    ])
    const uri = { path: '/root/tests/foo/test_bar.py' }

    await runAllTestsInPath(extensionContext, configuration, uri)

    expect(vscode.window.terminals[0].lastCommand).toBe('pytest tests/foo/test_bar.py')
  })

  it('runs tests in a selected directory', async () => {
    const extensionContext = makeExtensionContext()
    const configuration = new Map([
      ['baseCommand', 'pytest'],
      ['runFileCommand', '{base} {fileName}']
    ])
    const uri = { path: '/root/tests/foo/' }

    await runAllTestsInPath(extensionContext, configuration, uri)

    expect(vscode.window.terminals[0].lastCommand).toBe('pytest tests/foo/')
  })

  it('runs tests in a selected file as module', async () => {
    const extensionContext = makeExtensionContext()
    const configuration = new Map([
      ['baseCommand', 'pytest'],
      ['runFileCommand', '{base} {module}']
    ])
    const uri = { path: '/root/tests/foo/test_bar.py' }

    await runAllTestsInPath(extensionContext, configuration, uri)

    expect(vscode.window.terminals[0].lastCommand).toBe('pytest tests.foo.test_bar')
  })

  it('runs tests in a selected directory as module', async () => {
    const extensionContext = makeExtensionContext()
    const configuration = new Map([
      ['baseCommand', 'pytest'],
      ['runFileCommand', '{base} {module}']
    ])
    const uri = { path: '/root/tests/foo' }

    await runAllTestsInPath(extensionContext, configuration, uri)

    expect(vscode.window.terminals[0].lastCommand).toBe('pytest tests.foo')
  })
})
