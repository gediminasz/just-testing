const _lines = [
  'def test_foo():',
  '    assert True',
  'def bar_test():',
  '    assert True'
]

const _configuration = {
  justTesting: {
    python: new Map([
      ['baseCommand', 'pytest'],
      ['runFileCommand', '{base} {fileName}'],
      ['runOnCursorRegex', 'def (test_.+)\\('],
      ['runOnCursorCommand', '{base} {fileName} -k {testName}'],
      ['expressions', {
        valueExpression: { value: 'static-value' },
        regexExpression: { regex: 'def (.+_test)' }
      }]
    ])
  }
}

const vscode = {
  window: {
    activeTextEditor: {
      document: {
        fileName: '/root/foo/bar/baz.py',
        lineAt (i) {
          return { text: _lines[i] }
        },
        languageId: 'python'
      },
      selection: { active: { line: 3 } }
    },
    terminals: [
      {
        name: 'Just Testing',
        show () {
          this._wasShown = true
        },
        sendText (command) {
          this._lastCommand = command
        }
      }
    ]
  },

  workspace: {
    rootPath: '/root',
    getConfiguration (section, { languageId }) {
      return _configuration[section][languageId]
    },
    asRelativePath (path) {
      return path.replace(/^\/root\//, '')
    },
    async saveAll () { return true }
  }
}

module.exports = vscode
