const { runInTerminal } = require("../terminal");
const configuration = require("../configuration");

module.exports = {
    runAll: () => runInTerminal(configuration.get("runAllCommand"))
};
