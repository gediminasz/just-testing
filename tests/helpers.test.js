const vscode = require('vscode')

const helpers = require('../src/helpers')

describe('getActiveConfiguration', () => {
  it('returns configuration based on current file', async () => {
    expect(vscode.window.activeTextEditor.document.uri).not.toBe(undefined)
    expect(vscode.workspace.workspaceFolders).not.toBe(undefined)

    helpers.getActiveConfiguration()

    expect(vscode.workspace.getConfiguration.mock.lastCall)
      .toStrictEqual(['justTesting', vscode.window.activeTextEditor.document.uri])
  })

  it('handles no file being open', async () => {
    vscode.window.activeTextEditor = undefined
    expect(vscode.workspace.workspaceFolders).not.toBe(undefined)

    helpers.getActiveConfiguration()

    expect(vscode.workspace.getConfiguration.mock.lastCall)
      .toStrictEqual(['justTesting', vscode.workspace.workspaceFolders[0]])
  })

  it('handles no workspace being open', async () => {
    vscode.window.activeTextEditor = undefined
    vscode.workspace.workspaceFolders = undefined

    helpers.getActiveConfiguration()

    expect(vscode.workspace.getConfiguration.mock.lastCall).toStrictEqual(['justTesting', undefined])
  })
})
