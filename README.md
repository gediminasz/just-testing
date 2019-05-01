# Just Testing

![last commit](https://img.shields.io/github/last-commit/gediminasz/just-testing.svg) ![release](https://img.shields.io/github/release/gediminasz/just-testing.svg)

A Visual Studio Code extension for running tests in integrated terminal.

Available commands:

- Run all tests
- Run all tests in file
- Run test on cursor

Supported languages and frameworks:

- Python `pytest` (default)
- Python `unittest`
- JavaScript Jest
- Ruby RSpec

However Just Testing is simple and flexible enough to make it work with any language of your choice!

## Configuration Examples

### Python

#### Poetry

```
"justTesting.baseCommand": "poetry run python -m pytest -v",
```

#### unittest

```
"justTesting.baseCommand": "python -m unittest",
"justTesting.runOnCursorCommand": "{base} {fileName} -k {testName}"
```

### JavaScript

#### Jest

```
"justTesting.baseCommand": "jest",
"justTesting.runOnCursorRegex": "test\\((.+),",
"justTesting.runOnCursorCommand": "{base} -t {testName}"
```

### Ruby

#### RSpec

```
"justTesting.baseCommand": "rspec",
"justTesting.runOnCursorCommand": "{base} {fileName}:{line}"
```

## Settings Reference

### `justTesting.baseCommand`

Base terminal command.

Default: `"python -m pytest -v"`

### `justTesting.runAllCommand`

Terminal command for "Run all tests".

Default: `"{base}"`

### `justTesting.runFileCommand`

Terminal command for "Run all tests in file".

Default: `"{base} {fileName}"`

### `justTesting.runOnCursorRegex`

Regular expression for matching closest test name.

Default: `"def (test_.+)\\("`

### `justTesting.runOnCursorCommand`

Terminal command for "Run test on cursor".

Default: `"{base} {fileName} -k {testName}"`

### Interpolation tags

The following interpolation tags can be used in settings `runAllCommand`, `runFileCommand` and `runOnCursorCommand`:

- `{base}`
- `{filename}`
- `{testName}`
- `{line}`

## Keyboard Shortcuts

Just Testing tries to be non intrusive so it does not come with predefined keyboard shortcuts. However VS Code allows users to set up their own custom keybindings. For example:

```
{
    "key": "ctrl+shift+r",
    "command": "justTesting.runAll"
}
```

The available commands are:

- `justTesting.runAll`
- `justTesting.runFile`
- `justTesting.runOnCursor`
