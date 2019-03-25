const vscode = require("vscode");

function command() {
    const testName = findClosestTest();
    const fileName = vscode.workspace.asRelativePath(vscode.window.activeTextEditor.document.fileName);

    const terminal = obtainTerminal();
    terminal.show(true);
    terminal.sendText(`python -m pytest ${fileName}::${testName}`);
}

function findClosestTest() {
    let lineNumber = vscode.window.activeTextEditor.selection.active.line;

    let line;
    while (lineNumber >= 0) {
        line = vscode.window.activeTextEditor.document.lineAt(lineNumber).text;
        if (line.includes("def test_")) break;
        lineNumber--;
    }

    return line.match(/def (test_.+)\(/)[1];

    // TODO GZL replace line.includes with line.match and return from inside loop
    // TODO GZL when no test is detected
}

function obtainTerminal() {
    if (vscode.window.terminals.length === 0) {
        vscode.window.createTerminal("Just Testing");
    }
    return vscode.window.terminals[0]

    // TODO GZL reuse terminal titled "Just Testing"
}

module.exports = { command };
