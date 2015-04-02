angular.module('app')
.controller('PopularTVShowsCtrl', ['$scope',
  function PopularTVShowsCtrl($scope) {
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

    $scope.getImageURL = function (path) {
      var url = 'http://image.tmdb.org/t/p/original';
      if(typeof path  === 'undefined' || path === null) {
        return '';
      }
      return url + path;
    };

  }]
);