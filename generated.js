var every = function(fns) {
	if (!fns) {
		return 'true';
	}

	return '('+fns.join(' && ')+')';
};

var compileQuery = function(query) {
	var fns = Object.keys(query).map(function(name) {
		return compileProperty(name, query[name]);
	});

	return every(fns);
};

var compileProperty = function(name, prop) {
	if (typeof prop !== 'object') prop = {$eq: prop};

	var fns = Object.keys(prop).map(function(key) {
		switch (key) {
			case '$eq':
			return 'doc['+JSON.stringify(name)+'] === '+JSON.stringify(prop[key]);

			case '$gt':
			return 'doc['+JSON.stringify(name)+'] > '+JSON.stringify(prop[key]);

			case '$lt':
			return 'doc['+JSON.stringify(name)+'] < '+JSON.stringify(prop[key]);

			case '$not':
			return '!'+compileProperty(name, prop[key]);
		}

		return 'false';
	});

	return every(fns);
};

module.exports = function(query) {
	query = compileQuery(query);
	return new Function('doc', 'return '+query);
};

