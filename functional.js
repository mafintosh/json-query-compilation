var every = function(fns) {
	if (!fns) {
		return function() {
			return true;
		};
	}

	return fns.reduce(function(prev, fn) {
		return function(doc) {
			return prev(doc) && fn(doc);
		};
	});
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
			return function(doc) {
				return doc[name] === prop[key];
			};

			case '$gt':
			return function(doc) {
				return doc[name] > prop[key];
			};

			case '$lt':
			return function(doc) {
				return doc[name] < prop[key];
			};

			case '$not':
			var inner = compileProperty(name, prop[key]);
			return function(doc) {
				return !inner(doc);
			};
		}

		return function() {
			return false;
		};
	});

	return every(fns);
};

module.exports = compileQuery;
