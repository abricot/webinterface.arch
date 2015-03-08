angular.module('app')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('movies', {
    url: '/movies',
    views: {
      header: {templateUrl: 'layout/headers/navigation.tpl.html', controller : 'HeaderNavController'},
      body: {templateUrl: 'movie/list.tpl.html', controller: 'MovieListCtrl'}
    }
  })
}])
.controller('MovieListCtrl', ['$scope', 'storage',
  function MovieListCtrl($scope, storage) {
    $scope.loading = true;
    $scope.scanning = false;
    $scope.fetching = false;

    $scope.requestItemsBy = 50;
    $scope.total = Infinity;
    $scope.movies = [];

    function onMoviesFromSource(result) {
      var movies = result ? result.movies : [];
      $scope.total = result ? result.limits.total : Infinity;
      if($scope.scanning) {
        if(!angular.equals($scope.movies, movies)) {
          $scope.movies = movies;
        }
      } else {
        $scope.movies = $scope.movies.concat(movies);
      }
      updateRandomMovie();
      $scope.loading = false;
      $scope.scanning = false;
      $scope.fetching = false
    };

    function onLoad() {
      var limits =  {
        'start' : 0,
        'end' : $scope.requestItemsBy
      }
      $scope.xbmc.getMovies(onMoviesFromSource, limits);
    };

    function updateRandomMovie () {
      if($scope.movies.length) {
        var randomIndex = Math.floor(Math.random()*$scope.movies.length);
        $scope.randomMovie = $scope.movies[randomIndex];
      }
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

    $scope.getRandomIndex = function () {
      return randomIndex;
    };

    $scope.loadMore = function () {
      if(!$scope.scanning && $scope.movies.length < $scope.total) {
        $scope.fetching = true;
        var limits =  {
          'start' : $scope.movies.length,
          'end' : Math.min($scope.movies.length+$scope.requestItemsBy, $scope.total)
        };
        $scope.xbmc.getMovies(onMoviesFromSource, limits);
      }
    };

    $scope.scan = function () {
      if(!$scope.fetching) {
        $scope.scanning = true;
        $scope.xbmc.scan('VideoLibrary');
      }
    }
  }
]);