ci:
	npm audit
	npm install
	npm run --silent ci:lint
	npm run --silent ci:test

update:
	npm add --include=dev jest@latest standard@latest

package: ci
	vsce package

publish: package
	vsce publish
