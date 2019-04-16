const vscode = require("vscode");

const helpers = require("./helpers");

class InterpolationError extends Error { }

const INTERPOLATIONS = {
    base: () => helpers.getSetting("baseCommand"),
    fileName: resolveActiveFile,
    testName: resolveTestName,
    line: resolveActiveLine,
}

function interpolate(template) {
    return Object.entries(INTERPOLATIONS).reduce(
        (template, [key, resolveValue]) => applyInterpolation(template, key, resolveValue),
        template
    );
}

function applyInterpolation(template, key, resolveValue) {
    const tag = `{${key}}`;
    return template.includes(tag) ? template.replace(tag, resolveValue()) : template;
}

function resolveActiveFile() {
    return vscode.workspace.asRelativePath(getActiveEditor().document.fileName);
}

function resolveTestName() {
    let lineNumber = resolveActiveLine();

    while (lineNumber >= 0) {
        const line = getActiveEditor().document.lineAt(lineNumber).text;
        const match = line.match(helpers.getSetting("runOnCursorRegex"));
        if (match) return match[1];

        lineNumber--;
    }

    throw new InterpolationError("No test detected!");
}

function resolveActiveLine() {
    return getActiveEditor().selection.active.line;
}

function getActiveEditor() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) throw new InterpolationError("No file open!");
    return editor;
}

module.exports = { interpolate, InterpolationError };
