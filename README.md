# mongoose-aplus
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

- mongoose.connectP()
- mongoose.disconnectP()
- mongoose.Model#saveP()
- mongoose.Model#removeP()
- mongoose.Query.countP()
- mongoose.Query#findP()
- mongoose.Query#findOneP()
- mongoose.Query#removeP()

## Tests

```js
npm run tests
```
