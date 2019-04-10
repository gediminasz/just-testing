const vscode = require("vscode");

const helpers = require("./helpers");

class InterpolationError extends Error { }

const INTERPOLATIONS = {
    base: () => helpers.getSetting("baseCommand"),
    fileName: helpers.getActiveFile,
    testName: findClosestTest,
    line: getActiveLine
}

function interpolate(template) {
    return Object.entries(INTERPOLATIONS).reduce(
        (template, [key, resolveValue]) => applyInterpolation(template, key, resolveValue),
        template
    )
}

function applyInterpolation(template, key, resolveValue) {
    const tag = `{${key}}`;
    return template.includes(tag) ? template.replace(tag, resolveValue()) : template;
}

function findClosestTest() {
    let lineNumber = getActiveLine();

    while (lineNumber >= 0) {
        const line = vscode.window.activeTextEditor.document.lineAt(lineNumber).text;
        const match = line.match(helpers.getSetting("runOnCursorRegex"));
        if (match) return match[1];

        lineNumber--;
    }

    throw new InterpolationError("No test detected!");
}

function getActiveLine() {
    return vscode.window.activeTextEditor.selection.active.line;
}

module.exports = { interpolate, InterpolationError };
