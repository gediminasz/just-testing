const vscode = require('vscode')

const TERMINAL_NAME = 'Just Testing'
const LAST_COMMAND = 'lastCommand'

/**
 * @param {vscode.ExtensionContext} extensionContext
 * @param {string} command
 * @param {object} [environmentVariables={}]
 */
async function runTerminalCommand (extensionContext, command, environmentVariables = {}) {
  await vscode.workspace.saveAll()
  extensionContext.workspaceState.update(LAST_COMMAND, command)

  const terminal = obtainTerminal(environmentVariables)
  terminal.show(true)
  terminal.sendText(command)
}

/**
 * @param {object} [environmentVariables={}]
 * @returns {vscode.Terminal}
 */
function obtainTerminal (environmentVariables = {}) {
  // If we have environment variables, we need to create a new terminal
  // because existing terminals can't have their env vars changed
  const hasEnvVars = Object.keys(environmentVariables).length > 0

  if (!hasEnvVars) {
    const terminal = vscode.window.terminals.find(terminal => terminal.name === TERMINAL_NAME)
    if (terminal) return terminal
  }

  const options = {
    name: TERMINAL_NAME,
    iconPath: new vscode.ThemeIcon('test-view-icon')
  }

  // Add environment variables if provided
  if (hasEnvVars) {
    options.env = { ...process.env, ...environmentVariables }
  }

  return vscode.window.createTerminal(options)
}

module.exports = { LAST_COMMAND, runTerminalCommand }
