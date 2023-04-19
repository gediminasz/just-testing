const vscode = require('vscode')

function getActiveLanguageId () {
  const editor = vscode.window.activeTextEditor
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
  getConfiguration,
  asRelativePath: (path) => vscode.workspace.asRelativePath(path),
  pathToModule,
  interpolate
}
