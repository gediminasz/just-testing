const vscode = require("vscode");

const { runInTerminal } = require("../terminal");
const helpers = require("../helpers");

function runOnCursor() {
    const testName = findClosestTest();

    if (testName === undefined) {
        vscode.window.showErrorMessage("No test detected!");
        return;
    }

    const command = helpers.getSetting("runOnCursorCommand")
        .replace("{fileName}", helpers.getActiveFile())
        .replace("{testName}", testName);

    runInTerminal(command);
}

function findClosestTest() {
    let lineNumber = vscode.window.activeTextEditor.selection.active.line;

    while (lineNumber >= 0) {
        const line = vscode.window.activeTextEditor.document.lineAt(lineNumber).text;
        const match = line.match(helpers.getSetting("regex"));
        if (match) return match[1];

        lineNumber--;
    }
}

module.exports = { runOnCursor };
