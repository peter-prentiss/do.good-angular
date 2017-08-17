myApp.factory('UserService', function($http, $location){
  console.log('UserService Loaded');

  var userObject = {};

  return {
    userObject : userObject,

    getuser : function(){
      console.log('UserService -- getuser');
      $http.get('/user').then(function(response) {
        console.log('user data', response);
          if(response.data.username) {
              // user has a curret session on the server
              userObject.userName = response.data.username;
              userObject.completed = response.data.completed;
              userObject.saved = response.data.saved;
              userObject.partner = response.data.partner;
              userObject.children = response.data.children;
              userObject.friends = response.data.friends;
              userObject.admin = response.data.admin;
              userObject.img = response.data.img;
              console.log('UserService -- getuser -- User Data: ', userObject.userName);
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
      $http.get('/user/logout').then(function(response) {
        console.log('UserService -- logout -- logged out');
        $location.path("/home");
      });
    },

    saveDeed: function(deed) {
      console.log('saving deed', deed);
      userObject.savedDeed = {
        description: deed.description,
        note: deed.note
        // _id: deed._id
      }
      console.log('userObject:', userObject);
      $http.put('/deedslist/save', userObject).then(function(response) {
        console.log('completed deed');
      })
    },

    completeDeed: function(deed) {
      console.log('completing deed', deed);
      userObject.completedDeed = {
        description: deed.description,
        _id: deed._id
      }
      // put in if
      console.log('userObject:', userObject);
      $http.put('deedslist/removesave', userObject).then(function(response) {
        console.log('removed from save');
      })
      $http.put('/deedslist/complete', userObject).then(function(response) {
        console.log('completed deed');
      })
    },

    shareDeed: function(deed) {
      console.log('sharing deed:', deed);
      userObject.sharedDeed = {
        description: deed.description,
        _id: deed._id
      }
      console.log('userObject:', userObject);
      $http.put('/deedslist/markshared', userObject).then(function(response) {

      })
      $http.post('/deedslist/share', userObject).then(function(response) {
        console.log('shared deed')
      })
    }
  };
});
