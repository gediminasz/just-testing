const vscode = require('vscode')
const { ExtensionError } = require('./errors')

/**
 * @param {string} command
 * @param {vscode.WorkspaceFolder | undefined} workspaceFolder
 */
function runTerminalCommand (command, workspaceFolder = undefined) {
  workspaceFolder ||= getActiveWorkspaceFolder()
  if (workspaceFolder === undefined) {
    throw new ExtensionError("No workspace open!")
  }

  vscode.workspace.saveAll().then(() => {
    const terminal = obtainTerminal(workspaceFolder)
    terminal.show(true)
    terminal.sendText(command)
  })
}

/**
 * @param {vscode.WorkspaceFolder} workspaceFolder
 */
function obtainTerminal (workspaceFolder) {
  const name = `Just Testing: ${workspaceFolder.name}`
  const terminal = vscode.window.terminals.find(terminal => terminal.name === name)
  if (terminal) return terminal
  return vscode.window.createTerminal({ name, cwd: workspaceFolder.uri })
}

/**
 * @returns {vscode.WorkspaceFolder | undefined}
 */
function getActiveWorkspaceFolder () {
  const editor = vscode.window.activeTextEditor
  if (editor !== undefined) {
    return vscode.workspace.getWorkspaceFolder(editor.document.uri)
  }
  return vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0]
}

module.exports = { runTerminalCommand }
