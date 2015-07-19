module.exports = promooseify;

function promooseify() {
  var config = Array.prototype.slice.call(arguments);
  var func = config.shift();
  var scope = config.shift();
  return function() {
    var args = Array.prototype.slice.call(arguments);
    return new Promise(function callbackPromise(resolve, reject) {
      function finalCallback(err, result) {
        if (err) return reject(err);
        resolve(result);
      }
      args.push(finalCallback);
      return func.apply(scope || this, args);
    });
  };
}

promooseify.applyStatic = applyStatic = function applyStatic(object) {
  return function(funcName) {
    Object.getPrototypeOf(object)[funcName + 'P'] = repromiseCallback(funcName);
  };
};

promooseify.applyMethod = applyMethod = function applyMethod(object) {
  return function(funcName) {
    object.prototype[funcName + 'P'] = repromiseCallback(funcName);
  };
};

promooseify.repromiseCallback = repromiseCallback = function repromiseCallback(funcName) {
  return function callbackPromise() {
    var args = Array.prototype.slice.call(arguments);
    var _this = this;
    var scopedFunc = curryFunctionScope(_this, funcName);
    return callbackShimToPromise(scopedFunc, args);
  };
};

promooseify.curryFunctionScope = curryFunctionScope = function curryFunctionScope(scope, funcName) {
  var func = scope[funcName];
  return function scopedFunction(args) {
    return func.apply(scope, args);
  };
};

promooseify.callbackShimToPromise = callbackShimToPromise = function callbackShimToPromise(func, args) {
  return new Promise(function callbackPromise(resolve, reject) {
    args.push(function finalCallback(err, result) {
      if (err) return reject(err);
      return resolve(result);
    });
    return func(args);
  });
};
