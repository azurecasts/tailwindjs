test:
	mocha test/ --recursive --exit

web:
	node index.js

.PHONY: test
