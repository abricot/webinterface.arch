angular.module('app')
.controller('PopularMoviesCtrl', ['$scope', '$filter',
  function PopularMoviesCtrl($scope, $filter) {
    $scope.loading = true;
    $scope.fetching = false;

    $scope.pages = 1;
    $scope.total = Infinity;
    $scope.movies = [];

    var now = new Date();
    var firstReleaseDate = (now.getFullYear()-2)+'-01-01';
    var cleanUpResults = function(results) {
      return results;
    };

    function onMoviesFromSource(response) {
      $scope.total = response.data.totalPages;
      $scope.movies = $scope.movies.concat(cleanUpResults(response.data.results));
      $scope.fetching = false;
      $scope.loading = false;
    };

    $scope.tmdb.movies.populars(firstReleaseDate, 5, $scope.pages).then(onMoviesFromSource);

    $scope.hasControls = function () {
      return false;
    };

    $scope.getMoviesPath = function(movie) {
      return '#/movies/tmdb/'+movie.id;
    };

    $scope.getPoster = function (show) {
      var url = $filter('tmdbImage')(show.poster, 'w500');
      return $filter('fallback')(url, 'img/icons/awe-512.png');
    };

    $scope.loadMore = function () {
      if( $scope.pages < $scope.total) {
        $scope.fetching = true;
        $scope.tmdb.movies.populars(firstReleaseDate, 5, ++$scope.pages).then(onMoviesFromSource);
      }
    };
  }]
);