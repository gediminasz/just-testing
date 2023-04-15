const vscode = require('vscode')

const { runTerminalCommand } = require('./terminal')
const helpers = require('./helpers')

function runallTests (extensionContext, configuration) {
  const template = configuration.get('runAllCommand')
  const context = {
    base: configuration.get('baseCommand')
  }
  const command = interpolate(template, context)
  runTerminalCommand(extensionContext, command)
}

function runallTestsInActiveFile (extensionContext, configuration) {
  const activeEditor = vscode.window.activeTextEditor
  if (!activeEditor) {
    vscode.window.showErrorMessage('No file open!')
    return
  }

  const template = configuration.get('runFileCommand')
  const fileName = helpers.asRelativePath(activeEditor.document.fileName)
  const context = {
    base: configuration.get('baseCommand'),
    fileName,
    module: helpers.pathToModule(fileName)
  }
  const command = interpolate(template, context)
  runTerminalCommand(extensionContext, command)
}

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
  runallTests,
  runallTestsInActiveFile,
  runAllTestsInPath
}
