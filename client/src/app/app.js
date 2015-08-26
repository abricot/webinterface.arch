"use strict";
RAL.FileManifest.reset();

angular.module('app', [
  'ngAnimate',
  'ngTouch',
  'ui.state',
  'ui.bootstrap',
  'directives.image',
  'directives.flipper',
  'directives.hold',
  'directives.keybinding',
  'directives.rating',
  'directives.seekbar',
  'directives.streamdetails',
  'directives.spinner',
  'directives.onlastrepeat',
  'directives.tmdbFanarts',
  'directives.traktComments',
  'directives.traktStats',
  'filters.xbmc',
  'filters.tmdb',
  'filters.fallback',
  'services.xbmc',
  'services.tmdb',
  'services.trakt',
  'services.helper',
  'services.storage',
  'templates.abricot',
  'templates.app',
  'lrInfiniteScroll'
  ]);

// this is where our app definition is
angular.module('app')
.config(['$stateProvider', '$urlRouterProvider' ,
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/movies/recents");
  }
])
.controller('AppCtrl', ['$scope', '$rootScope', '$state', '$location', '$filter',
  '$interpolate', 'helper', 'xbmc', 'storage', 'tmdb', 'trakt',
  function($scope, $rootScope, $state, $location, $filter, $interpolate, helper, xbmc, storage, tmdb, trakt) {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-66170707-1', 'auto');
    ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
    ga('require', 'displayfeatures');

    $scope.theme = 'yang';
    storage.getItem('theme', function(theme) {
      $scope.theme = theme;
    });
    $scope.$state = $state;
    $scope.connected = false;
    $scope.initialized = true;
    $scope.isMaximized = false;
    $scope.application = {};
    $scope.player = {
      id: -1,
      active: false,
      audiostreams: [],
      current: {},
      intervalId: -1,
      item: {},
      seek: {},
      speed: 0,
      subtitles: [],
      type: ''
    };
    $scope.playlist = -1;
    $scope.library = {
      item: {},
      criteria: ''
    };

    $scope.isExternalAddonAvailable = false;

    $scope.hosts = [];
    $scope.host = null;
    $scope.webserverURL = 'about:blank';
    $scope.xbmc = xbmc;
    $scope.tmdb = tmdb;
    $scope.trakt = trakt;
    $scope.helper = helper;
    $scope.helper.setProviders({xbmc : $scope.xbmc, tmdb : $scope.tmdb});

    $scope.studioFn = $interpolate('https://cdn.rawgit.com/ccMatrix/StudioLogos/master/161x109_mono_png/{{studio}}.png');
    $scope.languageFn = $interpolate('https://cdn.rawgit.com/BigNoid/Aeon-Nox/master/media/flags/subtitles/flags/{{language}}.png')
    $scope.back = function() {
      $scope.go($scope.previousHash);
    };

    $scope.go = function(path) {
      if ($scope.isMaximized) {
        $scope.isMaximized = !$scope.isMaximized;
      }
      $location.path(path);
    };

    $scope.hasFooter = function() {
      return $scope.$state.current.views && $scope.$state.current.views.footer;
    };

    $scope.initialize = function(host) {
      if($scope.xbmc.isConnected()) {
        $scope.xbmc.disconnect();
      }
      $scope.xbmc.connect(host.ip, host.port);
      $scope.initialized = true;
      var hash = window.location.hash;
      var path = hash.replace('#', '');
      $scope.go(path === '' ? '/' : path);
    };

    $scope.isConnected = function() {
      return xbmc.isConnected()
    };

    $scope.isPlaying = function (id) {
      return  $scope.player && $scope.player.item  && $scope.player.item.id === id;
    };

    $scope.toggleDrawer = function() {
      $scope.isMaximized = !$scope.isMaximized;
    };

    $scope.toggleTheme = function() {
      $scope.theme = $scope.theme === 'yin' ? 'yang' : 'yin';
      storage.setItem('theme', $scope.theme);
    };

    $scope.hideDrawer = function() {
      $scope.isMaximized = false;
    };

    $scope.showDrawer = function() {
      $scope.isMaximized = true;
    };

    function onApplicationPropertiesRetrieved(properties) {
      $scope.application = properties;
    }

    function onPlayerPropertiesRetrieved(properties) {
      if (properties) {
        var timeFilter = $filter('time');
        $scope.player.audiostreams = properties.audiostreams;
        $scope.player.current = {
          audiostream: properties.currentaudiostream,
          subtitle: properties.currentsubtitle
        };
        $scope.player.seek = {
          time: timeFilter(properties.time),
          totaltime: timeFilter(properties.totaltime),
          percentage: properties.percentage
        };
        $scope.player.speed = properties.speed;
        $scope.player.subtitles = properties.subtitles;
        $scope.player.type = properties.type;

        $scope.playlist = properties.playlistid;
        xbmc.setActivePlaylist(properties.playlistid);
        if (properties.speed === 1) {

          window.clearInterval($scope.player.intervalId);
          $scope.player.intervalId = window.setInterval(updateSeek, 1000);
        }
      }
    };

    function onPlayerItemRetrieved(item) {
      $scope.player.item = item;
      if($scope.trakt.isAuthenticated() && $scope.trakt.autoScrobble()) {
        if(item.showtitle && item.season && item.episode) {
          $scope.player.item.type = 'episode';
          var traktSlug = item.showtitle.replace(/ /gi, '-').replace(/\./gi, '').toLowerCase()
          $scope.trakt.episodes.summary(traktSlug.toLowerCase(), item.season, item.episode).then(function(result){
            $scope.player.item.trakt = result.data;
            $scope.trakt.scrobble.start($scope.player.item.type, $scope.player.item.trakt, $scope.player.seek.percentage || 0);
          });
        } else if(item.imdbnumber) {
          $scope.trakt.movies.summary($scope.player.item.imdbnumber).then(function(result){
            $scope.player.item.trakt = result.data;
            $scope.trakt.scrobble.start($scope.player.item.type, $scope.player.item.trakt, $scope.player.seek.percentage || 0);
          });
        }
      }
      xbmc.getPlayerProperties(onPlayerPropertiesRetrieved);
    };

    function onPlayersRetrieved(players) {
      if (players.length > 0) {
        var player = players[0];
        $scope.player.id = player.playerid;
        $scope.player.active = true;
        xbmc.setActivePlayer($scope.player.id);
        xbmc.getPlayerItem(onPlayerItemRetrieved);
      }
    };

    function onVolumeChanged(obj) {
      $scope.application.volume = obj.params.data.volume;
      $scope.application.muted = obj.params.data.muted;
    };

    var updateSeek = function() {
      $scope.$apply(function() {
        $scope.player.seek.time++;
        $scope.player.seek.percentage = $scope.player.seek.time / $scope.player.seek.totaltime * 100;
        var now = Date.now();
        if (now - $scope.player.seek.lastUpdate > 5000) {
          xbmc.getPlayerProperties(onPlayerPropertiesRetrieved);
        } else {
          $scope.player.seek.lastUpdate = now;
        }
      });
    };

    var onPlayerPause = function() {
      $scope.player.speed = 0;
      window.clearInterval($scope.player.intervalId);
      if($scope.trakt.isAuthenticated() &&  $scope.trakt.autoScrobble() && $scope.player.item.trakt) {
        $scope.trakt.scrobble.pause($scope.player.item.type, $scope.player.item.trakt, $scope.player.seek.percentage);
      }
    };

    var onPlayerPlay = function(obj) {
      $scope.$apply(function() {
        var player = obj.params.data.player;
        $scope.player.id = player.playerid;
        $scope.player.active = true;
        xbmc.setActivePlayer(player.playerid);
        xbmc.getPlayerItem(onPlayerItemRetrieved);
      });
    };

    var onPlayerStop = function(obj) {
      window.clearInterval($scope.player.intervalId);
      $scope.player.seek.time = $scope.player.seek.totaltime;
      $scope.player.seek.percentage = 100;
      $scope.player.seek.lastUpdate = Date.now();
      $scope.player.active = false;
      if($scope.trakt.isAuthenticated() &&  $scope.trakt.autoScrobble() && $scope.player.item.trakt) {
        $scope.trakt.scrobble.stop($scope.player.item.type, $scope.player.item.trakt, $scope.player.seek.percentage);
      }
    };

    var onPlayerSeek = function(obj) {
      var data = obj.params.data;
      var time = data.player.time;
      var timeFilter = $filter('time');
      var seek = $scope.player.seek;
      seek.time = timeFilter(time);
      seek.percentage = seek.time / seek.totaltime * 100;
      if($scope.trakt.isAuthenticated() &&  $scope.trakt.autoScrobble() && $scope.player.item.trakt) {
        $scope.trakt.scrobble.start($scope.player.item.type, $scope.player.item.trakt, $scope.player.seek.percentage);
      }
    };

    var onPlaylistClear = function() {
      $scope.playlist = -1;
      xbmc.setActivePlaylist(-1);
    };

    var onExternalAddonRetrieved = function (result) {
      if(result && typeof result !== 'undefined' && result.addon) {
        $scope.isExternalAddonAvailable = result.addon.enabled;
      }
    };

    xbmc.register('Player.OnPause', {
      fn: onPlayerPause,
      scope: this
    });
    xbmc.register('Player.OnPlay', {
      fn: onPlayerPlay,
      scope: this
    });
    xbmc.register('Player.OnStop', {
      fn: onPlayerStop,
      scope: this
    });
    xbmc.register('Player.OnSeek', {
      fn: onPlayerSeek,
      scope: this
    });
    xbmc.register('Playlist.OnClear', {
      fn: onPlaylistClear,
      scope: this
    });
    xbmc.register('Application.OnVolumeChanged', {
      fn: onVolumeChanged,
      scope : this
    });

    var onLoad = function() {
      $scope.$apply(function() {
        $scope.connected = true;
      });
      xbmc.getApplicationProperties(onApplicationPropertiesRetrieved);
      xbmc.getActivePlayers(onPlayersRetrieved);
      xbmc.getAddonDetails($scope.host.videoAddon, onExternalAddonRetrieved);
    }
    var onDisconnect = function() {
      $scope.connected = false;
      $scope.initialized = true;
    };

    if (xbmc.isConnected()) {
      onLoad();
    } else {
      xbmc.register('Websocket.OnConnected', {
        fn: onLoad,
        scope: this
      });
      xbmc.register('Websocket.OnDisconnected', {
        fn: onDisconnect,
        scope: this
      });

      //New version of the app migration was done. Default behavior
      storage.getItem('hosts').then(function(value) {
        var filterDefault = function(el) {
          return el.default;
        };
        if (value !== null) {
          $scope.hosts = value;
        } else {
           $scope.hosts = [{
            default: true,
            displayName: 'localhost',
            httpPort: window.location.port === '' ? '80': window.location.port,
            ip: window.location.hostname,
            port: '9090',
            videoAddon : 'plugin.video.youtube',
            username : '',
            password : ''
          }];
        }
        var defaultHost = $scope.hosts.filter(filterDefault)[0];
        $scope.initialize(defaultHost);
      });

    }

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      ga('send', 'pageview', $location.path());
    });

    $scope.$watch('hosts', function(newVal, oldVal) {
      var filterDefault = function(el) {
        return el.default;
      }
      var filtered = $scope.hosts.filter(filterDefault);
      $scope.host = filtered[0];
    });
  }
]);