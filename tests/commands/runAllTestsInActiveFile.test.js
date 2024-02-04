const vscode = require('vscode')

const { ExtensionError } = require('../../src/errors')
const { makeExtensionContext } = require('../helpers')
const { runAllTestsInActiveFile } = require('../../src/commands/runAllTestsInActiveFile')

beforeEach(() => {
  vscode.window.terminals[0]._lastCommand = undefined
})

describe('runAllTestsInActiveFile', () => {
  it('runs all tests in the active file', async () => {
    const extensionContext = makeExtensionContext()
    const configuration = new Map([
      ['baseCommand', 'pytest'],
      ['runFileCommand', '{base} {fileName}']
    ])

    await runAllTestsInActiveFile(extensionContext, configuration)

    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest foo/bar/baz.py')
  })

  it('runs all tests in the active file as module', async () => {
    const extensionContext = makeExtensionContext()
    const configuration = new Map([
      ['baseCommand', 'pytest'],
      ['runFileCommand', '{base} {module}']
    ])

    await runAllTestsInActiveFile(extensionContext, configuration)

    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest foo.bar.baz')
  })

  it('handles no file being open', async () => {
    const extensionContext = makeExtensionContext()
    const configuration = new Map([
      ['baseCommand', 'pytest'],
      ['runFileCommand', '{base} {module}']
    ])
    vscode.window.activeTextEditor = undefined

    expect(() => runAllTestsInActiveFile(extensionContext, configuration)).toThrow(new ExtensionError('No file open!'))

    expect(vscode.window.terminals[0]._lastCommand).toBe(undefined)
  })
})
