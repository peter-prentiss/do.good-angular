myApp.controller('DeedsListController', function(UserService, $http) {
  console.log('DeedsListController created');
  var vm = this;
  vm.deed = {
    description: ''
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
});
