const vscode = require("vscode");

const { runAll } = require("./commands/runAll");
const { runFile } = require("./commands/runFile");
const { runOnCursor } = require("./commands/runOnCursor");

function activate(context) {
    console.debug('Activating just-testing...');

    function registerCommand(command, callback) {
        context.subscriptions.push(vscode.commands.registerCommand(command, callback));
    }

    registerCommand('extension.runAll', runAll);
    registerCommand('extension.runFile', runFile);
    registerCommand('extension.runOnCursor', runOnCursor);
}

function deactivate() {
    console.debug('Deactivating just-testing...');
}

module.exports = {
    activate,
    deactivate
};
