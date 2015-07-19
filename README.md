# mongoose-aplus

[![Build Status](https://travis-ci.org/agentk/mongoose-aplus.svg?branch=master)](https://travis-ci.org/agentk/mongoose-aplus)
[![NPM version](https://badge.fury.io/js/mongoose-aplus.svg)](http://badge.fury.io/js/mongoose-aplus)
[![David DM](https://david-dm.org/agentk/mongoose-aplus.png)](https://david-dm.org/agentk/mongoose-aplus.png)

Simple Node Promise/A+ add on for mongoose

- Based on the [mongoose-promised](https://github.com/davideicardi/mongoose-promised) by [Davide Icardi](https://github.com/davideicardi) which allows you to use Q promises with mongoose.

## Quickstart

### Install

```sh
npm install --save mongoose-aplus
```

### Usage

```js
var mongoose = require('mongoose-aplus');
var MyModel = require('./models/my-model');

// Use mongoose as normal, or with promises
var url = 'mongodb://localhost/some-db';
mongoose.connectP(url)
.then(MyModel.countP())
.then(function(count) {
    console.log('MyModel.count = ' + count);
})
.then(mongoose.disconnectP());
```

## Example

```js
MyModel.where(searchQuery).findP()
.then(function(results) {
    // do something with the results
});
```

## Available functions:

- mongoose
  - mongoose.connectP()
  - mongoose.disconnectP()
- mongoose.Model class methods
  - mongoose.Model.aggregateP()
  - mongoose.Model.countP()
  - mongoose.Model.createP()
  - mongoose.Model.distinctP()
  - mongoose.Model.findP()
  - mongoose.Model.findByIdP()
  - mongoose.Model.findByIdAndRemoveP()
  - mongoose.Model.findByIdAndUpdateP()
  - mongoose.Model.findOneP()
  - mongoose.Model.findOneAndRemoveP()
  - mongoose.Model.findOneAndUpdateP()
  - mongoose.Model.geoNearP()
  - mongoose.Model.geoSearchP()
  - mongoose.Model.mapReduceP()
  - mongoose.Model.populateP()
  - mongoose.Model.removeP()
  - mongoose.Model.updateP()
- mongoose.Model instance methods
  - mongoose.Model#saveP()
  - mongoose.Model#removeP()
- mongoose.Query instance methods
  - mongoose.Query#countP()
  - mongoose.Query#distinctP()
  - mongoose.Query#execP()
  - mongoose.Query#findP()
  - mongoose.Query#findOneP()
  - mongoose.Query#findOneAndRemoveP()
  - mongoose.Query#findOneAndUpdateP()
  - mongoose.Query#removeP()
  - mongoose.Query#updateP()

## Tests

```js
npm run tests
```

## Promooseify

Powering the wrapper is the promooseify module. Each of the mpromise functions are called in a wrapper that takes the original function name, preserves scope and wraps it in a Promise.

The wrapper can also be used in situations where object binding does not matter.

```js
var mongoose = require('mongoose-aplus');
function someFunctionTakingACallback(value, callback) {
  callback(null, value * 2);
}
var wrappedCallback = mongoose.promooseify(someFunctionTakingACallback);
wrappedCallback(10).then(function(result) {
  console.log(result); // -> 20
});
```
