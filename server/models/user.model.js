const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
// var DeedSchema = require('../models/deed.model.js');


const DeedSchema = new Schema({
    description: String,
    likes: {type: Number, default: 0},
    userComment: String,
    shared: {type: Boolean, default: false},
    note: String
});

// Mongoose Schema
const UserSchema = new Schema({
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true},
    completed: [DeedSchema],
    saved: [DeedSchema],
    partner: String,
    children: Array,
    friends: Array,
    admin: { type: Boolean, default: false },
    img: String
});

// Called before adding a new user to the DB. Encrypts password.
UserSchema.pre('save', function(next) {
    let user = this;

    if(!user.isModified('password')) {
      return next();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if(err) {
          return next(err);
        }

        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) {
              return next(err);
            }
            //IF WE WERE TO CONSOLE LOG RIGHT MEOW, user.password would be 12345
            user.password = hash;
            next();
        });
    });
});

// Used by login methods to compare login form password to DB password
UserSchema.methods.comparePassword = function(candidatePassword, callback) {
    // 'this' here refers to this instance of the User model
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if(err) {
          return callback(err);
        }

        callback(null, isMatch);
    });
};


module.exports = mongoose.model('User', UserSchema);
