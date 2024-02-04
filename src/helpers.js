const vscode = require('vscode')

// function getActiveLanguageId () {
//   const editor = vscode.window.activeTextEditor
//   return editor && editor.document.languageId
// }

function pathToModule (path) {
  const components = path.split('/')
  const baseName = components.pop()
  const moduleName = baseName.split('.')[0]
  // TODO GZL return [...components, moduleName].join('.')
  return components.length ? components.join('.') + '.' + moduleName : moduleName
}

function getConfiguration () {
  const editor = vscode.window.activeTextEditor
  const scope = editor && editor.document.uri
  return vscode.workspace.getConfiguration('justTesting', scope)
  // return vscode.workspace.getConfiguration('justTesting', { languageId: getActiveLanguageId() })
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
