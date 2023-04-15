const vscode = require('vscode')

const { CopyOnCursorCommand } = require('./copy')
const { ExtensionError } = require('./errors')
const { getConfiguration } = require('./helpers')
const commands = require('./commands')
const { TemplateCommand, RunLastCommand } = require('./terminal')

function activate (context) {
  console.debug('Activating just-testing...')

  function registerOldStyleCommand (name, command) {
    context.subscriptions.push(vscode.commands.registerCommand(name, () => {
      try {
        command.run()
      } catch (e) {
        if (e instanceof ExtensionError) {
          vscode.window.showErrorMessage(e.message)
        } else {
          console.error(e)
          throw e
        }
      }
    }))
  }

  // TODO rework class based commands into functions like runAllTestsInPath below
  registerOldStyleCommand('justTesting.runFile', new TemplateCommand('runFileCommand', context))
  registerOldStyleCommand('justTesting.runOnCursor', new TemplateCommand('runOnCursorCommand', context))
  registerOldStyleCommand('justTesting.runLastCommand', new RunLastCommand(context))
  registerOldStyleCommand('justTesting.copyOnCursor', new CopyOnCursorCommand())

  function registerCommand (name, callback) {
    context.subscriptions.push(
      vscode.commands.registerCommand(name, (...args) => callback(context, getConfiguration(), ...args))
    )
  }

  registerCommand('justTesting.runAll', commands.runallTests)
  registerCommand('justTesting.runFromExplorer', commands.runAllTestsInPath)
}

function deactivate () {
  console.debug('Deactivating just-testing...')
}

module.exports = {
  activate,
  deactivate
}
