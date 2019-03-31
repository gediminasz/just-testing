# Just Testing

A Visual Studio Code extension for running tests in integrated terminal.

Available commands:

- Run all tests
- Run all tests in file
- Run test on cursor

## FAQ

### Can I use this with `poetry`?

Set the `justTesting.baseCommand` setting to e.g. `"poetry run python -m pytest -v"`.

## Settings

### `justTesting.baseCommand`

Base terminal command.

Default: `"python -m pytest -v"`

### `justTesting.runAllCommand`

Terminal command for "Run all tests"

Default: `"{base}"`

### `justTesting.runFileCommand`

Terminal command for "Run all tests in file"

Default: `"{base} {fileName}"`

### `justTesting.runOnCursorRegex`

Regular expression for matching closest test name

Default: `"def (test_.+)\\("`

### `justTesting.runOnCursorCommand`

Terminal command for "Run test on cursor"

Default: `"{base} {fileName}::{testName}"`
