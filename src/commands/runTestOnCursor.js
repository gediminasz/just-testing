const vscode = require('vscode')

const { runTerminalCommand } = require('../terminal')
const helpers = require('../helpers')
const { ExtensionError } = require('../errors')

function runTestOnCursor (configuration) {
  const command = renderTestOnCursorCommand(configuration)
  runTerminalCommand(command)
}

function renderTestOnCursorCommand (configuration) {
  const activeEditor = vscode.window.activeTextEditor
  if (!activeEditor) {
    throw new ExtensionError('No file open!')
  }

  const activeLine = activeEditor.selection.active.line

  const testName = () => {
    const value = findMatch(configuration.get('runOnCursorRegex'), activeEditor.document, activeLine)
    if (!value) {
      throw new ExtensionError('No test detected!')
    }
    return value
  }

  const fileName = helpers.asRelativePath(activeEditor.document.fileName)
  const context = {
    base: configuration.get('baseCommand'),
    fileName,
    module: helpers.pathToModule(fileName),
    testName,
    line: activeLine + 1
  }

  for (const [key, expression] of Object.entries(configuration.get('expressions'))) {
    context[key] = () => {
      const value = findMatch(expression.regex, activeEditor.document, activeLine)
      if (!value) {
        throw new ExtensionError(`Invalid expression for "${key}"`)
      }
      return value
    }
  }

  const template = configuration.get('runOnCursorCommand')

  return helpers.interpolate(template, context)
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

module.exports = { runTestOnCursor, renderTestOnCursorCommand }
