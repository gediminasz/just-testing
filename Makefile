test:
	npm test

ci:
	npm audit --audit-level high
	npm install
	npm run --silent ci:lint
	npm run --silent ci:test

fix:
	npm run fix

update:
	rm -r node_modules package-lock.json
	npm install

package: ci
	vsce package

publish: package
	vsce publish
