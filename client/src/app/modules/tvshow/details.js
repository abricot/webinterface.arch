var BaseTVShowDetailsCtrl = function ($scope, $stateParams) {
  $scope.loading = true;
  $scope.tvshowid = parseInt($stateParams.tvshowid);

  $scope.show = null;
  $scope.seasons = [];
  $scope.selectedSeason = '';

  $scope.episodes = [];
  $scope.nextAiringEpisode = null;

  $scope.seasonName = function (season) {
    return 'Season '+season.season;
  };

  $scope.setNextAiringEpisode = function(episodes) {
    episodes = episodes || [];
    var now = Date.now();
    var futureEpisode = episodes.filter(function(episode){
      var airDate = new Date(episode.firstaired);
      return airDate.getTime() > now;
    });
    if(futureEpisode.length>0) {
      $scope.nextAiringEpisode  = futureEpisode[0];
    }
  };
};

angular.module('app')
.controller('XBMCShowDetailsCtrl', ['$scope', '$injector', '$stateParams', '$filter',
  function XBMCShowDetailsCtrl($scope, $injector, $stateParams, $filter) {
    $injector.invoke(BaseTVShowDetailsCtrl, this, {$scope: $scope, $stateParams: $stateParams});

    $scope.updating = false;
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

    function isCurrentlyPlaying(episodeid) {
      return $scope.player.active && episodeid === $scope.library.item.episodeid;
    };

    $scope.isUsingExternalAddon = function () {
      return false;
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
        var shows = result.data.tvShows;
        if(shows.length === 1) {
          $scope.tmdb.tv.episodes(shows[0].id).then(function(result){
            var episodes = result.data.episodes;
            $scope.setNextAiringEpisode(episodes);
          })
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

    $scope.$watch('playlist', function () {
      onPlaylistAdd();
    }, true);

    $scope.changeSeason = function (season) {
      $scope.xbmc.getEpisodes($scope.tvshowid, season.season, onEpisodesRetrieved);
    };

    $scope.getImage = function (path) {
      var url = $filter('asset')(path, $scope.host);
      return $filter('fallback')(url, 'img/icons/awe-512.png');
    };

    $scope.hasControls = function () {
      return true;
    };

    $scope.play = function(episode){
      $scope.xbmc.open({'episodeid': episode.episodeid})
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
]).controller('TMDBShowDetailsCtrl', ['$scope', '$injector', '$stateParams', '$location', '$filter', '$http', '$interpolate',
  function TMDBShowDetailsCtrl($scope, $injector, $stateParams, $location, $filter, $http, $interpolate) {
    $injector.invoke(BaseTVShowDetailsCtrl, this, {$scope: $scope, $stateParams: $stateParams});
    $scope.tvdbid = null;
    var playFn = $interpolate('http://{{ip}}:{{port}}/jsonrpc?request={ "jsonrpc": "2.0", "method": "Player.Open", "params" : {"item": { "file": "{{path}}" }}, "id": {{uid}}}');
    function onEpisodesRetrieved(result) {
      $scope.loading = false;
      var now = new Date();
      var episodes = result.data.episodes;
      $scope.setNextAiringEpisode(episodes);
      $scope.episodes = episodes.filter(function(episode){
        var airDate = new Date(episode.firstaired);
        return airDate.getTime() < now;
      }).reverse();

    };

    function onTvShowRetrieved(result) {
      $scope.show = result.data;

      if($scope.show.seasons.length > 0) {
        $scope.seasons = $scope.show.seasons;
        $scope.season = $scope.show.seasons[$scope.show.seasons.length-1];
        $scope.tmdb.tv.seasons($scope.tvshowid, $scope.season.season).then(onEpisodesRetrieved);
      } else {
        $scope.loading = false;
      }
    };

    function onExternalIDsRetrieved (result) {
      $scope.tvdbid = result.data.tvdbid;
    };

    $scope.tmdb.tv.details($scope.tvshowid).then(onTvShowRetrieved);
    $scope.tmdb.tv.externalIDs($scope.tvshowid).then(onExternalIDsRetrieved);

    $scope.changeSeason = function (season) {
      $scope.tmdb.tv.seasons($scope.tvshowid, season.season).then(onEpisodesRetrieved);
    };

    $scope.getImage = function (path, size) {
      var url = $filter('tmdbImage')(path, size || 'original');
      return $filter('fallback')(url, 'img/icons/awe-512.png');
    };

    $scope.isUsingExternalAddon = function () {
      return true;
    };

    $scope.play = function(episode){
      if($scope.host.videoAddon.toLowerCase().indexOf('youtube') > -1) {  
        $scope.tmdb.tv.videos(
          $scope.tvshowid, 
          episode.season, 
          episode.episode).then(function(result){
            var videos = result.data.results;
            var pluginURL = 'plugin://'+$scope.host.videoAddon+'/?action=play_video&videoid='+videos[0].key;
            $scope.xbmc.open({file: pluginURL});
        });
      } else {
        var path = '/show/'+$scope.tvdbid+'/season/'+episode.season+'/episode/'+episode.episode+'/play';
        var url = playFn({
          ip : $scope.host.ip,
          port : $scope.host.httpPort,
          path : 'plugin://plugin.video.pulsar' + path,
          uid : Date.now()
        })
        $http.get(url);
      }
    };
  }
]);