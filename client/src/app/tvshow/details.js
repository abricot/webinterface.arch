angular.module('app')
.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('seasons', {
      url: '/tvshow/:tvshowid',
      views: {
        header: {templateUrl: 'layout/headers/navigation.tpl.html', controller : 'HeaderNavController'},
        body: {
          templateUrl: 'tvshow/details.tpl.html',
          controller: 'ShowDetailsCtrl'
        }
      }
    });
  }
])
.controller('ShowDetailsCtrl', ['$scope', '$stateParams', '$location', '$filter',
  function ShowDetailsCtrl($scope, $stateParams, $location, $filter) {
    $scope.loading = true;
    $scope.updating = false;
    $scope.tvshowid = parseInt($stateParams.tvshowid);

    $scope.show = null;
    $scope.seasons = [];
    $scope.selectedSeason = '';

    $scope.episodes = [];
    $scope.nextAiringEpisode = null;

    $scope.queue = [];

    var onPlaylistAdd = function () {
      if($scope.queue.length > 0) {
        $scope.xbmc.queue({episodeid: $scope.queue[0].episodeid});
        $scope.queue = $scope.queue.slice(1);
        if ($scope.queue.length > 0) {
          window.setTimeout(onPlaylistAdd.bind(this), 500);
        }
      }
    };

    $scope.$watch('playlist', function () {
      onPlaylistAdd();
    }, true);

    function getNextAiringEpisodes(episodes) {
      episodes = episodes || [];
      var now = Date.now();
      return episodes.filter(function(episode){
        var airDate = new Date(episode['air_date']);
        return airDate.getTime() > now;
      });
    }

    function isCurrentlyPlaying(episodeid) {
      return $scope.player.active && episodeid === $scope.library.item.episodeid;
    };

    function onEpisodesRetrieved(episodes) {
      $scope.loading = false;
      $scope.episodes = episodes;
    };

    function onSeasonsRetrieved(seasons) {
      $scope.seasons = seasons || [];
      if($scope.seasons.length > 0) {
        $scope.season = seasons[seasons.length-1];
        $scope.xbmc.getEpisodes($scope.tvshowid, $scope.season.season, onEpisodesRetrieved);
      } else {
        $scope.loading = false;
      }

      $scope.tmdb.find('tvdb_id', $scope.show.imdbnumber).then(function(result){
        var shows = result.tvShows;
        if(shows.length === 1) {
          $scope.tmdb.tvshow(shows[0].id).then(function(tv) {
            $scope.tmdb.seasons(tv.id, tv.season).then(function(result){
              var nextAiringEpisodes = getNextAiringEpisodes(result.data.episodes);
              if(nextAiringEpisodes.length>0) {
                $scope.nextAiringEpisode = nextAiringEpisodes[0];
              }
            });
          });
        }
      });
    };

    function onTvShowRetrieved(show) {
      $scope.show = show;
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

    $scope.changeSeason = function (season) {
      $scope.xbmc.getEpisodes($scope.tvshowid, season.season, onEpisodesRetrieved);
    };


    $scope.queueAll = function () {
      $scope.xbmc.queue({episodeid : $scope.episodes[0].episodeid});
      $scope.queue = $scope.episodes.slice(1);
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
  }
]);