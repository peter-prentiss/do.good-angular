myApp.controller('DeedsListController', function(UserService, $http) {
  console.log('DeedsListController created');
  const vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;

  getDeedsList();

  function getDeedsList() {
    console.log('getting deeds');
    $http.get('/deedslist')
      .then(response => {
        console.log('here be thine good deeds for the day:', response.data);
        vm.deedslist = response.data;
      })
  }

  vm.addDeed = description => {
    console.log('adding deed', description);
    if(description) {
      vm.deed = {description: description}
      $http.post('/deedslist', vm.deed)
        .then(response => {
          console.log('success', response);
        })
    }
  }

  vm.saveDeed = function(deed) {
    console.log(deed);
    UserService.saveDeed(deed);
    getDeedsList();
  }

  vm.completeDeed = (deed) => {
    console.log(deed);
    UserService.completeDeed(deed);
    getDeedsList();
  }

});
