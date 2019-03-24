const vscode = require("vscode");

let taskProvider;

function activate(context) {
    console.debug('Activating just-testing...');

    let disposable = vscode.commands.registerCommand('extension.runOnCursor', () => {
        const activeLineNumber = vscode.window.activeTextEditor.selection.active.line;
        let lineNumber = activeLineNumber;
        let line;
        while (lineNumber >= 0) {
            line = vscode.window.activeTextEditor.document.lineAt(lineNumber).text;
            if (line.includes("def test_")) break;
            lineNumber--;
        }

        const fileName = vscode.workspace.asRelativePath(vscode.window.activeTextEditor.document.fileName);
        const testName = line.match(/def (test_.+)\(/)[1];

        if (vscode.window.terminals.length === 0) {
            vscode.window.createTerminal("Just Testing");
        }
        const terminal = vscode.window.terminals[0]
        terminal.show(true);
        terminal.sendText(`python -m pytest ${fileName}::${testName}`);
    });

    context.subscriptions.push(disposable);

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
}
