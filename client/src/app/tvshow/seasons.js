angular.module('app')
.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('seasons', {
      url: '/tvshow/:tvshowid',
      views: {
        header: {templateUrl: 'layout/headers/navigation.tpl.html', controller : 'HeaderNavController'},
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
    $scope.selectedSeason = '';
    $scope.seasons = [];
    function isCurrentlyPlaying(episodeid) {
      return $scope.player.active && episodeid === $scope.library.item.episodeid;
    };

    function onEpisodesRetrieved(episodes) {
      $scope.loading = false;
      $scope.episodes = episodes;
    };

    function onSeasonsRetrieved(seasons) {
      $scope.seasons = seasons || [];
      $scope.season = seasons[seasons.length-1];
      $scope.xbmc.getEpisodes($scope.tvshowid, $scope.season.season, onEpisodesRetrieved);
    };

    function onTvShowRetrieved(item) {
      item.type = 'tvshow';
      $scope.library.item = item;
      $scope.xbmc.getSeasons($scope.tvshowid, onSeasonsRetrieved);
    };

    var onLoad = function() {
      $scope.xbmc.getTVShowDetails($scope.tvshowid, onTvShowRetrieved);
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

    $scope.changeSeason = function (season) {
      $scope.xbmc.getEpisodes($scope.tvshowid, season.season, onEpisodesRetrieved);
    };
  }
]);