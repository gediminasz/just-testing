const _lines = [
  'def test_foo():',
  '    assert True',
  'def bar_test():',
  '    assert True'
]

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
        name: 'Just Testing: foo',
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
    _configuration: { justTesting: {} },
    getConfiguration (section) {
      return new Map(Object.entries(this._configuration[section]))
    },
    asRelativePath (path) {
      return path.replace(/^\/root\//, '')
    },
    getWorkspaceFolder () {
      return { name: 'foo', uri: '/root/' }
    },
    async saveAll () { return true },
    workspaceFolders: [{ name: 'foo' }]
  }
}

module.exports = vscode
