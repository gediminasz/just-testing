const vscode = require('vscode')

const { renderTestOnCursorCommand } = require('./runTestOnCursor')

/**
 * @param {vscode.ExtensionContext} _
 * @param {vscode.WorkspaceConfiguration} configuration
 */
function copyTestOnCursor (_, configuration) {
  const command = renderTestOnCursorCommand(configuration)
  vscode.env.clipboard.writeText(command)
}

module.exports = { copyTestOnCursor }
