ci:
	npm audit
	npm install
	npm run --silent ci:lint
	npm run --silent ci:test

update:
	npm install --dev jest@latest standard@latest
	rm package-lock.json
	rm -rf node_modules
	npm install
