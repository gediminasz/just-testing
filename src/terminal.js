const vscode = require("vscode");

const { interpolate, InterpolationError } = require("./interpolate");

const TERMINAL_NAME = "Just Testing";

function runCommand(template) {
    try {
        runInTerminal(interpolate(template));
    } catch (e) {
        if (e instanceof InterpolationError) {
            vscode.window.showErrorMessage(e.message);
        } else {
            throw e;
        }
    }
}

function runInTerminal(command) {
    const terminal = obtainTerminal();
    terminal.show(true);
    terminal.sendText(command);
}

function obtainTerminal() {
    const terminal = vscode.window.terminals.find(terminal => terminal.name == TERMINAL_NAME);
    if (terminal) return terminal;

    return vscode.window.createTerminal(TERMINAL_NAME);
}

module.exports = { runCommand, runInTerminal };
