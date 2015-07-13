var mongoose = require('mongoose');

mongoose.connectP = connectP;
mongoose.disconnectP = disconnectP;

mongoose.Model.prototype.saveP = repromiseCallback('save');
mongoose.Model.prototype.removeP = repromiseCallback('remove');

mongoose.Query.__proto__.countP = repromiseCallback('count');
mongoose.Query.prototype.findP = repromiseCallback('find');
mongoose.Query.prototype.findOneP = repromiseCallback('findOne');
mongoose.Query.prototype.removeP = repromiseCallback('remove');

function connectP(uri) {
    return new Promise(function connectPromise(resolve, reject) {
        if (mongoose.connection._readyState) {
            return resolve(mongoose);
        }

        mongoose.connect(uri, function connectCallback(err) {
            if (err) return reject(err);
            return resolve(mongoose);
        });
    });
}

function disconnectP() {
    return new Promise(function disconnectPromise(resolve, reject) {
        mongoose.disconnect(function disconnectCallback(err) {
            if (err) return reject(err);
            return resolve(mongoose);
        });
    });
}

function repromiseCallback(funcName) {
    return function callbackPromise() {
        var args = Array.prototype.slice.call(arguments);
        var _this = this;
        var scopedFunc = curryFunctionScope(_this, funcName);
        return callbackToPromise(scopedFunc, _this, args);
    };
}

function curryFunctionScope(scope, funcName) {
    var func = scope[funcName];
    return function scopedFunction(args) {
        return func.apply(scope, args);
    }
}

function callbackToPromise(func, scope, args) {
    return new Promise(function callbackPromise(resolve, reject) {
        args.push(function finalCallback(err, result) {
            if (err) return reject(err);
            return resolve(result);
        });
        return func(args);
    });
}

module.exports = mongoose;
