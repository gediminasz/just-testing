const { ExtensionError } = require('../errors')
const { runTerminalCommand, LAST_COMMAND } = require('../terminal')
const helpers = require('../helpers')

/**
 * @param {import('vscode').ExtensionContext} extensionContext
 * @param {import('vscode').WorkspaceConfiguration} configuration
 */
function runLastCommand (extensionContext, configuration) {
  const command = extensionContext.workspaceState.get(LAST_COMMAND)
  if (command) {
    const environmentVariables = helpers.getEnvironmentVariables(configuration)
    runTerminalCommand(extensionContext, command, environmentVariables)
  } else {
    throw new ExtensionError('No tests ran yet!')
  }
}

module.exports = { runLastCommand }
