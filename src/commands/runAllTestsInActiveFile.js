const vscode = require('vscode')

const { runTerminalCommand } = require('../terminal')
const helpers = require('../helpers')

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

module.exports = { runAllTestsInActiveFile }
