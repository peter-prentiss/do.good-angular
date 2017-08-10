myApp.controller('DeedsListController', function(UserService, $http) {
  console.log('DeedsListController created');
  const vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;

  getDeedsList();

  vm.completedDeeds = vm.userObject.completed;

  function getDeedsList() {
    console.log('getting deeds');
    $http.get('/deedslist')
      .then(response => {
        console.log('here be thine good deeds for the day:', response.data);
        let deedlist = response.data;
        // let filtered = response.data.filter(function(e){return this.indexOf(e)<0;}, vm.completedDeeds)
        // vm.deedslist = response.data.filter(function(e){return this.indexOf(e)<0;}, vm.completedDeeds)
        vm.deedslist = deedlist.filter(function(e){
          return vm.completedDeeds.filter(function(f) {
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
