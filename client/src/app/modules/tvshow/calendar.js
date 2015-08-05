angular.module('app')
.controller('ShowsCalendarCtrl', ['$scope', '$filter',
  function ShowsCalendarCtrl($scope, $filter) {
    $scope.loading = true;

    var beginOfMonth = moment().startOf('month');
    var current = beginOfMonth.month();
    $scope.dates = [];

    while(current === beginOfMonth.month()) {
      $scope.dates.push(moment(beginOfMonth));
      beginOfMonth.add(1, 'd');
    }

    function onTvShowsFromSource(result) {
      $scope.tvshows = result.data;
      $scope.loading = false;
    };

    function onLoad() {
      $scope.trakt.calendar.myShows(moment().startOf('month').subtract(1, 'd').toDate(), 31).then(onTvShowsFromSource);
    };

    if ($scope.trakt.isAuthenticated()) {
      onLoad();
    } else {
      $scope.go('/settings');
    }

    $scope.isToday = function(date){
      var now = moment();
      return date.isSame(now, 'day');
    };

    $scope.getPoster = function (show) {
      return show.episode.images.screenshot.thumb || show.show.images.fanart.thumb;
    };

    $scope.getTVShowsFor = function(date) {
      return $scope.tvshows.filter(function(show){
        var airDate = moment(show.first_aired);
        return date.isSame(airDate, 'day');
      });
    };
  }
]);
