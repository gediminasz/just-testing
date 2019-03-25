const vscode = require("vscode");

const { runInTerminal } = require("../terminal");
const configuration = require("../configuration");

function runOnCursor() {
    const testName = findClosestTest();
    if (testName === undefined) {
        vscode.window.showErrorMessage("No test detected!");
        return;
    }

    const fileName = vscode.workspace.asRelativePath(vscode.window.activeTextEditor.document.fileName);

    const command = configuration.get("runOnCursorCommand")
        .replace("{fileName}", fileName)
        .replace("{testName}", testName);

    runInTerminal(command);
}

function findClosestTest() {
    let lineNumber = vscode.window.activeTextEditor.selection.active.line;

    while (lineNumber >= 0) {
        const line = vscode.window.activeTextEditor.document.lineAt(lineNumber).text;
        const match = line.match(configuration.get("regex"));
        if (match) return match[1];

        lineNumber--;
    }
}

module.exports = { runOnCursor };
