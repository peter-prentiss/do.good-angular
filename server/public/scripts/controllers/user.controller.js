myApp.controller('UserController', function(UserService) {
  console.log('UserController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;

  vm.persons = {
    partner: 'Taylor',
    children: '',
    friends: ''
  }
});
