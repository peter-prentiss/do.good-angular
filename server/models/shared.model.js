const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  comment: String,
  username: String
})

// Mongoose Schema
const SharedSchema = new Schema({
    description: {type: String},
    username: {type: String},
    userId: String,
    comments: [CommentSchema],
    likes: {type: Number, default: 0}
});

module.exports = mongoose.model('Share', SharedSchema);
