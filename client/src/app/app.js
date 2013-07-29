"use strict";
angular.module('app', [
    'ui.state',
    'directives.rating',
    'directives.seekbar',
    'directives.tap',
    'filters.xbmc',
    'services.xbmc',
    'templates.app']);

// this is where our app definition is
angular.module('app')
    .config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            var xbmchost = localStorage.getItem('xbmchost');
            if (xbmchost === null) {
                $urlRouterProvider.otherwise("/settings");
            } else {
                $urlRouterProvider.otherwise("/");
            }

        }])
    .controller('AppCtrl', ['$scope', '$rootScope', '$state', '$location', '$filter', 'xbmc',
        function ($scope, $rootScope, $state, $location, $filter, xbmc) {
            $scope.$state = $state;
            var init = function () {
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
            };

            init();
            $scope.configuration = {host: {ip: '', port: '', displayName: ''}};
            $scope.xbmc = xbmc;

            $scope.go = function (path) {
                $location.path(path);
            };

            $scope.hasFooter = function () {
                return $scope.$state.current.views && $scope.$state.current.views.footer;
            }

            $scope.isConnected = function () {
                return xbmc.isConnected()
            }

            $scope.toggleDrawer = function () {
                var page = angular.element(document.querySelector('#page'));
                page.toggleClass('minimize');
            }

            $rootScope.$on("$stateChangeStart", function (event, next, current) {
                if ($scope.configuration.host.ip === '') {
                    $scope.go('/settings');
                }
            });

            var updateSeek = function () {
                $scope.$apply(function () {
                    $scope.player.seek.time++;
                    $scope.player.seek.percentage = $scope.player.seek.time / $scope.player.seek.totaltime * 100;
                });
            };

            var getItem = function (player) {
                $scope.player.id = player.playerid;
                $scope.player.active = true;
                $scope.player.item = xbmc.send('Player.GetItem', {
                    'properties': ['title', 'artist', 'albumartist', 'genre',
                        'year', 'rating', 'album', 'track', 'duration', 'comment', 'lyrics',
                        'musicbrainztrackid', 'musicbrainzartistid', 'musicbrainzalbumid',
                        'musicbrainzalbumartistid', 'playcount', 'fanart', 'director', 'trailer',
                        'tagline', 'plot', 'plotoutline', 'originaltitle', 'lastplayed', 'writer',
                        'studio', 'mpaa', 'cast', 'country', 'imdbnumber', 'premiered', 'productioncode',
                        'runtime', 'set', 'showlink', 'streamdetails', 'top250', 'votes', 'firstaired',
                        'season', 'episode', 'showtitle', 'thumbnail', 'file', 'resume', 'artistid',
                        'albumid', 'tvshowid', 'setid', 'watchedepisodes', 'disc', 'tag', 'art', 'genreid',
                        'displayartist', 'albumartistid', 'description', 'theme', 'mood', 'style',
                        'albumlabel', 'sorttitle', 'episodeguide', 'uniqueid', 'dateadded', 'channel',
                        'channeltype', 'hidden', 'locked', 'channelnumber', 'starttime', 'endtime'],
                    'playerid': $scope.player.id
                }, true, 'result.item').then(function (item) {
                        xbmc.send('Player.GetProperties', {
                            'properties': ['percentage', 'time', 'totaltime',
                                'speed', 'playlistid',
                                'currentsubtitle', 'subtitles',
                                'audiostreams', 'currentaudiostream', 'type'],
                            'playerid': $scope.player.id
                        }, true, 'result').then(function (properties) {
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
                                if (properties.speed === 1) {
                                    window.clearInterval($scope.player.intervalId);
                                    $scope.player.intervalId = window.setInterval(updateSeek, 1000);
                                }
                            });
                        return item;
                    });
            };

            var onPlayerPause = function () {
                $scope.player.speed = 0;
                window.clearInterval($scope.player.intervalId);
            };

            var onPlayerPlay = function (obj) {
                var data = obj.params.data;
                getItem(data.player);
            };

            var onPlayerPropertyChanged = function (obj) {
                var data = obj.params.data;
                console.log(data);
            };

            var onPlayerStop = function (obj) {
                window.clearInterval($scope.player.intervalId);
                init();
                $scope.go('/');
            };

            var onPlayerSeek = function (obj) {
                var data = obj.params.data;
                var time = data.player.time;
                var timeFilter = $filter('time');
                var seek = $scope.player.seek;
                seek.time = timeFilter(time);
                seek.percentage = seek.time / seek.totaltime * 100;
            };

            var onPlayerSpeedChanged = function (obj) {
                var data = obj.params.data;
                console.log(data);

            };

            var onPlaylistClear = function () {
                $scope.playlist = -1;
            };

            xbmc.register('Player.OnPause', onPlayerPause.bind(this));
            xbmc.register('Player.OnPlay', onPlayerPlay.bind(this));
            xbmc.register('Player.OnPropertyChanged', onPlayerPropertyChanged.bind(this));
            xbmc.register('Player.OnStop', onPlayerStop.bind(this));
            xbmc.register('Player.OnSeek', onPlayerSeek.bind(this));
            xbmc.register('Playlist.OnClear', onPlaylistClear.bind(this));


            var xbmchost = localStorage.getItem('xbmchost');
            if (xbmchost !== null) {
                $scope.configuration = JSON.parse(xbmchost);
                $scope.xbmc.connect($scope.configuration.host.ip, $scope.configuration.host.port);
            } else {
                $scope.go('/settings');
            }
            var onLoad = function () {
                xbmc.send('Player.GetActivePlayers', null, true, 'result').then(function (players) {
                    if (players.length > 0) {
                        getItem(players[0]);
                    }
                });

            }.bind(this);
            if (xbmc.isConnected()) {
                onLoad();
            } else {
                xbmc.register('Websocket.OnConnected', onLoad);
            }

            var main = document.querySelector('div[role="main"]');
            var gestureDetector = new GestureDetector(main);
            gestureDetector.startDetecting();

            var onSwipe = function (event) {
                var direction = event.detail.direction || '';
                var page = angular.element(document.querySelector('#page'));
                if (direction.toLowerCase() === 'left' && page.hasClass('minimize')) {
                    page.removeClass('minimize');
                } else if (direction.toLowerCase() === 'right' && !page.hasClass('minimize')) {
                    page.addClass('minimize');
                }
            };

            main.addEventListener('swipe', onSwipe.bind(this));
        }]);