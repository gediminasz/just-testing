const vscode = require('vscode')

const { interpolate, InterpolationError } = require('./interpolate')
const helpers = require('./helpers')

const TERMINAL_NAME = 'Just Testing'
const LAST_COMMAND = 'lastCommand'

class Command {
  constructor (extensionContext) {
    this.extensionContext = extensionContext
  }

  runInTerminal (command) {
    vscode.workspace.saveAll()
    this.extensionContext.workspaceState.update(LAST_COMMAND, command)

    const terminal = this.obtainTerminal()
    terminal.show(true)
    terminal.sendText(command)
  }

  obtainTerminal () {
    const terminal = vscode.window.terminals.find(terminal => terminal.name === TERMINAL_NAME)
    if (terminal) return terminal

    return vscode.window.createTerminal(TERMINAL_NAME)
  }
}

class TemplateCommand extends Command {
  constructor (settingName, extensionContext) {
    super(extensionContext)
    this.settingName = settingName
  }

  run () {
    try {
      this.runInTerminal(this.command)
    } catch (e) {
      if (e instanceof InterpolationError) {
        vscode.window.showErrorMessage(e.message)
      } else {
        console.error(e)
        throw e
      }
    }
  }

  get command () {
    const template = helpers.getSetting(this.settingName)
    return interpolate(template)
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

module.exports = { TemplateCommand, RunLastCommand }
