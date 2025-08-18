const vscode = require('vscode')

const { ExtensionError } = require('../errors')
const { runTerminalCommand } = require('../terminal')
const helpers = require('../helpers')

/**
 * @param {import('vscode').ExtensionContext} extensionContext
 * @param {import('vscode').WorkspaceConfiguration} configuration
 */
function runAllTestsInActiveFile (extensionContext, configuration) {
  const activeEditor = vscode.window.activeTextEditor
  if (!activeEditor) {
    throw new ExtensionError('No file open!')
  }

  const template = configuration.get('runFileCommand')
  const fileName = helpers.asRelativePath(activeEditor.document.fileName)
  const context = {
    base: configuration.get('baseCommand'),
    fileName,
    module: helpers.pathToModule(fileName)
  }

  const command = helpers.interpolate(template, context)
  const environmentVariables = helpers.getEnvironmentVariables(configuration)

  runTerminalCommand(extensionContext, command, environmentVariables)
}

module.exports = { runAllTestsInActiveFile }
