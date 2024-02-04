const vscode = require('vscode')

const { runAllTestsInPath } = require('../../src/commands/runAllTestsInPath')

beforeEach(() => {
  vscode.window.terminals[0]._lastCommand = undefined
  vscode.workspace._configuration = {
    justTesting: {
      baseCommand: 'pytest',
      runFileCommand: '{base} {fileName}'
    }
  }
})

describe('runAllTestsInPath', () => {
  it('runs tests in a selected file', async () => {
    const uri = { path: '/root/tests/foo/test_bar.py' }

    await runAllTestsInPath(undefined, uri)

    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest tests/foo/test_bar.py')
  })

  it('runs tests in a selected directory', async () => {
    const uri = { path: '/root/tests/foo/' }

    await runAllTestsInPath(undefined, uri)

    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest tests/foo/')
  })

  describe('running tests as module', () => {
    beforeEach(() => {
      vscode.workspace._configuration = {
        justTesting: {
          baseCommand: 'pytest',
          runFileCommand: '{base} {module}'
        }
      }
    })

    it('runs tests in a selected file as module', async () => {
      const uri = { path: '/root/tests/foo/test_bar.py' }

      await runAllTestsInPath(undefined, uri)

      expect(vscode.window.terminals[0]._lastCommand).toBe('pytest tests.foo.test_bar')
    })

    it('runs tests in a selected directory as module', async () => {
      const uri = { path: '/root/tests/foo' }

      await runAllTestsInPath(undefined, uri)

      expect(vscode.window.terminals[0]._lastCommand).toBe('pytest tests.foo')
    })
  })
})
