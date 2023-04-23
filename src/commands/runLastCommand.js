const { ExtensionError } = require('../errors')
const { runTerminalCommand, LAST_COMMAND } = require('../terminal')

function runLastCommand (extensionContext) {
  const command = extensionContext.workspaceState.get(LAST_COMMAND)
  if (command) {
    runTerminalCommand(extensionContext, command)
  } else {
    throw new ExtensionError('No tests ran yet!')
  }
}

module.exports = { runLastCommand }
