const vscode = require('vscode')

const { renderTestOnCursorCommand } = require('./runTestOnCursor')

function copyTestOnCursor (configuration) {
  const command = renderTestOnCursorCommand(configuration)
  vscode.env.clipboard.writeText(command)
}

module.exports = { copyTestOnCursor }
