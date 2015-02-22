angular.module('app')
.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('seasons', {
      url: '/tvshow/:tvshowid',
      views: {
        header: {
          templateUrl: 'layout/headers/backable.tpl.html'
        },
        body: {
          templateUrl: 'tvshow/seasons.tpl.html',
          controller: 'TvShowSeasonsCtrl'
        }
      }
    });
  }
])
.controller('TvShowSeasonsCtrl', ['$scope', '$stateParams', '$location',
  function TvShowSeasonsCtrl($scope, $stateParams, $location) {
    $scope.loading = true;
    $scope.updating = false;
    $scope.tvshowid = parseInt($stateParams.tvshowid);

    function onSeasonsRetrieved(seasons) {
      $scope.seasons = seasons || [];
      $scope.loading = false;
      $scope.updating = false;
      if ($scope.seasons.length === 1) {
        $scope.go('/tvshow/' + $scope.tvshowid + '/' + seasons[0].season);
      }
    };
    var onLoad = function() {
      $scope.xbmc.getSeasons($scope.tvshowid, onSeasonsRetrieved);
    };

    $scope.xbmc.register('VideoLibrary.OnScanFinished', {
      fn: onLoad,
      scope: this
    });
    if ($scope.xbmc.isConnected()) {
      onLoad();
    } else {
      $scope.xbmc.register('Websocket.OnConnected', {
        fn: onLoad,
        scope: this
      });
    }

    $scope.scan = function () {
      $scope.updating = true;
      $scope.xbmc.scan('VideoLibrary');
    };
  }
]);