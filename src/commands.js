const vscode = require('vscode')

const { runTerminalCommand } = require('./terminal')
const helpers = require('./helpers')

// TODO split this file up

function runAllTests (extensionContext, configuration) {
  const template = configuration.get('runAllCommand')
  const context = {
    base: configuration.get('baseCommand')
  }
  const command = interpolate(template, context)
  runTerminalCommand(extensionContext, command)
}

function runAllTestsInActiveFile (extensionContext, configuration) {
  const activeEditor = vscode.window.activeTextEditor
  if (!activeEditor) {
    vscode.window.showErrorMessage('No file open!')
    return
  }

  const template = configuration.get('runFileCommand')
  const fileName = helpers.asRelativePath(activeEditor.document.fileName)
  const context = {
    base: configuration.get('baseCommand'),
    fileName,
    module: helpers.pathToModule(fileName)
  }
  const command = interpolate(template, context)
  runTerminalCommand(extensionContext, command)
}

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
  const command = interpolate(template, context)
  runTerminalCommand(extensionContext, command)
}

function runAllTestsInPath (extensionContext, configuration, uri) {
  const template = configuration.get('runFileCommand')
  const fileName = helpers.asRelativePath(uri.path)
  const context = {
    base: configuration.get('baseCommand'),
    fileName,
    module: helpers.pathToModule(fileName)
  }
  const command = interpolate(template, context)
  runTerminalCommand(extensionContext, command)
}

function interpolate (template, context) {
  return Object.entries(context).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, value),
    template
  )
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

module.exports = {
  runAllTests,
  runAllTestsInActiveFile,
  runTestOnCursor,
  runAllTestsInPath
}
