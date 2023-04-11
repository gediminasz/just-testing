const { runTerminalCommand } = require('./terminal')
const helpers = require('./helpers')

function runAllTestsInPath (extensionContext, uri) {
  const template = helpers.getSetting('runFileCommand')
  const fileName = helpers.asRelativePath(uri.path)
  const context = {
    base: helpers.getSetting('baseCommand'),
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
