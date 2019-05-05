const path = require('path')
const vscode = require('vscode')

const helpers = require('./helpers')

class InterpolationError extends Error { }

const INTERPOLATIONS = {
  base: () => helpers.getSetting('baseCommand'),
  fileName: getFileName,
  module: getModule,
  testName: getTestName,
  line: () => getActiveLine() + 1
}

function interpolate (template) {
  return Object.entries(INTERPOLATIONS).reduce(
    (template, [key, valueFunction]) => applyInterpolation(template, key, valueFunction),
    template
  )
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
  const moduleName = path.parse(baseName).name
  return components.length ? components.join('.') + '.' + moduleName : moduleName
}

function getTestName () {
  let lineNumber = getActiveLine()

  while (lineNumber >= 0) {
    const line = getActiveEditor().document.lineAt(lineNumber).text
    const match = line.match(helpers.getSetting('runOnCursorRegex'))
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
