const vscode = require('vscode')

const helpers = require('./helpers')

class InterpolationError extends Error { }

const BUILT_IN_EXPRESSIONS = {
  base: () => helpers.getSetting('baseCommand'),
  fileName: getFileName,
  module: getModule,
  testName: () => findMatch(helpers.getSetting('runOnCursorRegex')),
  line: () => getActiveLine() + 1
}

function interpolate (template) {
  const expressions = { ...BUILT_IN_EXPRESSIONS, ...collectExpressions() }

  return Object.entries(expressions).reduce(
    (template, [key, valueFunction]) => applyInterpolation(template, key, valueFunction),
    template
  )
}

function collectExpressions () {
  return Object.entries(helpers.getSetting('expressions')).reduce(
    (acc, [key, expression]) => ({ ...acc, [key]: buildValueFunction(key, expression) }),
    {}
  )
}

function buildValueFunction (key, expression) {
  if (expression.regex) return () => findMatch(expression.regex)
  if (expression.value) return () => expression.value
  throw new InterpolationError(`Invalid expression for "${key}"`)
}

function applyInterpolation (template, key, valueFunction) {
  const tag = `{${key}}`
  return template.includes(tag) ? template.replace(tag, valueFunction()) : template
}

function getFileName () {
  return vscode.workspace.asRelativePath(getActiveEditor().document.fileName)
}

function getModule () {
  const components = getFileName().split('/')
  const baseName = components.pop()
  const moduleName = baseName.split('.')[0]
  return components.length ? components.join('.') + '.' + moduleName : moduleName
}

function findMatch (regex) {
  let lineNumber = getActiveLine()

  while (lineNumber >= 0) {
    const line = getActiveEditor().document.lineAt(lineNumber).text
    const match = line.match(regex)
    if (match) return match[1]

    lineNumber--
  }

  throw new InterpolationError('No test detected!')
}

function getActiveLine () {
  return getActiveEditor().selection.active.line
}

function getActiveEditor () {
  const editor = vscode.window.activeTextEditor
  if (!editor) throw new InterpolationError('No file open!')
  return editor
}

module.exports = { interpolate, InterpolationError }
