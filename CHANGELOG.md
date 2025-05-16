# Changelog

## Unreleased

- Added `{root}` variable which contains the absolute path to current workspace.

## 2023.7.0

- Added "Run Tests" context menu item to file explorer.
- Removed support for `{"value": "..."}` kind expressions in the `justTesting.customExpressions` setting.

## 2022.3.0

- Added "Run test on cursor" context menu item.
- Added "Copy test command" context menu item.
- Added `justTesting.contextMenusEnabled` setting to enable or disable context menu items.

## 0.7.1

- Changed test commands to correctly run after vscode file save is complete.

## 0.7.0

- Settings can now be language specific.

## 0.6.1

- Fixed changes to settings like `runAllCommand` requiring vscode to be restarted.

## 0.6.0

- Added "Run last command".
- Added configuration examples for Python Pipenv, virtualenv and Nose.

## 0.5.0

- `{line}` value is now one-based.
- All dirty files are now saved before running a command.
- Added `{module}` variable which returns a dotted path to active file.
- Added `justTesting.expressions` setting.
- Added a configuration example for Django.

## 0.4.0

- All commands can now use the same interpolation tags: `{base}`, `{filename}`, `{testName}`, `{line}`.
- Fixed "Run all tests in file" and "Run test on cursor" commands failing when there is no file open.
- Changed default `justTesting.runOnCursorCommand` setting value to `"{base} {fileName} -k {testName}"`. This allows running class based tests using `pytest`.

## 0.3.0

- Added `{line}` template variable for `justTesting.runOnCursorCommand` setting.
- Added configuration examples for Jest, RSpec and Python's `unittest`.

## 0.2.0

- Added `baseCommand` setting.
- Renamed `regex` setting to `runOnCursorRegex`.

## 0.1.1

- Improved marketplace presentation.

## 0.1.0

- Added a list of available commands to readme.
- Added "Just Testing:" prefix to command names.

## 0.0.2

- Added "Run all tests" command.
- Added "Run all tests in file" command.
- Added "Run test on cursor" command.

## 0.0.1

- Added `test-all` and `test-file` tasks.
