"use strict";
RAL.FileManifest.reset();

angular.module('app', [
    'ui.state',
    'ui.bootstrap',
    'directives.image',
    'directives.keybinding',
    'directives.rating',
    'directives.seekbar',
    'directives.tap',
    'filters.xbmc',
    'services.xbmc',
    'services.storage',
    'templates.app'
]);

// this is where our app definition is
angular.module('app')
    .config(['$stateProvider', '$urlRouterProvider', 'storageProvider',
        function($stateProvider, $urlRouterProvider, storageProvider) {
            var xbmchost = storageProvider.getItem('xbmchost', function(value) {
                if (value === null) {
                    storageProvider.getItem('hosts', function(value) {
                        if (value === null) {
                            $urlRouterProvider.otherwise("/host/wizard");
                         } else {
                            $urlRouterProvider.otherwise("/");
                         }
                    });
                } else {
                    $urlRouterProvider.otherwise("/");
                }
            });
        }
    ])
    .controller('AppCtrl', ['$scope', '$rootScope', '$state', '$location', '$filter', 'xbmc', 'storage',
        function($scope, $rootScope, $state, $location, $filter, xbmc, storage) {
            $scope.theme = 'yin';
            storage.getItem('theme', function (theme) {$scope.theme=theme;});
            $scope.$state = $state;
            $scope.connected = false;
            $scope.initialized = false;
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

            $scope.hosts = [];
            $scope.host = null;
            $scope.xbmc = xbmc;

            $scope.back = function() {
                $scope.go($scope.previousHash);
            };

            $scope.go = function(path) {
                $location.path(path);
            };

            $scope.hasFooter = function() {
                return $scope.$state.current.views && $scope.$state.current.views.footer;
            };

            $scope.isConnected = function() {
                return xbmc.isConnected()
            };

            $scope.toggleDrawer = function() {
                var drawer = angular.element(document.querySelector('#drawer'));
                drawer.toggleClass('maximize');
            };

            $scope.toggleTheme = function() {
                $scope.theme = $scope.theme === 'yin' ? 'yang' : 'yin';
                storage.setItem('theme', $scope.theme);
            };

            $scope.hideDrawer = function() {
                var drawer = angular.element(document.querySelector('#drawer'));
                if(drawer.hasClass('maximize')) {
                    drawer.removeClass('maximize');
                }
            };

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
            };

            var onPlayerPlay = function(obj) {
                $scope.$apply(function(){
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
            };

            var onPlayerSeek = function(obj) {
                var data = obj.params.data;
                var time = data.player.time;
                var timeFilter = $filter('time');
                var seek = $scope.player.seek;
                seek.time = timeFilter(time);
                seek.percentage = seek.time / seek.totaltime * 100;
            };

            var onPlaylistClear = function() {
                $scope.playlist = -1;
                xbmc.setActivePlaylist(-1);
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


            var onLoad = function() {
                $scope.$apply(function() {
                    $scope.connected = true;
                });
                xbmc.getActivePlayers(onPlayersRetrieved);
            }
            var onDisconnect = function() {
                $scope.connected = false;
                $scope.initialized = true;
            };

            var initialize = function (host) {
                $scope.initialized = true;
                $scope.xbmc.connect(host.ip, host.port);
                var hash = window.location.hash;
                var path = hash.replace('#', '');
                $scope.go(path === '' ? '/' : path);
            }

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
                storage.getItem('xbmchost', function (value) {
                    if(value!==null) {
                        //Old version of the app
                        var defaultHost = value.host;
                        defaultHost.default = true;
                        storage.removeItem('xbmchost');
                        $scope.hosts = [defaultHost];
                        storage.setItem('hosts', $scope.hosts);
                        initialize(defaultHost);
                    } else {
                        //New version of the app migration was done. Default behavior
                        storage.getItem('hosts', function(value) {
                            if(value!==null) {
                                var filterDefault = function (el) {
                                    return el.default;
                                };
                                $scope.hosts = value;
                                var defaultHost = $scope.hosts.filter(filterDefault)[0];
                                initialize(defaultHost);
                            } else {
                                $scope.initialized = true;
                                $scope.go('/host/wizard');
                            }
                        });

                    }
                })
            }

            var main = document.querySelector('div[role="main"]');
            var gestureDetector = new GestureDetector(main);
            gestureDetector.startDetecting();

            var onSwipe = function(event) {
                var direction = event.detail.direction || '';
                var page = angular.element(document.querySelector('#page'));
                if (direction.toLowerCase() === 'left' && page.hasClass('minimize')) {
                    page.removeClass('minimize');
                } else if (direction.toLowerCase() === 'right' && !page.hasClass('minimize')) {
                    page.addClass('minimize');
                }
            };

            main.addEventListener('swipe', onSwipe.bind(this));

            $scope.previousState = null;
            $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                var hash = fromState.url;
                angular.forEach(fromParams, function(value, key){
                    hash = hash.replace(':'+key, value);
                });
                $scope.previousHash = hash;
            });
            $scope.$watch('hosts', function (newVal, oldVal) {
                var filterDefault =  function (el) {
                    return el.default;
                }
                var filtered = $scope.hosts.filter(filterDefault);
                $scope.host = filtered[0];
            });
        }
    ]);