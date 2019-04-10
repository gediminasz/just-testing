const vscode = require("vscode");

module.exports = {
    getSetting: (property) => vscode.workspace.getConfiguration("justTesting").get(property),
    getActiveFile: () => vscode.workspace.asRelativePath(vscode.window.activeTextEditor.document.fileName),
    getActiveLine: () => vscode.window.activeTextEditor.selection.active.line
};
