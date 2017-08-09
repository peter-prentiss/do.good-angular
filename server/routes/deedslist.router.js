var express = require('express');
var router = express.Router();
// var passport = require('passport');
var Deed = require('../models/deed.model.js');
var path = require('path');

router.get('/', function(req, res) {
  console.log('getting the shelf items');
  //res.sendFile(path.resolve(__dirname, '../public/views/templates/shelf.html'));

  Deed.find({}, function(err, data) { //find * (same as in mongoose)
    if(err) {
      console.log('find error: ', err);
      res.sendStatus(500);
    } else {
      res.send(data); //array of objects - each obj a document in the collectin in the db
      //res.send(result.rows) - same as
      console.log('all deeds from db: ', data);
    }//end if
  });//end find
});

router.post('/', function(req, res) {
  /*
  username: {type: String, required: true, index: {unique: true}},
  password: {type: String, required: true},
  recipes: {type: Array}
  */
    var deedToSave = {
      description : req.body.description
    };


    Deed.create(deedToSave, function(err, post) {
         if(err) {
           // next() here would continue on and route to routes/index.js
           next(err);
         } else {
          // route a new express request for GET '/'
          res.sendStatus(201);
         }
    });
});

module.exports = router;
