angular.module('app')
.controller('ShowsCalendarCtrl', ['$scope', '$filter', '$interpolate', '$anchorScroll', '$http',
  function ShowsCalendarCtrl($scope, $filter, $interpolate, $anchorScroll, $http) {
    var playFn = $interpolate('http://{{ip}}:{{port}}/jsonrpc?request={ "jsonrpc": "2.0", "method": "Player.Open", "params" : {"item": { "file": "{{path}}" }}, "id": {{uid}}}');
    var autoscroll = true;
    $scope.loading = true;
    $scope.fetching = false;
    $scope.tvshows = [];
    var iterator = moment().startOf('month');
    iterator.subtract(iterator.day(), 'd');
    var dates = getDates(iterator, moment());
    $scope.dates = [];
    $scope.tvshows = [];

    function getDates(date, ref) {
      var dates = [];
      while(date.month() <= ref.month()) {
        dates.push(moment(date));
        date.add(1, 'd');
      }
      //Fill the rest of the week
      while(date.day() !== 0) {
        dates.push(moment(date));
        date.add(1, 'd');
      }
      return dates;
    };

    function onTvShowsFromSource(result) {
      var tvshows = result ? result.data : [];
      $scope.tvshows = $scope.tvshows.concat(tvshows);
      $scope.dates = $scope.dates.concat(dates);
      $scope.loading = false;
      $scope.fetching = false;
    };

    function onLoad() {
      var days = dates[dates.length-1].diff(dates[0], 'days');
      $scope.trakt.calendar.myShows(dates[0].toDate(), days).then(onTvShowsFromSource);
    };

    if ($scope.trakt.isAuthenticated()) {
      onLoad();
    } else {
      $scope.trakt.connect().then(function(){
        onLoad();
      }, function() {
        $scope.go('/settings');
      });
    }

    $scope.getPoster = function (show) {
      return show.episode.images.screenshot.thumb || show.show.images.fanart.thumb;
    };

    $scope.getRandomImage = function () {
      return Math.floor(Math.random()*100)%11 + 1;
    }

    $scope.getTVShowsFor = function(date) {
      return $scope.tvshows.filter(function(show){
        var airDate = moment(show.first_aired);
        return date.isSame(airDate, 'day');
      });
    };

    $scope.isFuture = function(date){
      return date.month()> moment().month();
    };

    $scope.isPast = function(date){
      return date.month()< moment().month();
    };

    $scope.isToday = function(date){
      var now = moment();
      return date.isSame(now, 'day');
    };

    $scope.loadMore = function () {
      if(!$scope.fetching) {
        $scope.fetching = true;
        var last = $scope.dates[$scope.dates.length-1];
        var date = moment(last).add(1, 'd');
        dates = getDates(date, moment(last).add(1, 'month'));
        onLoad();
      }
    };

    $scope.play = function(show){
      $scope.helper.foreign.shows.play($scope.host, show.show, show.episode);
    };

    $scope.$on('onRepeatLast', function(scope, element, attrs){
      if($scope.tvshows.length && autoscroll) {
        var today = document.querySelector('.today');
        var grid = document.querySelector('.cal-grid');
        grid.scrollTop = Math.max(today.offsetTop-1,0);
        autoscroll = false;
      }
    }.bind(this));
  }
]);
