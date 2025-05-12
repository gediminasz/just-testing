const vscode = require('vscode')
const path = require('path')

/**
 * @param {string} value
 * @returns {string}
 */
function pathToModule (value) {
  const { dir, name } = path.parse(value)
  const components = dir.split(path.sep)
  return [...components, name].join('.')
}

/**
 * @returns {vscode.WorkspaceConfiguration}
 */
function getActiveConfiguration () {
  const editor = vscode.window.activeTextEditor
  const scope = editor && editor.document.uri
  return vscode.workspace.getConfiguration('justTesting', scope)
}

/**
 * @param {string} template
 * @param {object} context
 * @returns string
 */
function interpolate (template, context) {
  return Object.entries(context).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, value),
    template
  )
}

/**
 * @param {string} path
 * @returns {string}
 */
function asRelativePath (path) {
  return vscode.workspace.asRelativePath(path, false)
}

module.exports = {
  pathToModule,
  getActiveConfiguration,
  interpolate,
  asRelativePath
}
