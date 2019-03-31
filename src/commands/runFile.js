const { runInTerminal } = require("../terminal");
const helpers = require("../helpers");

module.exports = {
    runFile: () => {
        const command = helpers.getSetting("runFileCommand")
            .replace("{base}", helpers.getSetting("baseCommand"))
            .replace("{fileName}", helpers.getActiveFile());

        runInTerminal(command);
    }
};
