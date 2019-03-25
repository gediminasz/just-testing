const vscode = require("vscode");
const runOnCursor = require("./commands/runOnCursor");

let taskProvider;

function activate(context) {
    console.debug('Activating just-testing...');

    function registerCommand(command, callback) {
        context.subscriptions.push(vscode.commands.registerCommand(command, callback));
    }

    registerCommand('extension.runOnCursor', runOnCursor.command);

    taskProvider = vscode.tasks.registerTaskProvider(
        'pytest',
        {
            provideTasks: () => {
                return [
                    new vscode.Task(
                        { type: 'testAll' },
                        'testAll',
                        'pytest',
                        new vscode.ShellExecution('python -m pytest -v'),
                        []
                    ),
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
