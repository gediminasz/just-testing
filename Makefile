test:
	npm run --silent test

ci:
	npm audit --audit-level high
	npm install
	npm run --silent lint
	npm run --silent typecheck
	npm run --silent test -- --coverage

fix:
	npm run fix

update:
	rm -r node_modules package-lock.json
	npm install

package: ci
	vsce package

publish: package
	vsce publish
