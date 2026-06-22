# Development notes

## Pre-release checklist

1. Change version in `package.json` to something like `2023.9.0-beta`
1. `npm install`
1. `make package`
1. `code --install-extension just-testing-2023.9.0-beta.vsix`
1. Manually test a few of the [test projects](https://github.com/gediminasz/just-testing-examples)

## Release checklist

1. Bump version in `package.json` and `npm install`.
    * Version should be in the [CalVer](https://calver.org/) format of `YYYY.MM.MICRO`, e.g. `2023.9.0`, `2023.9.1`, `2023.9.2` and so on. The final number (MICRO) is sequential and does not correspond to a calendar day.
1. Ensure `CHANGELOG.md` is up to date.
    * Change the "Unreleased" heading to the version you are about to release.
1. Ensure `README.md` is up to date.
    * Use `make docs` to generate the Settings section.
1. Commit changes.
1. `make publish`
1. Create a release together with a new tag in GitHub.

## Installing from file

```
make package
code --install-extension just-testing-0.0.1.vsix
```

## External links

- https://github.com/gediminasz/just-testing-examples
- https://code.visualstudio.com/api/references/vscode-api
- https://code.visualstudio.com/api/working-with-extensions/publishing-extension#get-a-personal-access-token
