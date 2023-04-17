const vscode = require('vscode')

const { CopyOnCursorCommand } = require('./copy')
const { ExtensionError } = require('./errors')
const { getConfiguration } = require('./helpers')
const { runAllTests } = require('./commands/runAllTests')
const { RunLastCommand } = require('./terminal')
const { runTestOnCursor } = require('./commands/runTestOnCursor')
const commands = require('./commands')

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
  registerOldStyleCommand('justTesting.runLastCommand', new RunLastCommand(context))
  registerOldStyleCommand('justTesting.copyOnCursor', new CopyOnCursorCommand())

  function registerCommand (name, callback) {
    context.subscriptions.push(
      vscode.commands.registerCommand(name, (...args) => callback(context, getConfiguration(), ...args))
    )
  }

  registerCommand('justTesting.runAll', runAllTests)
  registerCommand('justTesting.runFile', commands.runAllTestsInActiveFile)
  registerCommand('justTesting.runOnCursor', runTestOnCursor)
  registerCommand('justTesting.runFromExplorer', commands.runAllTestsInPath)
}

function deactivate () {
  console.debug('Deactivating just-testing...')
}

module.exports = {
  activate,
  deactivate
}
