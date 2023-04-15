const { runTerminalCommand } = require('./terminal')
const helpers = require('./helpers')

function runAllTestsInPath (extensionContext, configuration, uri) {
  const template = configuration.get('runFileCommand')
  const fileName = helpers.asRelativePath(uri.path)
  const context = {
    base: configuration.get('baseCommand'),
    fileName,
    module: helpers.pathToModule(fileName)
  }
  const command = interpolate(template, context)
  runTerminalCommand(extensionContext, command)
}

function interpolate (template, context) {
  return Object.entries(context).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, value),
    template
  )
}

module.exports = {
  runAllTestsInPath
}
