const vscode = require('vscode')

const { interpolate, InterpolationError } = require('./interpolate')
const helpers = require('./helpers')

class CopyOnCursorCommand {
    run () {
        try {
            const template = helpers.getSetting('runOnCursorCommand')
            const command = interpolate(template)
            vscode.env.clipboard.writeText(command)
        } catch (e) {
            if (e instanceof InterpolationError) {
                vscode.window.showErrorMessage(e.message)
            } else {
                console.error(e)
                throw e
            }
        }
    }
}

module.exports = { CopyOnCursorCommand }
