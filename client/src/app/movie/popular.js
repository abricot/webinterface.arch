angular.module('app')
.controller('PopularMoviesCtrl', ['$scope', '$filter',
  function PopularMoviesCtrl($scope, $filter) {
    $scope.loading = true;
    $scope.movies = [];

    var now = new Date();
    var firstReleaseDate = (now.getFullYear()-2)+'-01-01';
    var cleanUpResults = function(results) {
      return results.filter(function(movie){
        var now = new Date();
        return movie.year <= now.getFullYear();
      });
    };

    $scope.tmdb.popularMovies(2, firstReleaseDate, 5).then(function(results){
      var  movies = [];
      if(!angular.isArray(results)) {
        results = [results];
      }
      results.forEach(function(response){
          movies = movies.concat(cleanUpResults(response.data.results));
      });
      var sortFn = function(show1, show2) {
        if(show1.rating < show2.rating) {
          return 1;
        } else if (show1.rating > show2.rating) {
          return -1;
        } else {
          return 0;
        }
      };
      $scope.movies = movies.sort(sortFn);
      $scope.loading = false;
    });

    $scope.hasControls = function () {
      return false;
    };

    $scope.getMoviesPath = function(show) {
      return '#/tmdbshow/'+show.id;
    };

    $scope.getPoster = function (show) {
      var url = $filter('tmdbImage')(show.poster, 'w500');
      return $filter('fallback')(url, 'img/icons/awe-512.png');
    };

    $scope.getStudio = function(show) {
      return 'img/icons/default-studio.png';
    };

  }]
);