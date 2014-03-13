Ducksboard-node
===============
<a href="https://travis-ci.org/JMPerez/ducksboard-node/"><img src="http://img.shields.io/travis/JMPerez/ducksboard-node.svg"></a>&nbsp;
<a href="https://coveralls.io/r/JMPerez/ducksboard-node"><img src="http://img.shields.io/coveralls/JMPerez/ducksboard-node.svg"></a>

Ducksboard-node is a [Ducksboard](https://ducksboard.com) API wrapper on node.js

This is a simple API wrapper to communicate with [Ducksboard's Push API](dev.ducksboard.com/apidoc/push-api/)

## Installation
Install the module with: `npm install ducksboard-node`

## Getting Started

```javascript
var options = {
	api_key : '#your api key#'
};

var DucksboardNode = require('ducksboard-node');
var dn = new DucksboardNode(options);

// push a simple value to 'my_widget'
dn.pushValue(123, 'my_widget', function(err) {
	if (err){
		console.error('There was an error'); //error pushing to ducksboard server.
	}
});

// push a delta (increment) to 'my_widget'
dn.pushDelta(-4, 'my_widget', function(err) {
	if (err){
		console.error('There was an error'); //error pushing to ducksboard server.
	}
});

// push a value with a timestamp to 'my_widget'
dn.pushValueWithTimestamp(101, +new Date(), 'my_widget', function(err) {
	if (err){
		console.error('There was an error'); //error pushing to ducksboard server.
	}
});

// delete all value of 'my_widget'
dn.deleteValues('my_widget', function(err) {
	if (err){
		console.error('There was an error'); //error pushing to ducksboard server.
	}
});

```
Run the tests with: `npm test` (requires mocha)

## License

Copyright (c) 2014 José M. Pérez Licensed under the MIT license.
