# Changelog

## Unreleased

- `{line}` value is now one-based.
- All dirty files are now saved before running a command.

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
