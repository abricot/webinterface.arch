var BaseMovieDetailsCtrl = function ($scope, $stateParams) {
  $scope.movieid = parseInt($stateParams.movieid);
  $scope.loading = true;
  $scope.isCurrentlyPlaying = false;

  $scope.seeMoreActors = false;
  $scope.similars = [];

  $scope.movie  = null;

  $scope.findSimilars = function (movieid) {
    $scope.tmdb.similarMovie(movieid, 1).then(function(result){
      $scope.similars = result.data.results.filter(function(similar) {
        return typeof similar.poster !== 'undefined' && similar.poster !== null;
      });
    })
  };

  $scope.getActors = function () {
    return $scope.movie.cast.filter(function(actor) {
      return actor.role !== '' && typeof actor.thumbnail !== 'undefined';
    })
  };
};

angular.module('app')
.controller('MovieDetailsCtrl', ['$scope', '$stateParams', '$injector', '$filter',
  function MovieDetailsCtrl($scope, $stateParams, $injector, $filter) {
    $injector.invoke(BaseMovieDetailsCtrl, this, {$scope: $scope, $stateParams: $stateParams});

    function isCurrentlyPlaying() {
      return $scope.player.active && $scope.player.item.id === $scope.movie.movieid;
    };

    function onMovieRetrieved (item) {
      item.type = 'movie';
      $scope.movie = item;
      $scope.isCurrentlyPlaying = isCurrentlyPlaying();
      $scope.loading = false;
      $scope.tmdb.find('imdb_id', item.imdbnumber).then(function(result){
        var movies = result.data.movies;
        if(movies.length === 1) {
          $scope.findSimilars(movies[0].id);
        }
      });
    };
    var onLoad = function () {
      $scope.xbmc.getMovieDetails($scope.movieid, onMovieRetrieved);
    };
    if ($scope.xbmc.isConnected()) {
      onLoad();
    } else {
      $scope.xbmc.register('Websocket.OnConnected', { fn : onLoad, scope : this});
    }

    $scope.getImage = function (path) {
      var url = $filter('asset')(path, $scope.host);
      return $filter('fallback')(url, 'img/icons/awe-512.png');
    };

    $scope.imdb = function (imdbnumber) {
      window.open('http://www.imdb.com/title/' + imdbnumber + '/', '_blank');
    };

    $scope.getAudio = function () {
      if($scope.movie.streamdetails.audio.length > 0) {
        return $scope.movie.streamdetails.audio.map(function(audio) {
          return audio.language;
        }).join(', ');
      } else {
        return '-';
      }
    };

    $scope.getVideoDefinition = function () {
      if($scope.movie.streamdetails.audio.length > 0) {
        var video = $scope.movie.streamdetails.video[0];
        return video.width + 'x' + video.height;
      } else {
        return '-';
      }
    };

    $scope.hasAdditionalInfo = function () {
      return true;
    };

    $scope.play = function(movie) {
      $scope.xbmc.open({'movieid': movie.movieid});
    };

    $scope.queue = function(movie) {
      $scope.xbmc.queue({'movieid': movie.movieid});
    };

    $scope.$watch('player.item', function (newVal, oldVal) {
      $scope.isCurrentlyPlaying = isCurrentlyPlaying();
    });
  }
])
.controller('TMDBMovieDetailsCtrl', ['$scope', '$stateParams', '$injector', '$filter', '$http', '$interpolate',
  function TMDBMovieDetailsCtrl($scope, $stateParams, $injector, $filter, $http, $interpolate) {
    $injector.invoke(BaseMovieDetailsCtrl, this, {$scope: $scope, $stateParams: $stateParams});
    var playFn = $interpolate('http://{{ip}}:{{port}}/jsonrpc?request={ "jsonrpc": "2.0", "method": "Player.Open", "params" : {"item": { "file": "{{path}}" }}, "id": {{uid}}}');
    
    $scope.tmdb.movie($scope.movieid).then(function(result) {
      $scope.movie = result.data;
      $scope.tmdb.movieCredits($scope.movieid).then(function(result){
        $scope.movie.cast = result.data.cast;
        var crew = result.data.crew;
        $scope.movie.director = crew.filter(function(member){
          return member.job.toLowerCase() === 'director';
        }).map(function(obj) {
          return obj.name;
        });
        $scope.movie.writer = crew.filter(function(member){
          return member.job.toLowerCase() === 'writer';
        }).map(function(obj) {
          return obj.name;
        });
        $scope.loading = false;
      });
    });
    $scope.findSimilars($scope.movieid);

    $scope.getImage = function (path, size) {
      var url = $filter('tmdbImage')(path, size || 'original');
      return $filter('fallback')(url, 'img/icons/awe-512.png');
    };

    $scope.hasAdditionalInfo = function () {
      return false;
    };

    $scope.play = function(movie) {
      var path = '/movie/'+$scope.movie.imdbnumber+'/play';
      var url = playFn({
        ip : $scope.host.ip,
        port : $scope.host.httpPort,
        path : 'plugin://plugin.video.pulsar' + path,
        uid : Date.now()
      })
      $http.get(url);
    };

    $scope.queue = function(movie) {
      xbmc.queue({'movieid': movie.movieid});
    };
  }
]);