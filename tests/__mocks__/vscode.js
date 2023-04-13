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
        fileName: 'foo/bar/baz.py',
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
          this.wasShown = true
        },
        sendText (command) {
          this.lastCommand = command
        }
      }
    ]
  },

  workspace: {
    getConfiguration (section, { languageId }) {
      return _configuration[section][languageId]
    },
    asRelativePath (path) {
      return path.replace(/^\/root\//, '')
    },
    async saveAll () { return true }
  },

  env: {
    clipboard: {
      writeText (value) {
        this._value = value
      },
      readText () {
        return this._value
      }
    }
  }
}

module.exports = vscode
