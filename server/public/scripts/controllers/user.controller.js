myApp.controller('UserController', function(UserService, $http, $mdDialog, $location) {
  console.log('UserController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;

  vm.logout = function() {
    UserService.logout().then(function(usr) {
      vm.userObject = usr;
      UserService.userObject = usr;
      console.log('logged out on service. user object:', vm.userObject, UserService.userObject);
      $location.path("/welcome");
    });
  }

  vm.avatarStyle = {
    'width': '200px',
    'height': '200px',
    'border-radius': '100px',
    'background-size': 'cover',
    'display': 'block'
  }

  vm.partner = vm.userObject;
  vm.persons = {
    partner: vm.userObject.partner,
    children: vm.userObject.children,
    friends: vm.userObject.friends
  }
  console.log('user children:', vm.userObject.children);
  vm.updatePartner = function(partner) {
    var partnerToUpdate = {
      name: partner
    }
    console.log('updating partner info', vm.persons.partner);
    $http.put('/user/partner', partnerToUpdate).then(function(response) {
      console.log('partner update result', response);
      vm.userService.getuser();
    })
  }

  vm.addChild = function(childToAdd) {
    console.log('adding child', childToAdd);
    var child = {
      name: childToAdd
    }
    $http.put('/user/children', child).then(function(response) {
      console.log('child adding result', response);
      vm.userService.getuser();
    })
  }

  vm.addFriend = function(friendToAdd) {
    console.log('adding friend', friendToAdd);
    var friend = {
      name: friendToAdd
    }
    $http.put('/user/friend', friend).then(function(response) {
      console.log('friend adding result', response);
      vm.userService.getuser();
    })
  }

  vm.pending;

  vm.approveDeeds = function(ev) {
    console.log('approving deeds');
    $http.get('/deedslist/pending').then(function(response) {
      console.log('got deeds?', response);
      vm.pending = response.data;


    }).then(function() {
      $mdDialog.show({
        controller: PendingController,
        templateUrl: 'views/partials/pending.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: vm.customFullscreen // Only for -xs, -sm breakpoints.
      })
      .then(function(checked) {
        console.log('passing checked array:', checked);
        let pendingArray = [];
        for(let i = 0; i < checked.length; i++) {
          let pendingDeed = {};
          pendingDeed.description = checked[i];
          pendingArray.push(pendingDeed);
        }
        $http.post('/deedslist/approve', pendingArray).then(response => {
          console.log('approved?', response);
        })
      }, function() {
        vm.status = 'You cancelled the dialog.';
      });
    })
  };

  function PendingController($scope, $mdDialog) {
    $scope.pending = vm.pending;
    $scope.checked = [];
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.save = function() {
      console.log('pending array:', $scope.checked);
      $mdDialog.hide($scope.checked);
    };
  }

  vm.client = filestack.init('AX0Uil0hBT3afjt9bxjXXz');
  // Make sure to include your API key above. If you do not have any API key, you can get one here: https://dev.filestack.com/register/free
  vm.pickPic = function() {
    console.log('picking watermark');
    vm.client.pick({
      accept: 'image/*',
      maxFiles:1
    }).then(result => {
      console.log('json result', JSON.stringify(result));
      console.log('url:', result.filesUploaded[0].url);
      let imgUrl = {
        img: result.filesUploaded[0].url
      }
      $http.put('/user/photo', imgUrl).then(function() {
        vm.userService.getuser();
      })
    });
  }

});
