const { runTerminalCommand } = require('../terminal')
const helpers = require('../helpers')

/**
 * @param {import('vscode').ExtensionContext} extensionContext
 * @param {import('vscode').WorkspaceConfiguration} configuration
 */
function runAllTests (extensionContext, configuration) {
  const template = configuration.get('runAllCommand')
  const context = {
    base: configuration.get('baseCommand')
  }

  const command = helpers.interpolate(template, context)
  const environmentVariables = helpers.getEnvironmentVariables(configuration)

  runTerminalCommand(extensionContext, command, environmentVariables)
}

module.exports = { runAllTests }
