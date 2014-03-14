# ==============================================================================
# Node Tests
# ==============================================================================

REPORTER = spec

test:
	@NODE_ENV=test NODE_PATH=lib ./node_modules/.bin/mocha \
		--reporter $(REPORTER)

coverage:
	@NODE_ENV=test NODE_PATH=lib ./node_modules/.bin/mocha \
		--require blanket \
		--reporter html-cov > ./test/coverage.html

coveralls:
	@NODE_ENV=test NODE_PATH=lib ./node_modules/.bin/mocha \
		--require blanket \
		--reporter mocha-lcov-reporter | ./node_modules/coveralls/bin/coveralls.js

# ==============================================================================
# Static Analysis
# ==============================================================================

JSHINT = jshint
SOURCES = lib/main

lint:
	$(JSHINT) $(SOURCES)


.PHONY: test lint coverage