const vscode = require('vscode')


async function runTerminalCommand (command, workspaceFolder = undefined) {
  await vscode.workspace.saveAll()
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

module.exports = { runTerminalCommand }
