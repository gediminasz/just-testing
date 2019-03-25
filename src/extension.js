const vscode = require("vscode");

const { runOnCursor } = require("./commands/runOnCursor");
const { runAll } = require("./commands/runAll");

let taskProvider;

function activate(context) {
    console.debug('Activating just-testing...');

    function registerCommand(command, callback) {
        context.subscriptions.push(vscode.commands.registerCommand(command, callback));
    }

    registerCommand('extension.runAll', runAll);
    registerCommand('extension.runOnCursor', runOnCursor);

    taskProvider = vscode.tasks.registerTaskProvider(
        'pytest',
        {
            provideTasks: () => {
                return [
                    new vscode.Task(
                        { type: 'testFile' },
                        'testFile',
                        'pytest',
                        new vscode.ShellExecution('python -m pytest -v ${file}'),
                        []
                    )
                ]
            }
        }
    );
}

function deactivate() {
    console.debug('Deactivating just-testing...');

    if (taskProvider) taskProvider.dispose();
}

module.exports = {
    activate,
    deactivate
};
