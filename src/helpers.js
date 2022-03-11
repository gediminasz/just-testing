const vscode = require('vscode')

function getActiveEditor () {
  return vscode.window.activeTextEditor
}

function getActiveLanguageId () {
  const editor = getActiveEditor()
  return editor && editor.document.languageId
}

module.exports = {
  getActiveEditor,
  asRelativePath: (path) => vscode.workspace.asRelativePath(path),
  getSetting: (property) => vscode.workspace.getConfiguration('justTesting', {
    languageId: getActiveLanguageId()
  }).get(property),
  writeClipboard: (value) => vscode.env.clipboard.writeText(value)
}
