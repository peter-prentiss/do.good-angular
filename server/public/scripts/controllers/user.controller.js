myApp.controller('UserController', function(UserService, $http) {
  console.log('UserController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;

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
});
