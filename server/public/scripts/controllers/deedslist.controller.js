myApp.controller('DeedsListController', function(UserService, $http, $mdDialog) {
  console.log('DeedsListController created');
  const vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;

  vm.userService.getuser();
  getDeeds();
  // getDeedsList();
  vm.completedDeeds = vm.userObject.completed;
  // vm.savedDeeds = vm.userObject.saved;
  vm.savedDeeds;

  // vm.showPrompt = function(ev, deed, index) {
  //   // Appending dialog to document.body to cover sidenav in docs app
  //   var confirm = $mdDialog.prompt()
  //     .title('Edit your good deed')
  //     .title('Edit your good deed')
  //     .placeholder(deed.description)
  //     .ariaLabel('Dog name')
  //     .initialValue(deed.description)
  //     .targetEvent(ev)
  //     .ok('Save')
  //     .cancel('Cancel');
  //
  //   $mdDialog.show(confirm).then(function(result) {
  //     console.log('You changed your deed to ' + result + '. at index ' + index);
  //   }, function() {
  //     vm.status = 'You didn\'t name your dog.';
  //   });
  // };
  vm.deed;
  vm.index;

  vm.showDeed = function(ev, deed, index) {
    vm.deed = deed;
    vm.index = index;
    // console.log('editing:', vm.deed, 'at index', vm.index);
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'views/partials/inddeed.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: vm.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(deed) {
      // console.log('passing deed?', deed);
      $http.put('/deedslist/edit', deed).then(response => {
        console.log('edit attempt:', response);
      })
    }, function() {
      vm.status = 'You cancelled the dialog.';
    });
  };

  function DialogController($scope, $mdDialog, $http) {
    $scope.deed = vm.deed;
    $scope.index = vm.index;
    // console.log('able to access variables?', $scope.deed, $scope.index);
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
      console.log('edited deed', $scope.deed);
      $mdDialog.hide($scope.deed);
    };
  }

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

  // function getCompleteDeeds() {
  //   console.log('getting complete deeds');
  //   $http.get('/deedslist/complete')
  //     .then(response => {
  //       vm
  //     })
  // }

  function randomNum(i) {
    return Math.floor(Math.random() * i);
  }

  function getDeedsList() {
    console.log('getting deeds');
    $http.get('/deedslist')
      .then(response => {
        console.log('here be thine good deeds for the day:', response.data);
        let deedlist = response.data;
        console.log('completed deeds', vm.completedDeeds);
        vm.deedslist = deedlist.filter(function(e){
          return vm.completedDeeds.filter(function(f) {
            return f.description == e.description;
          }).length == 0
        }).filter(function(e){
          return vm.savedDeeds.filter(function(f) {
            return f.description == e.description;
          }).length == 0
        })
        for(let i = 0; i < vm.deedslist.length; i++) {
          let j = randomNum(vm.userObject.children.length);
          let k = randomNum(vm.userObject.friends.length)
          console.log('random num', j);
          if(vm.userObject.partner) {
            vm.deedslist[i].description = vm.deedslist[i].description.replace(/your partner/, vm.userObject.partner);
          }
          if(vm.userObject.children.length > 0) {
            vm.deedslist[i].description = vm.deedslist[i].description.replace(/your child/, vm.userObject.children[j].name);
          }
          if(vm.userObject.friends.length > 0) {
            vm.deedslist[i].description = vm.deedslist[i].description.replace(/your friend/, vm.userObject.friends[k].name);
          }
          console.log('filtered descriptions', vm.deedslist[i].description);
        }
        console.log('filtered deeds:', vm.deedslist);
      })
  }

  vm.addDeed = (description, note) => {
    console.log('adding deed', description, note);
    if(description) {
      vm.deed = {
        description: description,
        note: note
      }
      vm.saveDeed(vm.deed);
      $http.post('/deedslist', vm.deed)
        .then(response => {
          console.log('success', response);
          vm.description = '';
        })
    }
  }

  vm.saveDeed = function(deed) {
    console.log(deed);
    UserService.saveDeed(deed);
    getDeeds();
  }

  vm.completeDeed = (deed) => {
    console.log(deed);
    UserService.completeDeed(deed);
    getDeeds();
  }

  vm.shareDeed = (deed) => {
    console.log(deed);
    UserService.shareDeed(deed);
    getDeeds();
  }

  vm.inputConcat = (string) => {
    console.log('concatenating string', string);
    vm.description = vm.description.concat(' ', string);
  }
});
