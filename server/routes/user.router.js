var express = require('express');
var router = express.Router();
var User = require('../models/user.model.js');

// Handles Ajax request for user information if user is authenticated
router.get('/', function(req, res) {
  console.log('get /user route');
  // check if logged in
  if(req.isAuthenticated()) {
    // send back user object from database
    console.log('logged in', req.user);
    var userInfo = {
      username : req.user.username,
      saved : req.user.saved,
      completed : req.user.completed,
      partner: req.user.partner,
      children: req.user.children,
      friends: req.user.friends,
      admin: req.user.admin,
      img: req.user.img
    };
    res.send(userInfo);
  } else {
    // failure best handled on the server. do redirect here.
    console.log('not logged in');
    // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
    res.send(false);
  }
});

// clear all server session information about this user
router.get('/logout', function(req, res) {
  // Use passport's built-in method to log out the user
  console.log('Logged out');
  req.logOut();
  res.sendStatus(200);
});

router.put('/partner', function(req, res) {
  console.log('updating partner', req.body);
  User.findByIdAndUpdate(
    req.user._id,
    {$set: {partner: req.body.name}},
    function(err, response) {
      console.log('partner put outcome:', err, response);
    }
  )
  res.sendStatus(200);
})

router.put('/children', function(req, res) {
  console.log('adding child', req.body);
  User.findByIdAndUpdate(
    req.user._id,
    {$push: {children: req.body}},
    function(err, response) {
      console.log('child put outcome:', err, response);
    }
  )
  res.sendStatus(200);
})

router.put('/friend', function(req, res) {
  console.log('adding child', req.body);
  User.findByIdAndUpdate(
    req.user._id,
    {$push: {friends: req.body}},
    function(err, response) {
      console.log('child put outcome:', err, response);
    }
  )
  res.sendStatus(200);
})

router.put('/photo', function(req, res) {
  console.log('uploading imgUrl', req.body.img);
  User.findByIdAndUpdate(
    req.user._id,
    {$set: {img: req.body.img}},
    function(err, response) {
      console.log('child put outcome:', err, response);
    }
  )
  res.sendStatus(200);
})

module.exports = router;
