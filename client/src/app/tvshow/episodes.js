angular.module('app')
.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('episodes', {
      url: '/tvshow/:tvshowid/:season',
      views: {
        header: {
          templateUrl: 'layout/headers/backable.tpl.html'
        },
        body: {
          templateUrl: 'tvshow/episodes.tpl.html',
          controller: 'TvShowEpisodesCtrl'
        }
      }
    });
  }
])
.controller('TvShowEpisodesCtrl', ['$scope', '$stateParams', '$location',
  function TvShowEpisodesCtrl($scope, $stateParams, $location) {
    $scope.loading = true;
    $scope.tvshowid = parseInt($stateParams.tvshowid);
    $scope.season = parseInt($stateParams.season);
    $scope.queue = [];

    var playlistAdd = function () {
      if($scope.queue.length > 0) {
        $scope.xbmc.queue({episodeid: $scope.queue[0].episodeid});
        $scope.queue = $scope.queue.slice(1);
        if ($scope.queue.length > 0) {
          window.setTimeout(playlistAdd.bind(this), 500);
        }
      }
    };

    $scope.$watch('playlist', function () {
      playlistAdd();
    }, true);

    function onEpisodesRetrieved(episodes) {
      $scope.loading = false;
      $scope.episodes = episodes;
    };

    var onLoad = function() {
      $scope.laoding = true;
      $scope.xbmc.getEpisodes($scope.tvshowid, $scope.season, onEpisodesRetrieved);
    };

    if ($scope.xbmc.isConnected()) {
      onLoad();
    } else {
      $scope.xbmc.register('Websocket.OnConnected', {
        fn: onLoad,
        scope: this
      });
    }

    $scope.queueAll = function () {
      $scope.xbmc.queue({episodeid : $scope.episodes[0].episodeid});
      $scope.queue = $scope.episodes.slice(1);
    };
  }
]);