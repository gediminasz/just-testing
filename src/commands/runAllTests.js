const { runTerminalCommand } = require('../terminal')
const helpers = require('../helpers')

/**
 * @param {import('vscode').ExtensionContext} extensionContext
 * @param {import('vscode').WorkspaceConfiguration} configuration
 */
function runAllTests (extensionContext, configuration) {
  const template = configuration.get('runAllCommand')
  const context = {
    base: configuration.get('baseCommand'),
    root: helpers.getRootPath()
  }

  const command = helpers.interpolate(template, context)

  runTerminalCommand(extensionContext, command)
}

module.exports = { runAllTests }
