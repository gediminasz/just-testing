const vscode = require('vscode')

const { runAllTests } = require('../../src/commands/runAllTests')

beforeEach(() => {
  vscode.window.terminals[0]._lastCommand = undefined
})

describe('runAllTests', () => {
  it('runs all tests', async () => {
    const configuration = new Map([
      ['baseCommand', 'pytest'],
      ['runAllCommand', '{base} --cov']
    ])

    await runAllTests(configuration)

    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest --cov')
  })
})
