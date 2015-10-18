angular.module('app')
.controller('EpisodesCtrl', ['$scope',
  function EpisodesCtrl($scope) {
    $scope.loading = true;
    $scope.fetching = false;
    $scope.empty = false;

    $scope.requestItemsBy = 50;
    $scope.total = Infinity;
    $scope.episodes = [];

    function onEpiosdesFromSource(result) {
      var episodes = result && result.episodes ? result.episodes : [];
      $scope.total = result ? result.limits.total : Infinity;
      $scope.episodes = $scope.episodes.concat(episodes);
      $scope.loading = false;
      $scope.fetching = false;
      $scope.empty = !$scope.episodes.length;
    };

    function onLoad() {
      var limits =  {
        'start' : 0,
        'end' : $scope.requestItemsBy
      }
      $scope.xbmc.getRecentlyAddedEpisodes(onEpiosdesFromSource, limits);
    };

    if ($scope.xbmc.isConnected()) {
      onLoad();
    } else {
      $scope.xbmc.register('Websocket.OnConnected', {
        fn: onLoad,
        scope: this
      });
    }

    $scope.loadMore = function () {
      if( $scope.episodes.length < $scope.total) {
        $scope.fetching = true;
        var limits =  {
          'start' : $scope.episodes.length,
          'end' : Math.min($scope.episodes.length+$scope.requestItemsBy, $scope.total)
        };
        $scope.xbmc.getRecentlyAddedEpisodes(onEpiosdesFromSource, limits);
      }
    };

    $scope.remove = function (index, episode) {
      var onEpisodeRemoved = function(){
        $scope.episodes.splice(index, 1);
      };
      $scope.xbmc.removeEpisode(episode.episodeid, onEpisodeRemoved);
    };

    $scope.toggleWatched = function (episode) {
      var newValue =  episode.playcount ? 0 : 1;
      $scope.xbmc.setEpisodeDetails({
        episodeid : episode.episodeid,
        playcount  :newValue
      },  function(result) {
        if(result === 'OK') {
          episode.playcount = newValue;
        }
      })
    };
  }]
);