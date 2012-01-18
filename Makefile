REPORTER = list

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter $(REPORTER)

deploy:
	@echo 'Implement this yourself!'


.PHONY: test
