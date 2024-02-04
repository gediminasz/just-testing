const vscode = require('vscode')

function pathToModule (path) {
  const components = path.split('/')
  const baseName = components.pop()
  const moduleName = baseName.split('.')[0]
  return [...components, moduleName].join('.')
}

function getActiveConfiguration () {
  const editor = vscode.window.activeTextEditor
  const scope = editor && editor.document.uri
  return vscode.workspace.getConfiguration('justTesting', scope)
}

function interpolate (template, context) {
  return Object.entries(context).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, value),
    template
  )
}

module.exports = {
  getActiveConfiguration,
  asRelativePath: (path) => vscode.workspace.asRelativePath(path, false),
  pathToModule,
  interpolate
}
