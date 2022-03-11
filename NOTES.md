# Development notes

## Packaging a release

Use "Publish extension" task or `vsce package`.

## Release checklist

1. Bump version in `package.json` and `npm install`
1. Ensure `CHANGELOG.md` is up to date
1. Manually test a few of the [test projects](https://github.com/gediminasz/just-testing-examples)
1. Run "Publish extension" task
1. Create a release in GitHub

## Installing from file

```
code --install-extension just-testing-0.0.1.vsix
```

## External links

- https://github.com/gediminasz/just-testing-examples
- https://code.visualstudio.com/api/references/vscode-api
