const vscode = require('vscode')

const { runTerminalCommand } = require('../terminal')
const helpers = require('../helpers')

/**
 * @param {vscode.WorkspaceConfiguration} _
 * @param {vscode.Uri} uri
 */
function runAllTestsInPath (_, uri) {
  const configuration = vscode.workspace.getConfiguration('justTesting', uri)
  const template = configuration.get('runFileCommand')
  const fileName = helpers.asRelativePath(uri.path)
  const context = {
    base: configuration.get('baseCommand'),
    fileName,
    module: helpers.pathToModule(fileName)
  }

  const command = helpers.interpolate(template, context)

  const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri)
  runTerminalCommand(command, workspaceFolder)
}

module.exports = { runAllTestsInPath }
