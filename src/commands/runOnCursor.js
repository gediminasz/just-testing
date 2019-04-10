const vscode = require("vscode");

const { runInTerminal } = require("../terminal");
const { interpolate } = require("../interpolate");
const helpers = require("../helpers");

function runOnCursor() {
    const command = interpolate(helpers.getSetting("runOnCursorCommand"));
    if (command) runInTerminal(command);
}

module.exports = { runOnCursor };
