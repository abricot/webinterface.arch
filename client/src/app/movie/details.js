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
};

angular.module('app')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('moviedetails', {
    url: '/movie/:movieid',
    views: {
      header: {templateUrl: 'layout/headers/navigation.tpl.html', controller : 'HeaderNavController'},
      body: {
        templateUrl: 'movie/details.tpl.html',
        controller: 'MovieDetailsCtrl'
      }
    }
  }).state('TMDBMovie', {
      url: '/tmdbmovie/:movieid',
      views: {
        header: {templateUrl: 'layout/headers/navigation.tpl.html', controller : 'HeaderNavController'},
        body: {
          templateUrl: 'movie/details.tpl.html',
          controller: 'TMDBMovieDetailsCtrl'
        }
      }
    });;
}])
.controller('MovieDetailsCtrl', ['$scope', '$stateParams', '$injector',
  function MovieDetailsCtrl($scope, $stateParams, $injector) {
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
        var movies = result.data.movie_results;
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

    $scope.imdb = function (imdbnumber) {
      window.open('http://www.imdb.com/title/' + imdbnumber + '/', '_blank');
    };

    $scope.getActors = function () {
      return $scope.movie.cast.filter(function(actor) {
        return actor.role !== '' && typeof actor.thumbnail !== 'undefined';
      })
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

    $scope.getPosterURL = function(similar) {
      return 'https://image.tmdb.org/t/p/w185' + similar.poster_path;
    }

    $scope.$watch('player.item', function (newVal, oldVal) {
      $scope.isCurrentlyPlaying = isCurrentlyPlaying();
    });
  }
])
.controller('TMDBMovieDetailsCtrl', ['$scope', '$stateParams', '$injector',
  function TMDBMovieDetailsCtrl($scope, $stateParams, $injector) {
    $injector.invoke(BaseMovieDetailsCtrl, this, {$scope: $scope, $stateParams: $stateParams});

    $scope.tmdb.movie($scope.movieid).then(function(result) {
      $scope.movie = result.data;
      $scope.findSimilars($scope.movieid);
      $scope.loading = false;
    })
  }
]);