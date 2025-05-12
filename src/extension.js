const vscode = require('vscode')

const { copyTestOnCursor } = require('./commands/copyTestOnCursor')
const { ExtensionError } = require('./errors')
const { getActiveConfiguration } = require('./helpers')
const { runAllTests } = require('./commands/runAllTests')
const { runAllTestsInActiveFile } = require('./commands/runAllTestsInActiveFile')
const { runAllTestsInPath } = require('./commands/runAllTestsInPath')
const { runTestOnCursor } = require('./commands/runTestOnCursor')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate (context) {
  console.debug('Activating just-testing...')

  registerCommand(context, 'justTesting.copyOnCursor', copyTestOnCursor)
  registerCommand(context, 'justTesting.runAll', runAllTests)
  registerCommand(context, 'justTesting.runFile', runAllTestsInActiveFile)
  registerCommand(context, 'justTesting.runFromExplorer', runAllTestsInPath)
  registerCommand(context, 'justTesting.runOnCursor', runTestOnCursor)
}

/**
 * @param {vscode.ExtensionContext} context
 * @param {string} name
 * @param {function} callback
 */
function registerCommand (context, name, callback) {
  context.subscriptions.push(
    vscode.commands.registerCommand(name, (...args) => {
      try {
        callback(getActiveConfiguration(), ...args)
      } catch (e) {
        if (e instanceof ExtensionError) {
          vscode.window.showErrorMessage(e.message)
        } else {
          throw e
        }
      }
    })
  )
}

module.exports = {
  activate
}
