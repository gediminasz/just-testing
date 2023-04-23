# Just Testing

A Visual Studio Code extension for running tests in integrated terminal.

Available commands:

- Run all tests
- Run all tests in file
- Run test on cursor
- Run last command

Supported languages and frameworks:

- Python `pytest` (default)
- Python `unittest`
- Python Django
- Python Nose
- JavaScript Jest
- Ruby RSpec

However Just Testing is simple and flexible enough to make it work with pretty much anything that runs in terminal!

## Configuration Examples

### Python

#### Poetry

```
"justTesting.baseCommand": "poetry run python -m pytest"
```

#### Pipenv

```
"justTesting.baseCommand": "pipenv run python -m pytest"
```

#### virtualenv

Point the base command to the `python` executable inside the virtualenv:

```
"justTesting.baseCommand": "path/to/virtualenv/python -m pytest"
```

#### unittest

```
"justTesting.baseCommand": "python -m unittest",
"justTesting.runOnCursorCommand": "{base} {fileName} -k {testName}"
```

#### Django

```
"justTesting.baseCommand": "python manage.py test",
"justTesting.runFileCommand": "{base} {module}",
"justTesting.runOnCursorCommand": "{base} {module}.{className}.{testName}",
"justTesting.expressions": {
    "className": { "regex": "class (.+TestCase)\\(" }
}
```

#### Nose

```
"justTesting.baseCommand": "python -m nose",
"justTesting.runOnCursorCommand": "{base} {fileName} -m {testName}"
```

### JavaScript

#### NPM

```
"justTesting.baseCommand": "npm test",
"justTesting.runFileCommand": "{base} -- {fileName}",
"justTesting.runOnCursorCommand": "{base} -- {fileName} -t {testName}",
"justTesting.runOnCursorRegex": "it\\((.+),",
```

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

## Settings

| Setting                           | Description                                        | Default value                       |
|-----------------------------------|----------------------------------------------------|-------------------------------------|
| `justTesting.baseCommand`         | Base terminal command.                             | `"python -m pytest -v"`             |
| `justTesting.runAllCommand`       | Terminal command for "Run all tests".              | `"{base}"`                          |
| `justTesting.runFileCommand`      | Terminal command for "Run all tests in file".      | `"{base} {fileName}"`               |
| `justTesting.runOnCursorRegex`    | Regular expression for matching closest test name. | `"def (test_.+)\\("`                |
| `justTesting.runOnCursorCommand`  | Terminal command for "Run test on cursor".         | `"{base} {fileName} -k {testName}"` |
| `justTesting.expressions`         | Custom expressions for template variables          | `{}`                                |
| `justTesting.contextMenusEnabled` | Should right click context menu actions be enabled | `true`                              |

All settings can be made specific for a language, so it's possible to have multiple configurations in a single project:

```
{
    "[javascript]": {
        "justTesting.baseCommand": "jest",
        ...
    },
    "[python]": {
        "justTesting.baseCommand": "pytest",
        ...
    }
}
```

## Interpolation tags

| Setting                          | Available interpolation tags                               |
|----------------------------------|------------------------------------------------------------|
| `justTesting.runAllCommand`      | `{base}`                                                   |
| `justTesting.runFileCommand`     | `{base}`, `{fileName}`, `{module}`                         |
| `justTesting.runOnCursorCommand` | `{base}`, `{fileName}`, `{module}`, `{testName}`, `{line}` |

## Custom expressions

The `justTesting.expressions` setting may be used to capture extra values to be used in `justTesting.runOnCursorCommand`. For example:

```
"justTesting.customExpressions": {
    "className": { "regex": "class (.+TestCase)\\(" }
},
"justTesting.runOnCursorCommand": "{base} {module}.{className}.{testName}"
```

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
