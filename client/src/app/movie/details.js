angular.module('app')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('moviedetails', {
    url: '/movie/:movieid',
    views: {
      header: {templateUrl: 'layout/headers/backable.tpl.html'},
      body: {
        templateUrl: 'movie/details.tpl.html',
        controller: 'MovieDetailsCtrl'
      }
    }
  });
}])
.controller('MovieDetailsCtrl', ['$scope', '$stateParams', '$location',
  function MovieDetailsCtrl($scope, $stateParams, $location, utilities) {
    $scope.movieid = parseInt($stateParams.movieid);
    $scope.loading = true;
    $scope.isCurrentlyPlaying = false;

    function isCurrentlyPlaying() {
      return $scope.player.active && $scope.player.item.id === $scope.library.item.movieid;
    };

    function onMovieRetrieved (item) {
      item.type = 'movie';
      $scope.library.item = item;
      $scope.isCurrentlyPlaying = isCurrentlyPlaying();
      $scope.loading = false;
    };
    var onLoad = function () {
      $scope.xbmc.getMovieDetails($scope.movieid, onMovieRetrieved);
    };
    if ($scope.xbmc.isConnected()) {
      onLoad();
    } else {
      $scope.xbmc.register('Websocket.OnConnected', { fn : onLoad, scope : this});
    }

    $scope.imdb = function (imdbnumber) {
      window.open('http://www.imdb.com/title/' + imdbnumber + '/', '_blank');
    };

    $scope.$watch('player.item', function (newVal, oldVal) {
      $scope.isCurrentlyPlaying = isCurrentlyPlaying();
    });
  }
]);