angular.module('app')
.controller('PopularShowsCtrl', ['$scope', '$filter',
  function PopularShowsCtrl($scope, $filter) {
    $scope.loading = true;
    $scope.tvshows = [];

    var now = new Date();
    var firstAirDate = (now.getFullYear()-2)+'-01-01';
    var cleanUpResults = function(results) {
      return results.sort(function(show1, show2) {
        if(show1.vote_average < show2.vote_average) {
          return 1;
        } else if (show1.vote_average > show2.vote_average) {
          return -1;
        } else {
          return 0;
        }
      }).filter(function(show){
        return show.vote_average > 0;
      });
    };

    $scope.tmdb.popularTvshows(2, firstAirDate, 5).then(function(result){
      var  tvshows = [];
      if(!angular.isArray(result)) {
        result = [result];
      }
      result.forEach(function(response){
          tvshows = tvshows.concat(cleanUpResults(response.data.results));
      });
      $scope.tvshows = tvshows;
    });

    $scope.isLocal = function () {
      return false;
    };

    $scope.getEpisodesPath = function(show) {
      return '';
    };

    $scope.getExtra = function (show) {
      return 'First aired ' + show.first_air_date;
    };

    $scope.getName = function (show) {
      return show.name;
    }

    $scope.getPoster = function (show) {
      var url = $filter('image')(show.poster_path);
      return $filter('fallback')(url, 'img/icons/awe-512.png');
    };

    $scope.getRating = function(show){
      return show.vote_average;
    };
    
    $scope.getStudio = function(show) {
      return 'img/icons/default-studio.png';
    };

  }]
);