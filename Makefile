ci:
	npm audit --audit-level high
	npm install
	npm run --silent ci:lint
	npm run --silent ci:test

fix:
	npm run fix

update:
	npm add --save-dev jest@latest standard@latest

package: ci
	vsce package

publish: package
	vsce publish
