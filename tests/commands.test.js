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

    await runAllTestsInPath(extensionContext, { path: '/path/to/some/file.py' })

    expect(vscode.window.terminals[0].lastCommand).toBe('pytest /path/to/some/file.py')
  })

  it('runs tests in a selected directory', async () => {
    const extensionContext = makeExtensionContext()

    await runAllTestsInPath(extensionContext, { path: '/path/to/some/directory' })

    expect(vscode.window.terminals[0].lastCommand).toBe('pytest /path/to/some/directory')
  })

  // TODO test using {module} in template
})
