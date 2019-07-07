const vscode = require('vscode')

const { TemplateCommand, RunLastCommand } = require('./terminal')

function activate (context) {
  console.debug('Activating just-testing...')

  function registerCommand (name, command) {
    context.subscriptions.push(vscode.commands.registerCommand(name, () => command.run()))
  }

  registerCommand('justTesting.runAll', TemplateCommand.fromSetting('runAllCommand', context))
  registerCommand('justTesting.runFile', TemplateCommand.fromSetting('runFileCommand', context))
  registerCommand('justTesting.runOnCursor', TemplateCommand.fromSetting('runOnCursorCommand', context))
  registerCommand('justTesting.runLastCommand', new RunLastCommand(context))
}

function deactivate () {
  console.debug('Deactivating just-testing...')
}

module.exports = {
  activate,
  deactivate
}
