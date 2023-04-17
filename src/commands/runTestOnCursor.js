const vscode = require('vscode')

const { runTerminalCommand } = require('../terminal')
const helpers = require('../helpers')

function runTestOnCursor (extensionContext, configuration) {
  const activeEditor = vscode.window.activeTextEditor
  if (!activeEditor) {
    vscode.window.showErrorMessage('No file open!')
    return
  }

  const activeLine = activeEditor.selection.active.line

  const testName = findMatch(configuration.get('runOnCursorRegex'), activeEditor.document, activeLine)
  if (!testName) {
    vscode.window.showErrorMessage('No test detected!')
    return
  }

  const fileName = helpers.asRelativePath(activeEditor.document.fileName)
  const context = {
    base: configuration.get('baseCommand'),
    fileName,
    module: helpers.pathToModule(fileName),
    testName
  }

  for (const [key, expression] of Object.entries(configuration.get('expressions'))) {
    const value = findMatch(expression.regex, activeEditor.document, activeLine)
    if (value === undefined) {
      vscode.window.showErrorMessage(`Invalid expression for "${key}"`)
      return
    }
    context[key] = value
  }

  const template = configuration.get('runOnCursorCommand')
  const command = helpers.interpolate(template, context)
  runTerminalCommand(extensionContext, command)
}

function findMatch (regex, document, lineNumber) {
  for (let i = lineNumber; i >= 0; i--) {
    const line = document.lineAt(i).text
    const match = line.match(regex)
    if (match) {
      return match[1]
    }
  }
}

module.exports = { runTestOnCursor }
