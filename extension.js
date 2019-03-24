const vscode = require("vscode");

let taskProvider;

function activate() {
    console.debug('Activating just-testing...');

    taskProvider = vscode.tasks.registerTaskProvider(
        'pytest',
        {
            provideTasks: () => {
                return [
                    new vscode.Task(
                        { type: 'test-all' },
                        'test-all',
                        'pytest',
                        new vscode.ShellExecution('python -m pytest'),
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
}
