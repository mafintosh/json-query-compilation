var compile = require('./'+process.argv[2]);
var assert = require('assert');

var match = compile({
	test: {
		$gt: 4,
		$lt: 10
	},
	yes: true,
	no: {
		$not: {
			$eq: true
		}
	}
});

assert.ok(match({test:5, yes:true, no:false}));
assert.ok(!match({test:10, yes:true, no:false}));
assert.ok(!match({test:5, yes:true, no:true}));
assert.ok(!match({test:5, yes:false, no:false}));
