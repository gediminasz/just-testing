const vscode = require("vscode");

const { runInTerminal } = require("../terminal");
const helpers = require("../helpers");

class InterpolationError extends Error { }

function runOnCursor() {
    try {
        const command = helpers.getSetting("runOnCursorCommand")
            .replace("{base}", helpers.getSetting("baseCommand"))
            .replace("{fileName}", helpers.getActiveFile())
            .replace("{testName}", findClosestTest())
            .replace("{line}", getActiveLine());
        runInTerminal(command);
    } catch (e) {
        if (e instanceof InterpolationError) {
            vscode.window.showErrorMessage(e.message);
        } else {
            throw e;
        }
    }
}

function findClosestTest() {
    let lineNumber = getActiveLine();

    while (lineNumber >= 0) {
        const line = vscode.window.activeTextEditor.document.lineAt(lineNumber).text;
        const match = line.match(helpers.getSetting("runOnCursorRegex"));
        if (match) return match[1];

        lineNumber--;
    }

    throw new InterpolationError("No test detected!");
}

function getActiveLine() {
    return vscode.window.activeTextEditor.selection.active.line;
}

module.exports = { runOnCursor };
