const vscode = require('vscode')

const { makeExtensionContext } = require('../helpers')
const { runTestOnCursor } = require('../../src/commands/runTestOnCursor')
const { ExtensionError } = require('../../src/errors')

let lines = [
  'class FooTestCase(TestCase):',
  '    def not_test():',
  '        ...',
  '    def _test_ignored():',
  '        ...',
  '    def test_foo():',
  '        ...'
]
let activeLine = 6

beforeEach(() => {
  vscode.window.activeTextEditor = {
    document: {
      fileName: '/root/foo/bar/baz',
      lineAt (i) {
        return { text: lines[i] }
      }
    },
    selection: { active: { line: activeLine } }
  }
  vscode.window.terminals[0]._lastCommand = undefined
})

describe('runTestOnCursor', () => {
  const configuration = new Map([
    ['baseCommand', 'pytest'],
    ['runOnCursorCommand', '{base} {root}/{fileName} -k {testName}'],
    ['runOnCursorRegex', 'def (test_.+)\\('],
    ['expressions', {}]
  ])
  const extensionContext = makeExtensionContext()

  it('runs a single test', async () => {
    await runTestOnCursor(extensionContext, configuration)

    expect(vscode.window.terminals[0]._lastCommand).toBe('pytest /root/foo/bar/baz -k test_foo')
    expect(extensionContext.workspaceState.get('lastCommand')).toBe('pytest /root/foo/bar/baz -k test_foo')
  })

  it('handles no test detected', async () => {
    vscode.window.activeTextEditor.selection.active.line = 2

    expect(() => runTestOnCursor(extensionContext, configuration)).toThrow(new ExtensionError('No test detected!'))

    expect(vscode.window.terminals[0]._lastCommand).toBe(undefined)
  })

  it('handles no file being open', async () => {
    vscode.window.activeTextEditor = undefined

    expect(() => runTestOnCursor(extensionContext, configuration)).toThrow(new ExtensionError('No file open!'))

    expect(vscode.window.terminals[0]._lastCommand).toBe(undefined)
  })

  describe('given django-like configuration', () => {
    const configuration = new Map([
      ['baseCommand', 'python manage.py test'],
      ['runOnCursorCommand', '{base} {module}.{className}.{testName}'],
      ['runOnCursorRegex', 'def (test_.+)\\('],
      ['expressions', {
        className: { regex: 'class (.+TestCase)\\(' }
      }]
    ])

    it('runs a single test', async () => {
      await runTestOnCursor(extensionContext, configuration)
      expect(vscode.window.terminals[0]._lastCommand).toBe('python manage.py test foo.bar.baz.FooTestCase.test_foo')
    })

    it('handles custom expressions without a match', async () => {
      const badConfiguration = new Map(configuration)
      badConfiguration.set('expressions', {
        className: { regex: 'class (.+NotATestCase)\\(' }
      })

      expect(() => runTestOnCursor(extensionContext, badConfiguration))
        .toThrow(new ExtensionError('Invalid expression for "className"'))

      expect(vscode.window.terminals[0]._lastCommand).toBe(undefined)
    })
  })

  describe('given rspec-like configuration', () => {
    const configuration = new Map([
      ['baseCommand', 'rspec'],
      ['runOnCursorCommand', '{base} {fileName}:{line}'],
      ['expressions', {}]
    ])

    it('runs a single test', async () => {
      await runTestOnCursor(extensionContext, configuration)
      expect(vscode.window.terminals[0]._lastCommand).toBe('rspec foo/bar/baz:7')
    })
  })

  describe('jest', () => {
    beforeAll(() => {
      lines = [
        'describe("foo", () => {',
        '  it("bar", () => {',
        '    ...',
        '  })',
        '})'
      ]
    })

    const configuration = new Map([
      ['baseCommand', 'jest'],
      ['runOnCursorCommand', '{base} {fileName} -t {testName}'],
      ['runOnCursorRegex', '(it|describe)\\((.+),'],
      ['expressions', {}]
    ])

    describe('when cursor is on "it" block', () => {
      beforeAll(() => { activeLine = 2 })

      it('runs that test', async () => {
        await runTestOnCursor(extensionContext, configuration)
        expect(vscode.window.terminals[0]._lastCommand).toBe('jest foo/bar/baz -t "bar"')
      })
    })

    describe('when cursor is on "describe" block', () => {
      beforeAll(() => { activeLine = 0 })

      it('runs that test', async () => {
        await runTestOnCursor(extensionContext, configuration)
        expect(vscode.window.terminals[0]._lastCommand).toBe('jest foo/bar/baz -t "foo"')
      })
    })
  })
})
