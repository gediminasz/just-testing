const vscode = require('vscode')

const TERMINAL_NAME = 'Just Testing'
const LAST_COMMAND = 'lastCommand'

/**
 * @param {vscode.ExtensionContext} extensionContext
 * @param {string} command
 */
async function runTerminalCommand (extensionContext, command) {
  await vscode.workspace.saveAll()
  extensionContext.workspaceState.update(LAST_COMMAND, command)

  const terminal = obtainTerminal()
  terminal.show(true)
  terminal.sendText(command)
}

/**
 * @returns {vscode.Terminal}
 */
function obtainTerminal () {
  const terminal = vscode.window.terminals.find(terminal => terminal.name === TERMINAL_NAME)
  if (terminal) return terminal

  return vscode.window.createTerminal(TERMINAL_NAME)
}

module.exports = { LAST_COMMAND, runTerminalCommand }
