angular.module('app')
.controller('ShowsCalendarCtrl', ['$scope', '$filter', '$interpolate', '$anchorScroll',
  function ShowsCalendarCtrl($scope, $filter, $interpolate, $anchorScroll) {
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
      $scope.trakt.register('Trakt.OnConnected', {
        fn: onLoad,
        scope: this
      });
    }

    $scope.getPoster = function (show) {
      return show.episode.images.screenshot.thumb || show.show.images.fanart.thumb;
    };

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

    $scope.play = function(episode){
      if($scope.host.videoAddon.toLowerCase().indexOf('youtube') > -1) {
        $scope.tmdb.tv.videos(
          episode.ids.tvdb,
          episode.season,
          episode.number).then(function(result){
            var videos = result.data.results;
            var pluginURL = 'plugin://'+$scope.host.videoAddon+'/?action=play_video&videoid='+videos[0].key;
            $scope.xbmc.open({file: pluginURL});
        });
      } else {
        var path = '/show/'+episode.ids.tvdb+'/season/'+episode.season+'/episode/'+episode.number+'/play';
        var url = playFn({
          ip : $scope.host.ip,
          port : $scope.host.httpPort,
          path : 'plugin://plugin.video.pulsar' + path,
          uid : Date.now()
        })
        $http.get(url);
      }
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
