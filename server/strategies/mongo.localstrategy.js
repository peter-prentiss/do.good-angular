const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/user.model.js');

// Store this user's unique id in the session for later reference
// Only runs during authentication
// Stores info on req.session.passport.user
passport.serializeUser((user, done) => done(null, user.id));

// Runs on every request after user is authenticated
// Look up the user's id in the session and use it to find them in the DB for each request
// result is stored on req.user
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    if(err) {
      done(err);
    }
    done(null, user);
  });
});

// Does actual work of logging in
// Called by middleware stack
passport.use('local', new localStrategy({
  passReqToCallback: true,
  usernameField: 'username'
}, (req, username, password, done) => {
    // mongoose stuff
    User.findOne({username: username}, (err, user) => {
      if(err) {
        throw err;
      }
      // user variable passed to us from Mongoose if it found a match to findOne() above
      if(!user) {
        // user not found
        console.log('userStrategy.js :: no user found');
        return done(null, false, {message: 'Incorrect credentials.'});
      } else {
        // found user! Now check their given password against the one stored in the DB
        // comparePassword() is defined in the schema/model file!
        user.comparePassword(password, (err, isMatch) => {
          if(err) {
            throw err;
          }

          if(isMatch) {
            // all good, populate user object on the session through serializeUser
            console.log('userStrategy.js :: all good');
            return(done(null, user));
          } else {
            // no good.
            console.log('userStrategy.js :: password incorrect');
            done(null, false, {message: 'Incorrect credentials.'});
          }
        });
      } // end else
    }); // end findOne
  } // end callback
));

module.exports = passport;
