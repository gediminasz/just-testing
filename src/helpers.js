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

module.exports = {
  getActiveEditor,
  asRelativePath: (path) => vscode.workspace.asRelativePath(path),
  getSetting: (property) => vscode.workspace.getConfiguration('justTesting', {
    languageId: getActiveLanguageId()
  }).get(property),
  writeClipboard: (value) => vscode.env.clipboard.writeText(value),
  pathToModule
}
