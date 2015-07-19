var mongoose = require('mongoose');
var promooseify = require('./promooseify');

mongoose.promooseify = promooseify;

mongoose.connectP = connectP = function connectP(uri) {
  return new Promise(function connectPromise(resolve, reject) {
    if (mongoose.connection._readyState) {
      return resolve(mongoose);
    }

    mongoose.connect(uri, function connectCallback(err) {
      if (err) return reject(err);
      return resolve(mongoose);
    });
  });
};

mongoose.disconnectP = disconnectP = function disconnectP() {
  return new Promise(function disconnectPromise(resolve, reject) {
    mongoose.disconnect(function disconnectCallback(err) {
      if (err) return reject(err);
      return resolve(mongoose);
    });
  });
};

// mongoose.Model.*
[
  'aggregate',
  'count',
  'create',
  'distinct',
  'find',
  'findById',
  'findByIdAndRemove',
  'findByIdAndUpdate',
  'findOne',
  'findOneAndRemove',
  'findOneAndUpdate',
  'geoNear',
  'geoSearch',
  'mapReduce',
  'populate',
  'remove',
  'update'
].map(promooseify.applyStatic(mongoose.Model));

// mongoose.Model#*
['save', 'remove'].map(promooseify.applyMethod(mongoose.Model));

// mongoose.Query#*
[
  'count',
  'distinct',
  'exec',
  'find',
  'findOne',
  'findOneAndRemove',
  'findOneAndUpdate',
  'remove',
  'update'
].map(promooseify.applyMethod(mongoose.Query));

module.exports = mongoose;
