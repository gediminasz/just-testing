const { runInTerminal } = require("../terminal");
const helpers = require("../helpers");

module.exports = {
    runAll: () => runInTerminal(helpers.getSetting("runAllCommand"))
};
