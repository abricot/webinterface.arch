angular.module('app')
.controller('PopularShowsCtrl', ['$scope', '$filter',
  function PopularShowsCtrl($scope, $filter) {
    $scope.loading = true;
    $scope.tvshows = [];

    var now = new Date();
    var firstAirDate = (now.getFullYear()-2)+'-01-01';
    var cleanUpResults = function(results) {
      return results.filter(function(show){
        return show.rating > 0;
      });
    };

    $scope.tmdb.popularTvshows(2, firstAirDate, 5).then(function(results){
      var  tvshows = [];
      if(!angular.isArray(results)) {
        results = [results];
      }
      results.forEach(function(response){
          tvshows = tvshows.concat(cleanUpResults(response.data.results));
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
      $scope.tvshows = tvshows.sort(sortFn);
    });

    $scope.hasControls = function () {
      return false;
    };

    $scope.getEpisodesPath = function(show) {
      return '#/tmdbshow/'+show.id;
    };

    $scope.getExtra = function (show) {
      return 'First aired ' + show.firstaired;
    };

    $scope.getPoster = function (show) {
      var url = $filter('tmdbImage')(show.poster, 'w500');
      return $filter('fallback')(url, 'img/icons/awe-512.png');
    };
;

    $scope.getStudio = function(show) {
      return 'img/icons/default-studio.png';
    };

  }]
);