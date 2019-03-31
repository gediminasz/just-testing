# Just Testing

A Visual Studio Code extension for running tests in integrated terminal.

Available commands:

- Run all tests
- Run all tests in file
- Run test on cursor

## Settings

### `justTesting.baseCommand`

Base terminal command.

Example: `"python -m pytest -v"`

### `justTesting.runAllCommand`

Terminal command for "Run all tests"

Example: `"{base}"`

### `justTesting.runFileCommand`

Terminal command for "Run all tests in file"

Example: `"{base} {fileName}"`

### `justTesting.runOnCursorRegex`

Regular expression for matching closest test name

Example: `"def (test_.+)\\("`

### `justTesting.runOnCursorCommand`

Terminal command for "Run test on cursor"

Example: `"{base} {fileName}::{testName}"`

## Installation

```
vsce package
code --install-extension just-testing-0.0.1.vsix
```
