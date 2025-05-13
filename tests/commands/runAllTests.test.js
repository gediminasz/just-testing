const vscode = require('vscode')

const { runAllTests } = require('../../src/commands/runAllTests')
const { ExtensionError } = require('../../src/errors')

beforeEach(() => {
  vscode.window.terminals[0]._lastCommand = undefined
})

describe('runAllTests', () => {
  const configuration = new Map([
    ['baseCommand', 'pytest'],
    ['runAllCommand', '{base} --cov']
  ])

  it('runs all tests', async () => {
    expect(vscode.window.activeTextEditor).not.toBe(undefined)
    expect(vscode.workspace.workspaceFolders).not.toBe(undefined)

    await runAllTests(configuration)

    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest --cov')
  })

  it('handles no editor being open', async () => {
    vscode.window.activeTextEditor = undefined
    expect(vscode.workspace.workspaceFolders).not.toBe(undefined)

    await runAllTests(configuration)

    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest --cov')
  })

  it('handles no workspace being open', async () => {
    vscode.window.activeTextEditor = undefined
    vscode.workspace.workspaceFolders = undefined

    expect(() => runAllTests(configuration)).toThrow(new ExtensionError('No workspace open!'))
  })
})
