myApp.controller('SharedListController', function(UserService, $http) {
  console.log('SharedListController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;

  getShared();

  function getShared() {
    $http.get('/deedslist/share').then(function(response) {
      console.log('share response:', response);
      vm.sharedList = response.data;
    })
  }

  vm.likeShared = function(deed) {
    console.log('liking deed:', deed);
    $http.put('/deedslist/like', deed).then(function(response) {
      console.log('like response', response);
      getShared();
    })
  }

});
