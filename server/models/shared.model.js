var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const CommentSchema = new Schema({
  comment: String,
  username: String
})

// Mongoose Schema
var SharedSchema = new Schema({
    description: {type: String},
    username: {type: String},
    userId: String,
    comments: [CommentSchema]
});

module.exports = mongoose.model('Share', SharedSchema);
