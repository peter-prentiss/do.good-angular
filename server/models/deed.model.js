var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Mongoose Schema
var DeedSchema = new Schema({
    description: {type: String, required: true, index: {unique: true}},
    popularity: {type: Number, default: 0}
});

module.exports = mongoose.model('Deed', DeedSchema);
