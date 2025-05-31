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

    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest --cov /root')
    expect(extensionContext.workspaceState.get('lastCommand')).toBe('pytest --cov /root')
  })

  it('interpolates all variables', async () => {
    const extensionContext = makeExtensionContext()
    const configuration = new Map([
      ['baseCommand', 'conda run -p {root}/.venv pytest'],
      ['runAllCommand', '{base} --cov {root}']
    ])

    await runAllTests(extensionContext, configuration)

    expect(vscode.window.terminals[0]._lastCommand).toBe('conda run -p /root/.venv pytest --cov /root')
    expect(extensionContext.workspaceState.get('lastCommand')).toBe('conda run -p /root/.venv pytest --cov /root')
  })
})
