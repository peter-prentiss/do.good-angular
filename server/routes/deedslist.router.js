var express = require('express');
var router = express.Router();
var passport = require('passport');
var Deed = require('../models/deed.model.js');
var path = require('path');
var User = require('../models/user.model.js')
var mongoose = require('mongoose');
const Share = require('../models/shared.model.js')

router.get('/', function(req, res) {
  console.log('getting the deeds');

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

router.get('/saved', function(req, res) {
  console.log('getting saved deeds');
  let userId = req.user._id
  console.log('user id:', req.user._id)
  User.findById(req.user._id, (err, user) => {
    console.log('user saved deeds', user.saved);
    if(err) {
      throw err;
    } else {
      console.log('user saved deeds', user.saved);
      res.send({saved: user.saved, completed: user.completed})
    }
  })
})

router.post('/', function(req, res) {
  console.log('adding new deed:', req.body);
    var deedToSave = {
      description : req.body.description,
      note: req.body.note
    };


    Deed.create(deedToSave, function(err, post) {
         if(err) {
           // next() here would continue on and route to routes/index.js
           throw err;
         } else {
          // route a new express request for GET '/'
          res.sendStatus(201);
         }
    });
});

router.put('/complete', function(req, res) {
  console.log('put route data', req.body.completedDeed);
  addPopularity(req.body.completedDeed._id)
  User.findByIdAndUpdate(
    req.user._id,
    {$push: {completed: req.body.completedDeed}},
    function(err, response) {
      console.log('put outcome:', err, response);
    }
  )
  res.sendStatus(200);
})

router.put('/edit', function(req, res) {
  console.log('edit deed data', req.body);
  User.findOneAndUpdate(
    { "_id": req.user._id, "saved._id": req.body._id },
    {$set: {
        "saved.$.description": req.body.description,
        "saved.$.note": req.body.note
      }
    },
    function(err, response) {
      console.log('attempt to edit deed:', err, response);
    }
  )
  res.sendStatus(200)
})

router.put('/save', function(req, res) {
  console.log('put route data', req.body.savedDeed);
  User.findByIdAndUpdate(
    req.user._id,
    {$push: {saved: req.body.savedDeed}},
    function(err, response) {
      console.log('adding to saved attempt:', err, response);
    }
  )
  res.sendStatus(200);
})

function addPopularity(deedId) {
  console.log('adding popularity to deed id:', deedId);
  Deed.findOneAndUpdate({ _id: deedId }, { $inc: { popularity: 1 }},
    function(err, response) {
      console.log('popularity attempt:', err, response);
    }
  )
}

router.post('/share', function(req, res) {
  console.log('sharing deed:', req.body);
  var deedToShare = {
    description : req.body.sharedDeed.description,
    username: req.body.userName
  };


  Share.create(deedToShare, function(err, post) {
     if(err) {
       // next() here would continue on and route to routes/index.js
       next(err);
     } else {
      // route a new express request for GET '/'
      res.sendStatus(201);
     }
  });
})

router.put('/markshared', function(req, res) {
  console.log('put route data markshared', req.body.sharedDeed);
  User.findOneAndUpdate(
    { "_id": req.user._id, "completed._id": req.body.sharedDeed._id },
    {$set: {"completed.$.shared": true}},
    function(err, response) {
      console.log('attempt to mark shared:', err, response);
    }
  )
  res.sendStatus(200);
})

router.put('/removesave', function(req, res) {
  console.log('put route remove saved:', req.body.completedDeed);
  User.findByIdAndUpdate(
    req.user._id,
    { $pull: {"saved": {_id: mongoose.Types.ObjectId(req.body.completedDeed._id)}}},
    function(err, response) {
      console.log('attempt to remove saved:', err, response);
    }
  )
  res.sendStatus(200);
})

router.put('/like', function(req, res) {
  console.log('put route add like:', req.body);
  Share.findByIdAndUpdate(
    req.body._id,
    { $inc: {"likes": 1}},
    function(err, response) {
      console.log('attempt to like:', err, response);
    }
  )
  res.sendStatus(200);
})

router.get('/share', function(req, res) {
  console.log('getting the shared deeds');

  Share.find({}, function(err, data) { //find * (same as in mongoose)
    if(err) {
      console.log('find error: ', err);
      res.sendStatus(500);
    } else {
      res.send(data); //array of objects - each obj a document in the collectin in the db
      //res.send(result.rows) - same as
      console.log('all deeds from db: ', data);
    }//end if
  });//end find

})

module.exports = router;
