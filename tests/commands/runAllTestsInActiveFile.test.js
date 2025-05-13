const vscode = require('vscode')

const { ExtensionError } = require('../../src/errors')
const { runAllTestsInActiveFile } = require('../../src/commands/runAllTestsInActiveFile')

beforeEach(() => {
  vscode.window.terminals[0]._lastCommand = undefined
})

describe('runAllTestsInActiveFile', () => {
  const configuration = new Map([
    ['baseCommand', 'pytest'],
    ['runFileCommand', '{base} {fileName}']
  ])

  it('runs all tests in the active file', async () => {
    expect(vscode.window.activeTextEditor).not.toBe(undefined)
    expect(vscode.workspace.workspaceFolders).not.toBe(undefined)

    await runAllTestsInActiveFile(configuration)

    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest foo/bar/baz.py')
  })

  it('runs all tests in the active file as module', async () => {
    expect(vscode.window.activeTextEditor).not.toBe(undefined)
    expect(vscode.workspace.workspaceFolders).not.toBe(undefined)
    const configuration = new Map([
      ['baseCommand', 'pytest'],
      ['runFileCommand', '{base} {module}']
    ])

    await runAllTestsInActiveFile(configuration)

    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest foo.bar.baz')
  })

  it('handles no file being open', async () => {
    vscode.window.activeTextEditor = undefined
    expect(vscode.workspace.workspaceFolders).not.toBe(undefined)

    expect(() => runAllTestsInActiveFile(configuration)).toThrow(new ExtensionError('No file open!'))

    expect(vscode.window.terminals[0]._lastCommand).toBe(undefined)
  })
})
