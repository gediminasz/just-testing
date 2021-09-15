update:
	npm install --dev jest@latest standard@latest
	rm package-lock.json
	rm -rf node_modules
	npm install
