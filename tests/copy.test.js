const vscode = require('vscode')
const { CopyOnCursorCommand } = require('../src/copy')

describe('CopyOnCursorCommand', () => {
  beforeEach(() => {
    vscode.env = {
      clipboard: {
        writeText (value) {
          this._value = value
        }
      }
    }

    vscode.workspace.getConfiguration = () => ({
      get (key) {
        switch (key) {
          case 'runOnCursorRegex': return 'def (test_.+)\\('
          case 'runOnCursorCommand': return '{testName}'
          case 'expressions': return {}
        }
      }
    })

    vscode.window.activeTextEditor = {
      document: {
        fileName: 'foo/bar/baz.py',
        lineAt: (i) => {
          switch (i) {
            case 3: return { text: 'def test_foo():' }
          }
        }
      },
      selection: { active: { line: 3 } }
    }
  })

  it('writes test command to clipboard', () => {
    (new CopyOnCursorCommand()).run()
    expect(vscode.env.clipboard._value).toEqual('test_foo')
  })
})
