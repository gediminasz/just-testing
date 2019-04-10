const vscode = require("vscode");

const { makeCommand } = require("./terminal");

function activate(context) {
    console.debug('Activating just-testing...');

    function registerCommand(command, callback) {
        context.subscriptions.push(vscode.commands.registerCommand(command, callback));
    }

    registerCommand('extension.runAll', makeCommand("runAllCommand"));
    registerCommand('extension.runFile', makeCommand("runFileCommand"));
    registerCommand('extension.runOnCursor', makeCommand("runOnCursorCommand"));
}

function deactivate() {
    console.debug('Deactivating just-testing...');
}

module.exports = {
    activate,
    deactivate
};
