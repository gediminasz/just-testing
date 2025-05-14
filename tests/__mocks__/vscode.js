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
        languageId: 'python',
        uri: { path: '/root/foo/bar/baz.py' }
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
    getConfiguration: jest.fn((section, scope) => {
      return new Map(Object.entries(vscode.workspace._configuration[section]))
    }),
    asRelativePath (path) {
      return path.replace(/^\/root\//, '')
    },
    getWorkspaceFolder () {
      return this.workspaceFolders[0]
    },
    async saveAll () { return true },
    workspaceFolders: [{ name: 'foo', uri: '/root/' }]
  }
}

module.exports = vscode
