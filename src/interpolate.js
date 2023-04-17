// TODO remove this file

const { ExtensionError } = require('./errors')

class Interpolator {
  constructor (helpers = require('./helpers')) {
    this.helpers = helpers
  }

  interpolate (template) {
    return Object.entries(this.expressions).reduce(
      (template, [key, valueFunction]) => this.applyInterpolation(template, key, valueFunction),
      template
    )
  }

  get expressions () {
    return { ...this.builtInExpressions, ...this.customExpressions }
  }

  get builtInExpressions () {
    return {
      base: () => this.helpers.getSetting('baseCommand'),
      fileName: () => this.activeFileName,
      module: () => this.module,
      testName: () => this.findMatch(this.helpers.getSetting('runOnCursorRegex')),
      line: () => this.activeLine + 1
    }
  }

  get customExpressions () {
    return Object.entries(this.helpers.getSetting('expressions')).reduce(
      (acc, [key, expression]) => ({ ...acc, [key]: this.buildValueFunction(key, expression) }),
      {}
    )
  }

  buildValueFunction (key, expression) {
    if (expression.regex) return () => this.findMatch(expression.regex)
    if (expression.value) return () => expression.value
    throw new ExtensionError(`Invalid expression for "${key}"`)
  }

  applyInterpolation (template, key, valueFunction) {
    const tag = `{${key}}`
    return template.includes(tag) ? template.replace(tag, valueFunction()) : template
  }

  get module () {
    return this.helpers.pathToModule(this.activeFileName)
  }

  get activeFileName () {
    return this.helpers.asRelativePath(this.activeEditor.document.fileName)
  }

  findMatch (regex) {
    let lineNumber = this.activeLine

    while (lineNumber >= 0) {
      const line = this.activeEditor.document.lineAt(lineNumber).text
      const match = line.match(regex)
      if (match) return match[1]

      lineNumber--
    }

    throw new ExtensionError('No test detected!')
  }

  get activeLine () {
    return this.activeEditor.selection.active.line
  }

  get activeEditor () {
    const editor = this.helpers.getActiveEditor()
    if (!editor) throw new ExtensionError('No file open!')
    return editor
  }
}

module.exports = {
  interpolate: (template) => (new Interpolator()).interpolate(template),
  Interpolator
}
