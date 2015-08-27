angular.module('app')
.controller('ShowsCalendarCtrl', ['$scope', '$filter', '$interpolate', '$anchorScroll', '$http',
  function ShowsCalendarCtrl($scope, $filter, $interpolate, $anchorScroll, $http) {
    var playFn = $interpolate('http://{{ip}}:{{port}}/jsonrpc?request={ "jsonrpc": "2.0", "method": "Player.Open", "params" : {"item": { "file": "{{path}}" }}, "id": {{uid}}}');
    var autoscroll = true;
    $scope.fetching = false;
    $scope.tvshows = [];
    $scope.refDate = moment();
    $scope.tvshows = [];
    $scope.shows = {};

    function getDates(date, ref) {
      console.log(date.format('YYYY-MM-DD'),ref.format('YYYY-MM-DD'));
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
      dates = getDates(date, ref);
      var days = dates[dates.length-1].diff(dates[0], 'days');
      $scope.trakt.calendar.myShows(dates[0].toDate(), days).then(onTvShowsFromSource);
    };

    if ($scope.trakt.isAuthenticated()) {
      var iterator = moment().startOf('month');
      iterator.subtract(iterator.day(), 'd');
      load(iterator, moment().startOf('month').add(1, 'month'));
    } else {
      $scope.trakt.connect().then(function(){
        var iterator = moment().startOf('month');
        iterator.subtract(iterator.day(), 'd');
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
      return date.month()> moment().month();
    };

    $scope.isPast = function(date){
      return date.month()< moment().month();
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
        var startOfMonth = $scope.refDate.startOf('month');
        var date = moment(startOfMonth).subtract(1, 'd').startOf('month');
        $scope.refDate = moment(date);
        date.subtract(date.day(), 'd');
        load(date, startOfMonth.subtract(1,'d'));
      }
    };

    $scope.nextMonth = function() {
      if(!$scope.fetching) {
        $scope.fetching = true;
        var startOfMonth = $scope.refDate.startOf('month').add(1, 'month');
        $scope.refDate = moment(startOfMonth);
        startOfMonth.subtract(startOfMonth.day(), 'd');
        load(startOfMonth, $scope.refDate);
      }
    };

    $scope.$on('onRepeatLast', function(scope, element, attrs){
      if($scope.tvshows.length && autoscroll) {
        var header =  document.querySelector('#page > header');
        var tabs = document.querySelector('.tvshows > .tabs');
        var today = document.querySelector('.today');
        var grid = document.querySelector('.cal-grid');
        if(today && grid) {
          var headerDim = header.getBoundingClientRect();
          var tabsDim = tabs.getBoundingClientRect();
          var todayDim = today.getBoundingClientRect();
          var scrollTo = todayDim.top - tabsDim.height - headerDim.height -1;
          grid.scrollTop = Math.max( scrollTo,0);
        }
        autoscroll = false;
      }
    }.bind(this));
  }
]);
