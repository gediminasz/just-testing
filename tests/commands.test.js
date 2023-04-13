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
    const uri = { path: '/path/to/some/file.py' }

    await runAllTestsInPath(extensionContext, configuration, uri)

    expect(vscode.window.terminals[0].lastCommand).toBe('pytest /path/to/some/file.py')
  })

  it('runs tests in a selected directory', async () => {
    const extensionContext = makeExtensionContext()
    const configuration = new Map([
      ['baseCommand', 'pytest'],
      ['runFileCommand', '{base} {fileName}']
    ])
    const uri = { path: '/path/to/some/directory' }

    await runAllTestsInPath(extensionContext, configuration, uri)

    expect(vscode.window.terminals[0].lastCommand).toBe('pytest /path/to/some/directory')
  })

  // TODO test using {module} in template
})
