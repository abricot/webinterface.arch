angular.module('app')
.controller('ShowsCalendarCtrl', ['$scope', '$filter', '$interpolate', '$anchorScroll',
  function ShowsCalendarCtrl($scope, $filter, $interpolate, $anchorScroll) {
    var playFn = $interpolate('http://{{ip}}:{{port}}/jsonrpc?request={ "jsonrpc": "2.0", "method": "Player.Open", "params" : {"item": { "file": "{{path}}" }}, "id": {{uid}}}');
    
    $scope.loading = true;
    $scope.tvshows = [];
    var iterator = moment().startOf('month');
    iterator.subtract(iterator.day(), 'd');
    var dates = [];
    $scope.dates = [];
    while(iterator.month() <= moment().month()) {
      dates.push(moment(iterator));
      iterator.add(1, 'd');
    }

    while(iterator.day() !== 0) {
      iterator.add(1, 'd');
      dates.push(moment(iterator));
    }

    function onTvShowsFromSource(result) {
      $scope.tvshows = result.data;
      $scope.dates = dates;
      $scope.loading = false;
      $anchorScroll('today');
    };

    function onLoad() {
      var days = dates[dates.length-1].diff(dates[0], 'days');
      $scope.trakt.calendar.myShows(dates[0].toDate(), days).then(onTvShowsFromSource);
    };

    if ($scope.trakt.isAuthenticated()) {
      onLoad();
    } else {
      $scope.go('/settings');
    }

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

    $scope.getPoster = function (show) {
      return show.episode.images.screenshot.thumb || show.show.images.fanart.thumb;
    };

    $scope.getTVShowsFor = function(date) {
      return $scope.tvshows.filter(function(show){
        var airDate = moment(show.first_aired);
        return date.isSame(airDate, 'day');
      });
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
  }
]);
