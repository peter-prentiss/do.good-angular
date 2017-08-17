var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Mongoose Schema
var PendingDeedSchema = new Schema({
    description: { type: String, required: true, index: { unique: true } },
    username: { type: String }
});

module.exports = mongoose.model('PendingDeed', PendingDeedSchema);
