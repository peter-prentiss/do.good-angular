myApp.controller('DeedsListController', function(UserService, $http) {
  console.log('DeedsListController created');
  const vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;

  getDeeds();
  // getDeedsList();
  vm.completedDeeds = vm.userObject.completed;
  // vm.savedDeeds = vm.userObject.saved;
  vm.savedDeeds;

  function getDeeds() {
    console.log('getting saved deeds');
    $http.get('/deedslist/saved')
      .then(response => {
        vm.savedDeeds = response.data.saved;
        vm.completedDeeds = response.data.completed;
        console.log('saved deeds:', vm.savedDeeds, vm.completedDeeds);
        // getDeedsList();
    }).then(() => getDeedsList())
  }

  function getDeedsList() {
    console.log('getting deeds');
    $http.get('/deedslist')
      .then(response => {
        console.log('here be thine good deeds for the day:', response.data);
        let deedlist = response.data;
        vm.deedslist = deedlist.filter(function(e){
          return vm.completedDeeds.filter(function(f) {
            return f._id == e._id;
          }).length == 0
        })
        vm.deedslist = deedlist.filter(function(e){
          return vm.savedDeeds.filter(function(f) {
            return f._id == e._id;
          }).length == 0
        })
        console.log('completed deeds', vm.completedDeeds);
        console.log(vm.deedslist);
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

  vm.shareDeed = (deed) => {
    console.log(deed);
    UserService.shareDeed(deed);
  }
});
