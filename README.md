# Just Testing

A Visual Studio Code extension for running tests in integrated terminal.

## Settings

### `justTesting.regex`

Regular expression for matching closest test name

Example: `"def (test_.+)\\("`

### `justTesting.runOnCursorCommand`

Terminal command for "Run test on cursor"

Example: `"python -m pytest {fileName}::{testName}"`

### `justTesting.runAllCommand`

Terminal command for "Run all tests"

Example: `"python -m pytest -v"`

## Installation

```
vsce package
code --install-extension just-testing-0.0.1.vsix
```
