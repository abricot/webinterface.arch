angular.module('app')
.controller('PopularShowsCtrl', ['$scope', '$filter',
  function PopularShowsCtrl($scope, $filter) {
    $scope.loading = true;
    $scope.fetching = false;
    $scope.tvshows = [];
    $scope.pages = 1;
    $scope.total = Infinity;
    var now = new Date();
    var firstAirDate = (now.getFullYear()-5)+'-01-01';
    var cleanUpResults = function(results) {
      return results.filter(function(show){
        return show.rating > 0;
      });
    };

    function onTvShowsFromSource(response) {
      $scope.total = response.data.totalPages;
      $scope.tvshows = $scope.tvshows.concat(cleanUpResults(response.data.results));
      $scope.fetching = false;
      $scope.loading = false;
    };

    $scope.tmdb.popularTvshows(firstAirDate, 5, $scope.pages).then(onTvShowsFromSource);

    $scope.hasControls = function () {
      return false;
    };

    $scope.getEpisodesPath = function(show) {
      return '#/tvshows/tmdb/'+show.id;
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

    $scope.loadMore = function () {
      if( $scope.pages < $scope.total) {
        $scope.fetching = true;
        $scope.tmdb.popularTvshows(firstAirDate, 5, ++$scope.pages).then(onTvShowsFromSource);
      }
    };

  }]
);