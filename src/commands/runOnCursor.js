const vscode = require("vscode");

const { runInTerminal } = require("../terminal");
const helpers = require("../helpers");

function runOnCursor() {
    const template = helpers.getSetting("runOnCursorCommand");

    const testName = findClosestTest();
    if (template.includes("{testName}") && (testName === undefined)) {
        vscode.window.showErrorMessage("No test detected!");
        return;
    }

    const command = helpers.getSetting("runOnCursorCommand")
        .replace("{base}", helpers.getSetting("baseCommand"))
        .replace("{fileName}", helpers.getActiveFile())
        .replace("{testName}", testName)
        .replace("{line}", getActiveLine());

    runInTerminal(command);
}

function findClosestTest() {
    let lineNumber = getActiveLine();

    while (lineNumber >= 0) {
        const line = vscode.window.activeTextEditor.document.lineAt(lineNumber).text;
        const match = line.match(helpers.getSetting("runOnCursorRegex"));
        if (match) return match[1];

        lineNumber--;
    }
}

function getActiveLine() {
    return vscode.window.activeTextEditor.selection.active.line;
}

module.exports = { runOnCursor };
