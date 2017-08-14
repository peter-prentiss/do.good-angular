myApp.controller('NavController', function($location) {
    console.log('NavController created');
    var vm = this;

    vm.navigate = function(url) {
      console.log(url);
      $location.path(`/${url}`)
    }
})
