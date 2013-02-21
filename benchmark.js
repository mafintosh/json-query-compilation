var docs = require('./docs');
var compile = require('./'+process.argv[2]);
var query = {
	abefest: 'sjov',
	age: {
		$gt: 10,
		$lt: 40
	},
	funny: {
		$eq: true
	},
	john: {
		$not: {
			$eq: true
		}
	}
};

var runs = 1000;
var now = Date.now();
var match = compile(query);
var matches = match(docs[0]);

console.log('query matches first? '+matches);

if (!matches) return process.exit(1);

for (var i = 0; i < runs; i++) {
	for (var j = 0; j < docs.length; j++) {
		match(docs[j]);
	}
}

console.log(runs*docs.length+' matches took '+(Date.now() - now)+ ' ('+Math.floor(runs*docs.length/(Date.now() - now))+' match/ms)');
