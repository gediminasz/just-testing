const vscode = require("vscode");

function command() {
    const testName = findClosestTest();
    if (testName === undefined) {
        vscode.window.showErrorMessage("No test detected!");
        return;
    }

    const fileName = vscode.workspace.asRelativePath(vscode.window.activeTextEditor.document.fileName);

    const terminal = obtainTerminal();
    terminal.show(true);
    terminal.sendText(`python -m pytest ${fileName}::${testName}`);
}

function findClosestTest() {
    let lineNumber = vscode.window.activeTextEditor.selection.active.line;

    while (lineNumber >= 0) {
        const line = vscode.window.activeTextEditor.document.lineAt(lineNumber).text;
        const match = line.match(/def (test_.+)\(/);
        if (match) return match[1];

        lineNumber--;
    }
}

function obtainTerminal() {
    if (vscode.window.terminals.length === 0) {
        vscode.window.createTerminal("Just Testing");
    }
    return vscode.window.terminals[0]

    // TODO GZL reuse terminal titled "Just Testing"
}

module.exports = { command };
