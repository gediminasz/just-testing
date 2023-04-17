const vscode = require('vscode')

function getActiveEditor () {
  return vscode.window.activeTextEditor
}

function getActiveLanguageId () {
  const editor = getActiveEditor()
  return editor && editor.document.languageId
}

function pathToModule (path) {
  const components = path.split('/')
  const baseName = components.pop()
  const moduleName = baseName.split('.')[0]
  return components.length ? components.join('.') + '.' + moduleName : moduleName
}

function getConfiguration () {
  return vscode.workspace.getConfiguration('justTesting', { languageId: getActiveLanguageId() })
}

function interpolate (template, context) {
  return Object.entries(context).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, value),
    template
  )
}
module.exports = {
  getActiveEditor,
  getConfiguration,
  asRelativePath: (path) => vscode.workspace.asRelativePath(path),
  getSetting: (property) => vscode.workspace.getConfiguration('justTesting', {
    languageId: getActiveLanguageId()
  }).get(property),
  writeClipboard: (value) => vscode.env.clipboard.writeText(value),
  pathToModule,
  interpolate
}
