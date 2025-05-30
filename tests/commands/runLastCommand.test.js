const vscode = require('vscode')

const { ExtensionError } = require('../../src/errors')
const { makeExtensionContext } = require('../helpers')
const { runAllTests } = require('../../src/commands/runAllTests')
const { runLastCommand } = require('../../src/commands/runLastCommand')

beforeEach(() => {
  vscode.window.terminals[0]._lastCommand = undefined
})

describe('runLastCommand', () => {
  it('repeats the last command', async () => {
    const extensionContext = makeExtensionContext()
    const configuration = new Map([
      ['baseCommand', 'pytest'],
      ['runAllCommand', '{base}']
    ])

    await runAllTests(extensionContext, configuration)

    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest')
    expect(extensionContext.workspaceState.get('lastCommand')).toBe('pytest')

    vscode.window.terminals[0]._lastCommand = undefined

    await runLastCommand(extensionContext)

    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest')
    expect(extensionContext.workspaceState.get('lastCommand')).toBe('pytest')
  })

  it('shows an error when no command was run', async () => {
    const extensionContext = makeExtensionContext()

    expect(() => runLastCommand(extensionContext)).toThrow(new ExtensionError('No tests ran yet!'))

    expect(vscode.window.terminals[0]._lastCommand).toBe(undefined)
  })
})
