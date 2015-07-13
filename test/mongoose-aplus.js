var chai = require('chai');
var spies = require('chai-spies');
var expect = chai.expect;
var mongoose = require('./../mongoose-aplus.js');
var SampleModel = require('./support/sample-model.js');

chai.use(spies);

describe('mongoose-aplus', function() {

    var mongoUrl = 'mongodb://localhost/mongoose-aplus-test';
    var modelData = {
        indexedRequiredField: 'x',
        requiredField: 'y'
    };
    var searchQuery = {indexedRequiredField: 'x'};

    it('Should connect to database', function(done) {
        function success(result) {
            expect(result).to.equal(mongoose);
            done();
        }
        var failure = chai.spy();
        mongoose
        .connectP(mongoUrl)
        .then(success, failure);
        expect(failure).to.not.have.been.called();
    });

    it('Should disconnect from the database', function(done) {
        var disconnect = mongoose.disconnect();

        function success(result) {
            expect(result).to.equal(mongoose);
            done();
        }
        var failure = chai.spy();
        mongoose
        .connectP(mongoUrl)
        .then(disconnect)
        .then(success, failure);
        expect(failure).to.not.have.been.called();
    });

    describe('.Model', function() {

        beforeEach(function(done) {

            SampleModel.find().removeP().then(function() {
                done();
            }, done);
        });

        it('#saveP() Should add a document', function(done) {

            var model = new SampleModel(modelData);
            model.saveP().then(function(document) {
                expect(document).to.have.property('_id');
                done();
            }, done);
        });

        it('#removeP() Should remove a document', function(done) {

            var model = new SampleModel(modelData);
            model.saveP().then(function(document) {
                return document.removeP();
            }).then(function(result) {
                expect(result).to.have.property('_id');
                done();
            }, done);
        });

    });

    describe('.Query', function() {

        beforeEach(function(done) {

            var model = new SampleModel(modelData);
            SampleModel.find().removeP().then(model.saveP()).then(function() {
                done();
            }, done);
        });

        it('#countP() Should calculate count', function(done) {

            SampleModel.countP().then(function(result) {
                expect(result).to.equal(1);
                done();
            }, done);
        });

        it('#findP() Should find documents', function(done) {

            SampleModel.where(searchQuery).findP()
            .then(function(results) {
                expect(results.length).to.equal(1);
                done();
            }, done);
        });

        it('#findOneP() Should findOne document', function(done) {

            SampleModel.where(searchQuery).findOneP()
            .then(function(result) {
                expect(result).to.have.property('_id');
                expect(result).to.have.property('indexedRequiredField', 'x');
                expect(result).to.have.property('requiredField', 'y');
                done();
            }, done);
        });

        it('#removeP() Should clear the collection', function(done) {

            SampleModel.where().removeP().then(function(result) {
                expect(result.result.ok).to.equal(1);
                done();
            }, done);
        });

        it('#removeP() Should remove a document', function(done) {

            SampleModel.where(searchQuery).removeP()
            .then(function(result) {
                expect(result.result.n).to.equal(1);
                done();
            }, done);
        });
    });

});
