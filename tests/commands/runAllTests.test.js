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

  it('interpolates all variables', async () => {
    const extensionContext = makeExtensionContext()
    const configuration = new Map([
      ['baseCommand', 'conda run -p {root}/.venv pytest'],
      ['runAllCommand', '{base} --cov {root}']
    ])

    await runAllTests(extensionContext, configuration)

    const expectedValue = 'conda run -p /path/to/workspace/.venv pytest --cov /path/to/workspace'
    expect(vscode.window.terminals[0]._lastCommand).toBe(expectedValue)
    expect(extensionContext.workspaceState.get('lastCommand')).toBe(expectedValue)
  })
})
