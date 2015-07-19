var chai = require('chai');
var expect = chai.expect;
var chaiSpies = require('chai-spies');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.use(chaiSpies);

var promooseify = require('./../promooseify.js');

describe('promooseify', function() {

  var Klass;
  var obj;
  var inVal;
  var klassOut;
  var objOut;

  function callbackSuccess(input, callback) {
    return callback(null, input + this.addVal);
  }

  function callbackError(input, callback) {
    return callback(input + this.addVal);
  }

  beforeEach(function() {
    inVal = Math.random().toString(36);

    var klassVal = Math.random().toString(36);
    klassOut = inVal + klassVal;
    Klass = function(val) {
      this.addVal = val;
    };
    Klass.addVal = klassVal;
    Klass.staticSuccess = callbackSuccess;
    Klass.staticError = callbackError;

    Klass.prototype.methodSuccess = callbackSuccess;
    Klass.prototype.methodError = callbackError;

    var objVal = Math.random().toString(36);
    objOut = inVal + objVal;
    obj = new Klass(objVal);
  });

  it('given an unscoped callback, it should wrap it in a promise', function(done) {
    expect(promooseify(callbackSuccess)(inVal)).to.eventually.equal(inVal + 'undefined').notify(done);
  });

  it('given an scoped callback, it should wrap it in a promise', function(done) {
    expect(promooseify(obj.methodSuccess)(inVal)).to.eventually.equal(inVal + 'undefined').notify(done);
  });

  it('given an object callback, it should wrap it in a promise', function(done) {
    expect(promooseify(Klass.staticSuccess)(inVal)).to.eventually.equal(inVal + 'undefined').notify(done);
  });

  it('given an unscoped callback and a scope, it should wrap it in a promise', function(done) {
    expect(promooseify(callbackSuccess, obj)(inVal)).to.eventually.equal(objOut).notify(done);
  });

  describe('.applyStatic', function() {
    it('should accept a static callback success', function(done) {
      Klass.staticSuccess(inVal, function(error, output) {
        expect(output).to.equal(klassOut);
        done();
      });
    });

    it('should accept a static callback failure', function(done) {
      Klass.staticError(inVal, function(error, output) {
        expect(error).to.equal(klassOut);
        done();
      });
    });

    it('should extend a static callback success function with a promise wrapped function', function(done) {
      promooseify.applyStatic(Klass)('staticSuccess');
      expect(Object.getPrototypeOf(Klass).staticSuccessP).to.be.a.function;
      expect(Klass.staticSuccessP(inVal)).to.eventually.equal(klassOut).notify(done);
    });

    it('should extend a static callback failure function with a promise wrapped function', function(done) {
      promooseify.applyStatic(Klass)('staticError');
      expect(Object.getPrototypeOf(Klass).staticErrorP).to.be.a.function;
      expect(Klass.staticErrorP(inVal)).to.eventually.rejectedWith(klassOut).notify(done);
    });
  });


  describe('.applyMethod', function() {
    it('should accept a method callback success', function(done) {
      obj.methodSuccess(inVal, function(error, output) {
        expect(output).to.equal(objOut);
        done();
      });
    });

    it('should accept a method callback failure', function(done) {
      obj.methodError(inVal, function(error, output) {
        expect(error).to.equal(objOut);
        done();
      });
    });

    it('should extend a method callback success function with a promise wrapped function', function(done) {
      promooseify.applyMethod(Klass)('methodSuccess');
      expect(Klass.prototype.methodSuccessP).to.be.a.function;
      expect(obj.methodSuccessP(inVal)).to.eventually.equal(objOut).notify(done);
    });

    it('should extend a method callback failure function with a promise wrapped function', function(done) {
      promooseify.applyMethod(Klass)('methodError');
      expect(Klass.prototype.methodErrorP).to.be.a.function;
      expect(obj.methodErrorP(inVal)).to.eventually.rejectedWith(objOut).notify(done);
    });
  });

  describe('.repromiseCallback', function() {
    it('given a function name it should return a promise wrapper', function(done) {
      var test = {testSuccess: callbackSuccess, addVal: 'X'};
      test.promiseSuccess = promooseify.repromiseCallback('testSuccess');
      expect(test.promiseSuccess(inVal)).to.eventually.equal(inVal + 'X').notify(done);
    });
  });

  describe('.curryFunctionScope', function() {
    it('given a function name and scope it should return a scoped apply wrapper', function(done) {
      promooseify.curryFunctionScope(obj, 'methodSuccess')([inVal, shouldSuccess]);
      function shouldSuccess(error, success) {
        expect(success).to.equal(objOut);
        done();
      }
    });
  });

  describe('.callbackShimToPromise', function() {
    it('should wrap a callback shim, scope and arguments in a promise', function(done) {
      function someCallbackShim(args) {
        args[1](null, args[0]);
      }
      var wrappedCallback = promooseify.callbackShimToPromise(someCallbackShim, [inVal]);
      expect(wrappedCallback).to.eventually.equal(inVal).notify(done);
    });
  });
});
