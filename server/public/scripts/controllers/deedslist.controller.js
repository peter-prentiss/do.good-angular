myApp.controller('DeedsListController', function(UserService, $http, $mdDialog) {
  console.log('DeedsListController created');
  const vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;

  vm.userService.getuser();
  getDeeds();
  getShared();
  // getDeedsList();
  vm.completedDeeds = vm.userObject.completed;
  // vm.savedDeeds = vm.userObject.saved;
  vm.savedDeeds;

  vm.save = true;
  vm.share = false;

  vm.deed;
  vm.index;

  function getShared() {
    console.log('getting shared deeds');
    $http.get('/deedslist/usershared').then(response => {
      console.log('got users shared:', response);
      vm.sharedList = response.data;
    })
  }

  vm.commentDeed = function(ev, deed) {
    vm.deed = deed;
    console.log('comments on deed:', vm.deed,);
    $mdDialog.show({
      controller: CommentController,
      templateUrl: 'views/partials/commentview.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: vm.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(comment) {
      // console.log('passing comment?', comment, deed);
      // deed.addedcomment = comment
      // $http.put('/deedslist/comment', deed).then(response => {
      //   console.log('edit attempt:', response);
      //   getShared();
      // })
    }, function() {
      vm.status = 'You cancelled the dialog.';
    });
  };

  function CommentController($scope, $mdDialog, $http) {
    $scope.comments = vm.deed.comments;
    console.log('deed comments:', $scope.comments);
    $scope.deed = vm.deed;
    $scope.index = vm.index;
    // console.log('able to access variables?', $scope.deed, $scope.index);
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.comment = function(comment) {
      console.log('added comment', comment, $scope.deed);
      // $mdDialog.hide(comment);
      $scope.deed.addedcomment = comment
      $http.put('/deedslist/comment', $scope.deed).then(response => {
        console.log('edit attempt:', response);
        getShared();
      })
    };
  }


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
        for(let i = 0; i < vm.savedDeeds.length; i++) {
          let j = randomNum(vm.userObject.children.length);
          let k = randomNum(vm.userObject.friends.length)
          // console.log('random num', j);
          if(vm.userObject.partner) {
            vm.savedDeeds[i].description = vm.savedDeeds[i].description.replace(/your partner/, vm.userObject.partner);
          }
          if(vm.userObject.children.length > 0) {
            vm.savedDeeds[i].description = vm.savedDeeds[i].description.replace(/your child/, vm.userObject.children[j].name);
          }
          if(vm.userObject.friends.length > 0) {
            vm.savedDeeds[i].description = vm.savedDeeds[i].description.replace(/your friend/, vm.userObject.friends[k].name);
          }
          // console.log('filtered descriptions', vm.deedslist[i].description);
        }

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
          // console.log('random num', j);
          if(vm.userObject.partner) {
            vm.deedslist[i].description = vm.deedslist[i].description.replace(/your partner/, vm.userObject.partner);
          }
          if(vm.userObject.children.length > 0) {
            vm.deedslist[i].description = vm.deedslist[i].description.replace(/your child/, vm.userObject.children[j].name);
          }
          if(vm.userObject.friends.length > 0) {
            vm.deedslist[i].description = vm.deedslist[i].description.replace(/your friend/, vm.userObject.friends[k].name);
          }
          // console.log('filtered descriptions', vm.deedslist[i].description);
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
      if(vm.save) {
        vm.saveDeed(vm.deed);
      }
      if(vm.share) {
        $http.post('/deedslist/pending', vm.deed)
          .then(response => {
            console.log('success', response);
          })
      }
      vm.description = '';
      vm.note = '';
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

  vm.removeSaved = deed => {
    console.log('removing saved', deed);
    UserService.removeSaved(deed);
    getDeeds();
  }

  vm.inputConcat = (string) => {
    console.log('concatenating string', string);
    vm.description = vm.description.concat(' ', string, ' ');
  }
});
