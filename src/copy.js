const { interpolate } = require('./interpolate')
const helpers = require('./helpers')

class CopyOnCursorCommand {
  run () {
    const template = helpers.getSetting('runOnCursorCommand')
    const command = interpolate(template)
    helpers.writeClipboard(command)
  }
}

module.exports = { CopyOnCursorCommand }
