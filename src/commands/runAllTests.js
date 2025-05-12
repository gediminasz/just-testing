const { runTerminalCommand } = require('../terminal')
const helpers = require('../helpers')

/**
 * @param {import('vscode').WorkspaceConfiguration} configuration
 */
function runAllTests (configuration) {
  const template = configuration.get('runAllCommand')
  const context = {
    base: configuration.get('baseCommand')
  }

  const command = helpers.interpolate(template, context)

  runTerminalCommand(command)
}

module.exports = { runAllTests }
