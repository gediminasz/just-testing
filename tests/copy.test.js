const vscode = require('vscode')
const { CopyOnCursorCommand } = require('../src/copy')

describe('CopyOnCursorCommand', () => {
  it('writes test command to clipboard', () => {
    (new CopyOnCursorCommand()).run()
    expect(vscode.env.clipboard.readText()).toEqual('pytest foo/bar/baz.py -k test_foo')
  })
})
