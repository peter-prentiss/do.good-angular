myApp.controller('WelcomeController', function($location) {
  console.log('WelcomeController created');

  const vm = this;
  vm.go = function(url) {
    console.log(url);
    $location.path(`/${url}`)
  }
})
