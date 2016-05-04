angular.module('app')
.controller('ShowsCalendarCtrl', ['$scope', '$filter', '$interpolate', '$anchorScroll', '$http',
  function ShowsCalendarCtrl($scope, $filter, $interpolate, $anchorScroll, $http) {
    var autoscroll = true;
    $scope.fetching = false;
    $scope.tvshows = [];
    $scope.refDate = moment();
    $scope.tvshows = [];
    $scope.shows = {};
    var hasAds = false;

    function getDates(date, ref) {
      date.subtract(date.day(), 'd');
      var dates = [];
      var days = ref.diff(date, 'days');
      for(var i=0; i< days; i++){
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
      $scope.tvshows = tvshows;
      $scope.shows = $scope.getShows();
      $scope.dates = dates;
      $scope.fetching = false;
    };

    function load(date, ref) {
      hasAds = false;
      dates = getDates(date, ref);
      var days = dates[dates.length-1].diff(dates[0], 'days');
      $scope.trakt.calendar.myShows(dates[0].toDate(), days).then(onTvShowsFromSource);
    };

    if ($scope.trakt.isAuthenticated()) {
      var iterator = moment().startOf('month');
      load(iterator, moment().startOf('month').add(1, 'month'));
    } else {
      $scope.trakt.connect().then(function(){
        var iterator = moment().startOf('month');
        load(iterator, moment().startOf('month').add(1, 'month'));
      }, function() {
        $scope.go('/settings');
      });
    }

    $scope.getPoster = function (show) {
      return show.episode.images.screenshot.thumb || show.show.images.fanart.thumb;
    };

    $scope.getBanner = function (show) {
      return show.images.banner.full || show.images.thumb.full;
    };

    $scope.getRandomImage = function () {
      return Math.floor(Math.random()*100)%11 + 1;
    }

    $scope.getShows = function () {
      var shows = {};
      $scope.tvshows.forEach(function(tvshow){
        var showIds = tvshow.show.ids;
        if(!shows.hasOwnProperty(showIds.trakt)){
          shows[showIds.trakt] = angular.copy(tvshow.show);
        }
        shows[showIds.trakt].hit = shows[showIds.trakt].hit ? shows[showIds.trakt].hit+1 : 1;
      });
      return shows;
    };

    $scope.highlight = function (show) {
      $scope.tvshows.forEach(function(tvshow){
        if(tvshow.show.ids.trakt !== show.ids.trakt) {
          tvshow.fade = true;
        } else {
          tvshow.fade = false;
        }
      });
    };

    $scope.showsCount = function () {
      return Object.keys($scope.shows).length;
    }

    $scope.getEpisodesFor = function(date, criteria) {
      criteria = criteria || 'day';
      return $scope.tvshows.filter(function(show){
        var airDate = moment(show.first_aired);
        return date.isSame(airDate, criteria);
      });
    };

    $scope.isFuture = function(date){
      return date.month()> $scope.refDate.month();
    };

    $scope.isPast = function(date){
      return date.month()< $scope.refDate.month();
    };

    $scope.isToday = function(date){
      var now = moment();
      return date.isSame(now, 'day');
    };

    $scope.play = function(show){
      $scope.helper.foreign.shows.play($scope.host, show.show, show.episode);
    };

    $scope.previousMonth = function () {
      if(!$scope.fetching) {
        $scope.fetching = true;
        document.querySelector('.cal-grid').scrollTop = 0;
        var startOfMonth = $scope.refDate.startOf('month');
        var date = moment(startOfMonth).subtract(1, 'd').startOf('month');
        $scope.refDate = moment(date);
        load(date, startOfMonth.subtract(1,'d'));
      }
    };

    $scope.nextMonth = function() {
      if(!$scope.fetching) {
        $scope.fetching = true;
        document.querySelector('.cal-grid').scrollTop = 0;
        var startOfMonth = $scope.refDate.startOf('month').add(1, 'month');
        $scope.refDate = moment(startOfMonth);
        var date = moment(startOfMonth);
        load(date, startOfMonth.add(1, 'month'));
      }
    };

    $scope.$on('onRepeatLast', function(scope, element, attrs){
      if($scope.tvshows.length) {
        var ads =  document.querySelectorAll('.cal-grid .support');
        var num = Math.round(Math.random()*ads.length);
        ads[Math.min(num, ads.length-1)].style.display = 'block';
      }
    }.bind(this));
  }
]);
