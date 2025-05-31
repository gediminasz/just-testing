const path = require('path')

const vscode = require('vscode')

/**
 * @returns {string}
 */
function getActiveLanguageId () {
  const editor = vscode.window.activeTextEditor
  if (editor === undefined) {
    return 'plaintext'
  }
  return editor.document.languageId
}

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
function getConfiguration () {
  return vscode.workspace.getConfiguration('justTesting', { languageId: getActiveLanguageId() })
}

/**
 * @returns {string | undefined}
 */
function getRootPath () {
  return vscode.workspace.rootPath
}

/**
 * @param {string} template
 * @param {object} context
 * @returns string
 */
function interpolate (template, context) {
  return Object.entries(context).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, value),
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
  getConfiguration,
  getRootPath,
  asRelativePath,
  pathToModule,
  interpolate
}
