angular.module('app')
    .config(['$stateProvider',
        function($stateProvider) {
            $stateProvider.state('playing', {
                url: '/now/playing',
                views: {
                    header: {
                        templateUrl: 'layout/headers/basic.tpl.html'
                    },
                    body: {
                        templateUrl: 'now/playing.tpl.html',
                        controller: 'NowPlayingCtrl'
                    },
                    footer: {
                        templateUrl: 'layout/footers/player.tpl.html',
                        controller: 'FooterCtrl'
                    }
                }
            });
        }
    ])
    .controller('NowPlayingCtrl', ['$scope', '$filter',
        function NowPlayingCtrl($scope, $filter) {
            $scope.loading = true;
            $scope.showAudioSelect = false;
            $scope.showSubtitleSelect = false;
            $scope.showTimePicker = false;

            var timeFilter = $filter('time');
            $scope.seekTime = timeFilter($scope.player.seek.time);

            function onPlayerItemRetrieved(item) {
                $scope.loading = false;
                $scope.library.item = item;
            };

            function onPlayersRetrieved(players) {
                if (players.length > 0) {
                    var player = players[0];
                    $scope.xbmc.getPlayerItem(onPlayerItemRetrieved, player.playerid);
                } else {
                    $scope.go('/');
                }
            };

            var onLoad = function() {
                $scope.xbmc.getActivePlayers(onPlayersRetrieved);
            };
            if ($scope.xbmc.isConnected()) {
                onLoad();
            } else {
                $scope.xbmc.register('Websocket.OnConnected', {
                    fn: onLoad,
                    scope: this
                });
            }

            $scope.isTypeVideo = function() {
                return $scope.player.type === 'video' ||
                    $scope.player.type === 'movie' ||
                    $scope.player.type === 'episode';
            };

            $scope.isSelected = function(current, obj) {
                if (typeof obj === 'string') {
                    return obj === current;
                } else {
                    return obj.index === current.index;
                }
            };

            $scope.onSeekbarChanged = function(newValue) {
                $scope.updateSeek(newValue);
            };

            var removeTime = function(date) {
                date.setSeconds(0);
                date.setHours(0);
                date.setMinutes(0);
                return date;
            }

            $scope.onValidateSeekTime = function() {
                var startTime = removeTime(new Date()).getTime();
                var totalTime = timeFilter($scope.player.seek.totaltime).getTime();
                var seekTime = $scope.seekTime.getTime();
                var percent = (seekTime - startTime) / (totalTime - startTime) * 100;
                $scope.updateSeek(Math.floor(percent));
                $scope.showTimePicker = false;
            };

            $scope.setAudioStream = function(obj) {
                $scope.showAudioSelect = false;
                $scope.player.current.audiostream = obj;
                $scope.xbmc.setAudioStream(typeof obj === 'string' ? obj : obj.index);
            };

            $scope.setSubtitle = function(obj) {
                $scope.showSubtitleSelect = false;
                $scope.player.current.subtitle = obj;
                $scope.xbmc.setSubtitle(typeof obj === 'string' ? obj : obj.index);
            };

            $scope.toggleAudioStreams = function() {
                $scope.showAudioSelect = !$scope.showAudioSelect;
            };

            $scope.toggleSubtitles = function() {
                $scope.showSubtitleSelect = !$scope.showSubtitleSelect;
            };

            $scope.toggleTimePicker = function() {
                $scope.seekTime = timeFilter($scope.player.seek.time);
                $scope.showTimePicker = !$scope.showTimePicker;
            };

            $scope.updateSeek = function(newValue) {
                newValue = Math.min(newValue, 100);
                newValue = Math.max(newValue, 0);
                $scope.xbmc.seek(newValue);
            },

            $scope.$watch('player.item', function() {
                $scope.library.item = $scope.player.item;
            }, true);
        }
    ])