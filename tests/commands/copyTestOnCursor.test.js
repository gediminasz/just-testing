const vscode = require('vscode')

const { copyTestOnCursor } = require('../../src/commands/copyTestOnCursor')
const { ExtensionError } = require('../../src/errors')

beforeEach(() => {
  vscode.window.activeTextEditor = {
    document: {
      _lines: [
        'class FooTestCase(TestCase):',
        '    def bar_test():',
        '        ...',
        '    def test_foo():',
        '        ...'
      ],
      fileName: '/root/foo/bar/baz.py',
      lineAt (i) {
        return { text: this._lines[i] }
      }
    },
    selection: { active: { line: 4 } }
  }
  vscode.window._lastErrorMessage = undefined
  vscode.window.terminals[0]._lastCommand = undefined
  vscode.env = {
    clipboard: {
      writeText (value) {
        this._value = value
      }
    }
  }
})

describe('copyTestOnCursor', () => {
  const configuration = new Map([
    ['baseCommand', 'pytest'],
    ['runOnCursorCommand', '{base} {fileName} -k {testName}'],
    ['runOnCursorRegex', 'def (test_.+)\\('],
    ['expressions', {}]
  ])

  it('copies the command to run the test on cursor', async () => {
    expect(vscode.window.activeTextEditor).not.toBe(undefined)
    expect(vscode.workspace.workspaceFolders).not.toBe(undefined)

    copyTestOnCursor(configuration)

    expect(vscode.window.terminals[0]._lastCommand).toBe(undefined)
    expect(vscode.env.clipboard._value).toBe('pytest foo/bar/baz.py -k test_foo')
  })

  it('handles no test being found', async () => {
    expect(vscode.window.activeTextEditor).not.toBe(undefined)
    expect(vscode.workspace.workspaceFolders).not.toBe(undefined)
    vscode.window.activeTextEditor.selection.active.line = 1

    expect(() => copyTestOnCursor(configuration)).toThrow(new ExtensionError('No test detected!'))
  })

  it('handles no editor being open', async () => {
    vscode.window.activeTextEditor = undefined
    expect(vscode.workspace.workspaceFolders).not.toBe(undefined)

    expect(() => copyTestOnCursor(configuration)).toThrow(new ExtensionError('No file open!'))
  })
})
