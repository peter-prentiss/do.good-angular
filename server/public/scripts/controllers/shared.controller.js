myApp.controller('SharedListController', function(UserService, $http, $mdDialog) {
  console.log('SharedListController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;

  getShared();

  function getShared() {
    $http.get('/deedslist/share').then(function(response) {
      console.log('share response:', response);
      vm.sharedList = response.data;
    })
  }

  vm.deed;

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


  vm.likeShared = function(deed) {
    console.log('liking deed:', deed);
    $http.put('/deedslist/like', deed).then(function(response) {
      console.log('like response', response);
      getShared();
    })
  }

});
