angular.module('app')
.controller('MoviesCtrl', ['$scope', '$state', '$filter',
  function MoviesCtrl($scope, $state, $filter) {
    $scope.loading = true;
    $scope.fetching = false;

    $scope.requestItemsBy = 50;
    $scope.total = Infinity;
    $scope.movies = [];
    var method = $state.current.data.methodName;

    function onMoviesFromSource(result) {
      var movies = result ? result.movies : [];
      $scope.total = result ? result.limits.total : Infinity;
      $scope.movies = $scope.movies.concat(movies);
      $scope.loading = false;
      $scope.fetching = false
    };

    function onLoad() {
      var limits =  {
        'start' : 0,
        'end' : $scope.requestItemsBy
      }
      $scope.xbmc[method](onMoviesFromSource, limits);
    };

    $scope.xbmc.register('VideoLibrary.OnScanFinished', {
      fn: onLoad,
      scope: this
    });

    if ($scope.xbmc.isConnected()) {
      onLoad();
    } else {
      $scope.xbmc.register('Websocket.OnConnected', { fn : onLoad, scope : this});
    }

    $scope.getMoviesPath = function(movie) {
      return '#/movie/'+movie.movieid;
    };

    $scope.getPoster = function (movie) {
      var url = $filter('asset')(movie.thumbnail, $scope.host);
      return $filter('fallback')(url, 'img/icons/awe-512.png');
    };

    $scope.hasControls = function() {
      return true;
    };

    $scope.loadMore = function () {
      if($scope.movies.length < $scope.total) {
        $scope.fetching = true;
        var limits =  {
          'start' : $scope.movies.length,
          'end' : Math.min($scope.movies.length+$scope.requestItemsBy, $scope.total)
        };
        $scope.xbmc[method](onMoviesFromSource, limits);
      }
    };

    $scope.remove = function (index, movie) {
      var onMovieRemoved = function(){
        $scope.movies.splice(index, 1);
      };
      $scope.xbmc.removeEpisode(movie.movieid, onMovieRemoved);
    };


    $scope.toggleWatched = function (movie) {
      var newValue =  movie.playcount ? 0 : 1;
      $scope.xbmc.setMovieDetails({
        movieid : movie.movieid,
        playcount  :newValue
      },  function(result) {
        if(result === 'OK') {
          movie.playcount = newValue;
        }
      })
    };
  }
]);