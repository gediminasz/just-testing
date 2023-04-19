const { runTerminalCommand } = require('../terminal')
const helpers = require('../helpers')

function runAllTests (extensionContext, configuration) {
  const template = configuration.get('runAllCommand')
  const context = {
    base: configuration.get('baseCommand')
  }

  const command = helpers.interpolate(template, context)

  runTerminalCommand(extensionContext, command)
}

module.exports = { runAllTests }
