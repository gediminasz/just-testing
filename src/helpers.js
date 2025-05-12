const vscode = require('vscode')

/**
 * @param {string} path
 * @returns {string}
 */
function pathToModule (path) {
  const components = path.split('/')
  const baseName = components.pop()
  const moduleName = baseName.split('.')[0]
  return [...components, moduleName].join('.')
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
  asRelativePath,
}
