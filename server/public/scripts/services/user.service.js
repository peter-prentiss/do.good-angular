myApp.factory('UserService', function($http, $location){
  console.log('UserService Loaded');

  var userObjectServ = {};

  return {
    userObject : userObjectServ,

    getuser : function(){
      console.log('UserService -- getuser');
      $http.get('/user').then(function(response) {
        console.log('user data', response);
          if(response.data.username) {
              // userObject = {};
              // userObjectServ = response.data;
              // user has a curret session on the server
              userObjectServ.userName = response.data.username;
              userObjectServ.completed = response.data.completed;
              userObjectServ.saved = response.data.saved;
              userObjectServ.partner = response.data.partner;
              userObjectServ.children = response.data.children;
              userObjectServ.friends = response.data.friends;
              userObjectServ.admin = response.data.admin;
              userObjectServ.img = response.data.img;
              console.log('UserService -- getuser -- User Data: ', userObjectServ);

              return true;
          } else {
              console.log('UserService -- getuser -- failure');
              // user has no session, bounce them back to the login page
              $location.path("/home");
          }
      },function(response){
        console.log('UserService -- getuser -- failure: ', response);
        $location.path("/home");
      });
    },

    logout : function() {
      console.log('UserService -- logout');
      return $http.get('/user/logout').then(function(response) {
        console.log('UserService -- logout -- logged out');
        userObjectServ = new Object();
        return userObjectServ;
        // $location.path("/home");
      });
    },

    saveDeed: function(deed) {
      console.log('saving deed', deed);
      userObjectServ.savedDeed = {
        description: deed.description,
        note: deed.note
        // _id: deed._id
      }
      console.log('userObjectServ:', userObjectServ);
      $http.put('/deedslist/save', userObjectServ).then(function(response) {
        console.log('completed deed');
      })
    },

    completeDeed: function(deed) {
      console.log('completing deed', deed);
      userObjectServ.completedDeed = {
        description: deed.description,
        _id: deed._id
      }
      // put in if
      console.log('userObjectServ:', userObjectServ);
      $http.put('deedslist/removesave', userObjectServ).then(function(response) {
        console.log('removed from save');
      })
      $http.put('/deedslist/complete', userObjectServ).then(function(response) {
        console.log('completed deed');
      })
    },

    removeSaved: function(deed) {
      console.log('removing saved in service', deed);
      userObjectServ.completedDeed = {
        description: deed.description,
        _id: deed._id
      }
      // put in if
      $http.put('deedslist/removesave', userObjectServ).then(function(response) {
        console.log('removed from save');
      })
    },

    shareDeed: function(deed) {
      console.log('sharing deed:', deed);
      userObjectServ.sharedDeed = {
        description: deed.description,
        _id: deed._id
      }
      console.log('userObjectServ:', userObjectServ);
      $http.put('/deedslist/markshared', userObjectServ).then(function(response) {

      })
      $http.post('/deedslist/share', userObjectServ).then(function(response) {
        console.log('shared deed')
      })
    }
  };
});
