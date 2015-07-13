var mongoose = require('./../../mongoose-aplus.js');

var Schema = mongoose.Schema;

var sampleSchema = new Schema({
    indexedRequiredField: { type: String, required: true },
    requiredField: { type: String, required: true },
    notRequiredField: { type: String }
});

sampleSchema.index({ indexedRequiredField: 1 }, { name: 'key', unique: true });

var SampleModel = mongoose.model('Sample', sampleSchema);

module.exports = SampleModel;
