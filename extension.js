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
                        new vscode.ShellExecution('python -m pytest -v'),
                        []
                    ),
                    new vscode.Task(
                        { type: 'test-file' },
                        'test-file',
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
}
