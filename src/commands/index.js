const vscode = require('vscode')

const { runTerminalCommand } = require('../terminal')
const helpers = require('../helpers')

// TODO split this file up

function runAllTests (extensionContext, configuration) {
  const template = configuration.get('runAllCommand')
  const context = {
    base: configuration.get('baseCommand')
  }
  const command = helpers.interpolate(template, context)
  runTerminalCommand(extensionContext, command)
}

function runAllTestsInActiveFile (extensionContext, configuration) {
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
  const command = helpers.interpolate(template, context)
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
  const command = helpers.interpolate(template, context)
  runTerminalCommand(extensionContext, command)
}

module.exports = {
  runAllTests,
  runAllTestsInActiveFile,
  runAllTestsInPath
}
