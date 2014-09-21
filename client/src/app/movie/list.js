angular.module('app')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('movies', {
    url: '/movies',
    views: {
      header: {templateUrl: 'layout/headers/basic.tpl.html'},
      body: {templateUrl: 'movie/list.tpl.html', controller: 'MovieListCtrl'}
    }
  })
}])
.controller('MovieListCtrl', ['$scope', 'storage',
  function MovieListCtrl($scope, storage) {
    $scope.loading = true;
    $scope.updating = true;
    $scope.movies = [];
    function updateRandomMovie () {
      if($scope.movies.length) {
        var randomIndex = Math.floor(Math.random()*$scope.movies.length);
        $scope.randomMovie = $scope.movies[randomIndex];
      }
    };

    function onMoviesFromCache (movies) {
      if(movies) {
        $scope.loading = false;
        $scope.movies = movies;
        updateRandomMovie();
      }
    };

    function onMoviesFromSource (movies) {
      movies = movies || [];
      $scope.loading = false;
      $scope.updating = false;
      storage.setItem('VideoLibrary.Movies', movies);
      if(!angular.equals(movies, $scope.movies)) {
        updateRandomMovie();
      }
      $scope.movies = movies;
    };

    var onLoad = function () {
      storage.getItem('VideoLibrary.Movies', onMoviesFromCache);
      $scope.xbmc.getMovies(onMoviesFromSource);
    };
    if ($scope.xbmc.isConnected()) {
      onLoad();
    } else {
      $scope.xbmc.register('Websocket.OnConnected', { fn : onLoad, scope : this});
    }

    $scope.getRandomIndex = function () {
      return randomIndex;
    };
  }
]);