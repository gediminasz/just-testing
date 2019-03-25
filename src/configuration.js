const vscode = require("vscode");

module.exports = {
    get: (property) => vscode.workspace.getConfiguration("justTesting").get(property)
};
