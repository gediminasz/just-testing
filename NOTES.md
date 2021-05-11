# Development notes

## Test projects

https://github.com/gediminasz/just-testing-examples

## Packaging a release

Use "Publish extension" task or `vsce package`.

## Release checklist

1. Bump version in `package.json`
1. Ensure `CHANGELOG.md` is up to date
1. Run through all commands in all [test projects](https://github.com/gediminasz/just-testing-examples)
1. Run "Publish extension" task

## Installing from file

```
code --install-extension just-testing-0.0.1.vsix
```

## Updating dependencies

```
npm install --dev jest@latest
rm package-lock.json
rm -rf node_modules
npm lock
npm install
```
