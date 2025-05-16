const vscode = require('vscode')

const { makeExtensionContext } = require('../helpers')
const { runAllTests } = require('../../src/commands/runAllTests')

beforeEach(() => {
  vscode.window.terminals[0]._lastCommand = undefined
})

describe('runAllTests', () => {
  it('runs all tests', async () => {
    const extensionContext = makeExtensionContext()
    const configuration = new Map([
      ['baseCommand', 'pytest'],
      ['runAllCommand', '{base} --cov {root}']
    ])

    await runAllTests(extensionContext, configuration)

    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest --cov /path/to/workspace')
    expect(extensionContext.workspaceState.get('lastCommand')).toBe('pytest --cov /path/to/workspace')
  })
})
