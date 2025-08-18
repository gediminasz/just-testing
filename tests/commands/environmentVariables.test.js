const vscode = require('vscode')

const { makeExtensionContext } = require('../helpers')
const { runAllTests } = require('../../src/commands/runAllTests')
const { runAllTestsInActiveFile } = require('../../src/commands/runAllTestsInActiveFile')
const { runTestOnCursor } = require('../../src/commands/runTestOnCursor')

beforeEach(() => {
  // Reset terminals
  vscode.window.terminals.length = 1
  vscode.window.terminals[0]._lastCommand = undefined
})

describe('environment variables', () => {
  it('passes environment variables to terminal when running all tests', async () => {
    const extensionContext = makeExtensionContext()
    const configuration = new Map([
      ['baseCommand', 'pytest'],
      ['runAllCommand', '{base}'],
      ['environmentVariables', { NODE_ENV: 'test', DEBUG: '1' }]
    ])

    await runAllTests(extensionContext, configuration)

    // Should create a new terminal with environment variables
    expect(vscode.window.terminals).toHaveLength(2)
    const newTerminal = vscode.window.terminals[1]
    expect(newTerminal.name).toBe('Just Testing')
    expect(newTerminal.env).toEqual(expect.objectContaining({
      NODE_ENV: 'test',
      DEBUG: '1'
    }))
    expect(newTerminal._lastCommand).toBe('pytest')
  })

  it('passes environment variables to terminal when running file tests', async () => {
    const extensionContext = makeExtensionContext()
    const configuration = new Map([
      ['baseCommand', 'pytest'],
      ['runFileCommand', '{base} {fileName}'],
      ['environmentVariables', { PYTHON_PATH: '/custom/path' }]
    ])

    await runAllTestsInActiveFile(extensionContext, configuration)

    // Should create a new terminal with environment variables
    expect(vscode.window.terminals).toHaveLength(2)
    const newTerminal = vscode.window.terminals[1]
    expect(newTerminal.env).toEqual(expect.objectContaining({
      PYTHON_PATH: '/custom/path'
    }))
    expect(newTerminal._lastCommand).toBe('pytest foo/bar/baz.py')
  })

  it('passes environment variables to terminal when running cursor tests', async () => {
    const extensionContext = makeExtensionContext()
    const configuration = new Map([
      ['baseCommand', 'pytest'],
      ['runOnCursorCommand', '{base} {fileName} -k {testName}'],
      ['runOnCursorRegex', 'def (test_.+)\\('],
      ['expressions', {}],
      ['environmentVariables', { TEST_ENV: 'development' }]
    ])

    await runTestOnCursor(extensionContext, configuration)

    // Should create a new terminal with environment variables
    expect(vscode.window.terminals).toHaveLength(2)
    const newTerminal = vscode.window.terminals[1]
    expect(newTerminal.env).toEqual(expect.objectContaining({
      TEST_ENV: 'development'
    }))
    expect(newTerminal._lastCommand).toBe('pytest foo/bar/baz.py -k test_foo')
  })

  it('works with empty environment variables', async () => {
    const extensionContext = makeExtensionContext()
    const configuration = new Map([
      ['baseCommand', 'pytest'],
      ['runAllCommand', '{base}'],
      ['environmentVariables', {}]
    ])

    await runAllTests(extensionContext, configuration)

    // Should reuse the existing terminal when no env vars are provided
    expect(vscode.window.terminals).toHaveLength(1)
    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest')
  })

  it('reuses existing terminal when no environment variables are set', async () => {
    const extensionContext = makeExtensionContext()
    const configuration = new Map([
      ['baseCommand', 'pytest'],
      ['runAllCommand', '{base}'],
      ['environmentVariables', {}]
    ])

    // First run
    await runAllTests(extensionContext, configuration)
    expect(vscode.window.terminals).toHaveLength(1)
    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest')

    // Second run should reuse the same terminal
    await runAllTests(extensionContext, configuration)
    expect(vscode.window.terminals).toHaveLength(1)
    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest')
  })
})
