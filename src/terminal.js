const vscode = require('vscode')

const LAST_COMMAND = 'lastCommand'

async function runTerminalCommand (extensionContext, command, workspaceFolder = undefined) {
  await vscode.workspace.saveAll()
  extensionContext.workspaceState.update(LAST_COMMAND, command)

  const terminal = obtainTerminal(workspaceFolder || getActiveWorkspaceFolder())
  terminal.show(true)
  terminal.sendText(command)
}

function obtainTerminal (workspaceFolder) {
  const name = `Just Testing: ${workspaceFolder.name}`
  const terminal = vscode.window.terminals.find(terminal => terminal.name === name)
  if (terminal) return terminal
  return vscode.window.createTerminal({ name, cwd: workspaceFolder.uri })
}

function getActiveWorkspaceFolder () {
  const editor = vscode.window.activeTextEditor
  if (editor === undefined) {
    return vscode.workspace.workspaceFolders[0]
  }
  return vscode.workspace.getWorkspaceFolder(editor.document.uri)
}

module.exports = { LAST_COMMAND, runTerminalCommand }
