const vscode = require('vscode')

const LAST_COMMAND = 'lastCommand'

async function runTerminalCommand (extensionContext, command) {
  await vscode.workspace.saveAll()
  extensionContext.workspaceState.update(LAST_COMMAND, command)

  const terminal = obtainTerminal()
  terminal.show(true)
  terminal.sendText(command)
}

function obtainTerminal () {
  const workspaceFolder = getActiveWorkspaceFolder()
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
  return vscode.workspace.workspaceFolders.find(f => editor.document.uri.fsPath.includes(f.uri.fsPath))
}

module.exports = { LAST_COMMAND, runTerminalCommand }
