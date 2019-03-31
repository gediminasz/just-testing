const { runInTerminal } = require("../terminal");
const helpers = require("../helpers");

module.exports = {
    runAll: () => {
        const command = helpers.getSetting("runAllCommand").replace("{base}", helpers.getSetting("baseCommand"));
        runInTerminal(command);
    }
};
