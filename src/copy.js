const vscode = require('vscode')

const { interpolate } = require('./interpolate')
const helpers = require('./helpers')

class CopyOnCursorCommand {
  run () {
    const template = helpers.getSetting('runOnCursorCommand')
    const command = interpolate(template)
    vscode.env.clipboard.writeText(command)
  }
}

module.exports = { CopyOnCursorCommand }
