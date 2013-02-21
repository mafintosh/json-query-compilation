var queryMatches = function(doc, query) {
	return Object.keys(query).every(function(name) {
		return propertyMatches(doc, name, query[name]);
	});
};

var propertyMatches = function(doc, name, prop) {
	if (typeof prop !== 'object') prop = {$eq: prop};

	return Object.keys(prop).every(function(key) {
		switch (key) {
			case '$eq':
			return doc[name] === prop[key];

			case '$gt':
			return doc[name] > prop[key];

			case '$lt':
			return doc[name] < prop[key];

			case '$not':
			return !propertyMatches(doc, name, prop[key]);
		}

		return false;
	});
};

module.exports = function compile(query) {
	return function match(doc) {
		return queryMatches(doc, query);
	};
};