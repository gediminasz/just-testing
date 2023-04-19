const vscode = require('vscode')

const { copyTestOnCursor } = require('./commands/copyTestOnCursor')
const { getConfiguration } = require('./helpers')
const { runAllTests } = require('./commands/runAllTests')
const { runAllTestsInActiveFile } = require('./commands/runAllTestsInActiveFile')
const { runAllTestsInPath } = require('./commands/runAllTestsInPath')
const { runLastCommand } = require('./commands/runLastCommand')
const { runTestOnCursor } = require('./commands/runTestOnCursor')

function activate (context) {
  console.debug('Activating just-testing...')

  function registerCommand (name, callback) {
    context.subscriptions.push(
      vscode.commands.registerCommand(name, (...args) => callback(context, getConfiguration(), ...args))
    )
  }

  registerCommand('justTesting.copyOnCursor', copyTestOnCursor)
  registerCommand('justTesting.runAll', runAllTests)
  registerCommand('justTesting.runFile', runAllTestsInActiveFile)
  registerCommand('justTesting.runFromExplorer', runAllTestsInPath)
  registerCommand('justTesting.runLastCommand', runLastCommand)
  registerCommand('justTesting.runOnCursor', runTestOnCursor)
}

module.exports = {
  activate
}
