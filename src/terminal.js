const vscode = require('vscode')

const TERMINAL_NAME = 'Just Testing'
const LAST_COMMAND = 'lastCommand'

async function runTerminalCommand (extensionContext, command) {
  await vscode.workspace.saveAll()
  extensionContext.workspaceState.update(LAST_COMMAND, command)

  const terminal = obtainTerminal()
  terminal.show(true)
  terminal.sendText(command)
}

function obtainTerminal () {
  const terminal = vscode.window.terminals.find(terminal => terminal.name === TERMINAL_NAME)
  if (terminal) return terminal

  return vscode.window.createTerminal(TERMINAL_NAME)
}

class Command {
  constructor (extensionContext) {
    this.extensionContext = extensionContext
  }

  runInTerminal (command) {
    runTerminalCommand(this.extensionContext, command)
  }
}

class RunLastCommand extends Command {
  run () {
    const command = this.extensionContext.workspaceState.get(LAST_COMMAND)
    if (command) {
      this.runInTerminal(command)
    } else {
      vscode.window.showInformationMessage('No tests ran yet!')
    }
  }
}

module.exports = { RunLastCommand, runTerminalCommand }
