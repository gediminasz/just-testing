const vscode = require("vscode");

module.exports = {
    getSetting: (property) => vscode.workspace.getConfiguration("justTesting").get(property),
};
