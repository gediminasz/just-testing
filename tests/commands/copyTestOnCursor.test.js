const vscode = require('vscode')

const { makeExtensionContext } = require('../helpers')
const { copyTestOnCursor } = require('../../src/commands/copyTestOnCursor')

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
  it('copies the command to run the test on cursor', async () => {
    const extensionContext = makeExtensionContext()
    const configuration = new Map([
      ['baseCommand', 'pytest'],
      ['runOnCursorCommand', '{base} {fileName} -k {testName}'],
      ['runOnCursorRegex', 'def (test_.+)\\('],
      ['expressions', {}]
    ])

    await copyTestOnCursor(extensionContext, configuration)

    expect(vscode.window.terminals[0]._lastCommand).toBe(undefined)
    expect(vscode.env.clipboard._value).toBe('pytest foo/bar/baz.py -k test_foo')
  })
})
