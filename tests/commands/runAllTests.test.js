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
      ['runAllCommand', '{base} --cov']
    ])

    await runAllTests(extensionContext, configuration)

    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest --cov')
  })
})
