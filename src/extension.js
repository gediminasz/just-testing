const vscode = require('vscode')

const { makeCommand } = require('./terminal')

function activate (context) {
  console.debug('Activating just-testing...')

  function registerCommand (command, callback) {
    context.subscriptions.push(vscode.commands.registerCommand(command, callback))
  }

  registerCommand('justTesting.runAll', makeCommand('runAllCommand'))
  registerCommand('justTesting.runFile', makeCommand('runFileCommand'))
  registerCommand('justTesting.runOnCursor', makeCommand('runOnCursorCommand'))
}

function deactivate () {
  console.debug('Deactivating just-testing...')
}

module.exports = {
  activate,
  deactivate
}
