const vscode = require('vscode')

const { TemplateCommand, RunLastCommand } = require('./terminal')
const { CopyOnCursorCommand } = require('./copy')

function activate (context) {
  console.debug('Activating just-testing...')

  function registerCommand (name, command) {
    context.subscriptions.push(vscode.commands.registerCommand(name, () => command.run()))
  }

  registerCommand('justTesting.runAll', new TemplateCommand('runAllCommand', context))
  registerCommand('justTesting.runFile', new TemplateCommand('runFileCommand', context))
  registerCommand('justTesting.runOnCursor', new TemplateCommand('runOnCursorCommand', context))
  registerCommand('justTesting.runLastCommand', new RunLastCommand(context))
  registerCommand('justTesting.copyOnCursor', new CopyOnCursorCommand())
}

function deactivate () {
  console.debug('Deactivating just-testing...')
}

module.exports = {
  activate,
  deactivate
}
