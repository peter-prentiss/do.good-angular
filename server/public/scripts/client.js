var myApp = angular.module('myApp', ['ngRoute', 'ngMaterial']);

/// Routes ///
myApp.config(function($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');
  console.log('myApp -- config')
  $routeProvider
    .when('/welcome', {
      templateUrl: '/views/templates/welcome.html',
      controller: 'LoginController as lc',
    })
    .when('/login', {
      templateUrl: '/views/templates/login.html',
      controller: 'LoginController as lc',
    })
    .when('/register', {
      templateUrl: '/views/templates/register.html',
      controller: 'LoginController as lc'
    })
    .when('/user', {
      templateUrl: '/views/templates/user.html',
      controller: 'UserController as uc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/shared', {
      templateUrl: '/views/templates/shared.deeds.html',
      controller: 'UserController as uc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/deedslist', {
      templateUrl: '/views/templates/deedslist.html',
      controller: 'DeedsListController as dc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/complete', {
      templateUrl: '/views/templates/completed.deeds.html',
      controller: 'DeedsListController as dc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/newdeed', {
      templateUrl: '/views/templates/newdeed.html',
      controller: 'DeedsListController as dc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/shared', {
      templateUrl: '/views/templates/shared.deeds.html',
      controller: 'SharedListController as sc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .otherwise({
      redirectTo: 'login'
    });
});
