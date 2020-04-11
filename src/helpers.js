const vscode = require('vscode')

function getActiveEditor() {
  return vscode.window.activeTextEditor
}

module.exports = {
  getActiveEditor,
  asRelativePath: (path) => vscode.workspace.asRelativePath(path),
  getSetting: (property) => vscode.workspace.getConfiguration('justTesting', {
    languageId: getActiveEditor().document.languageId
  }).get(property)
}