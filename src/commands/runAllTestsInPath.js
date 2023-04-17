const { runTerminalCommand } = require('../terminal')
const helpers = require('../helpers')

function runAllTestsInPath (extensionContext, configuration, uri) {
  const template = configuration.get('runFileCommand')
  const fileName = helpers.asRelativePath(uri.path)
  const context = {
    base: configuration.get('baseCommand'),
    fileName,
    module: helpers.pathToModule(fileName)
  }
  const command = helpers.interpolate(template, context)
  runTerminalCommand(extensionContext, command)
}

module.exports = { runAllTestsInPath }
