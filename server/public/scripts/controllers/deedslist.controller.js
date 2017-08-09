myApp.controller('DeedsListController', function(UserService, $http) {
  console.log('DeedsListController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;

  vm.completeDeed = function(deed) {
    console.log(deed);
    UserService.completeDeed(deed);
    getDeedsList();
  }

  getDeedsList();

  function getDeedsList() {
    console.log('getting deeds');
    $http.get('/deedslist')
      .then(function(response) {
        console.log('here be thine good deeds for the day:', response.data);
        vm.deedslist = response.data;
      })
  }

  vm.addDeed = function(description) {
    console.log('adding deed', description);
    if(description) {
      vm.deed = {description: description}
      $http.post('/deedslist', vm.deed)
        .then(function(response) {
          console.log('success', response);
        })
    }
  }

  // vm.saveDeed = function(deed) {
  //   vm.savedDeed = {
  //     description: description
  //   }
  //   $http.post('/')
  // }
});
