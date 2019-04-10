const { runCommand } = require("../terminal");
const helpers = require("../helpers");

module.exports = {
    runOnCursor: () => runCommand(helpers.getSetting("runOnCursorCommand"))
};
