angular.module('app')
    .controller('FooterCtrl', ['$scope',
        function FooterCtrl($scope) {
            $scope.goTo = function (window, category) {
                var params = {'window': window};
                if (category) {
                    params.parameters = [category]
                }
                $scope.xbmc.send('GUI.ActivateWindow', params);
            };

            $scope.imdb = function (imdbnumber) {
                window.open('http://www.imdb.com/title/' + imdbnumber + '/', '_blank');
            };

            $scope.add = function (item) {
                if ($scope.playlist > -1) {
                    $scope.xbmc.send('Playlist.Add', {
                        'playlistid': $scope.playlist,
                        'item': item
                    });
                }
            }

            var setSpeed = function (speed) {
                $scope.player.speed = speed;
                $scope.xbmc.send('Player.SetSpeed', {
                    'playerid': $scope.player.id,
                    'speed': speed
                });
            }

            $scope.backward = function () {
                var newSpeed = $scope.player.speed;
                if ($scope.player.speed === 1) {
                    newSpeed = -2;
                } else if ($scope.player.speed > 0) {
                    newSpeed = newSpeed / 2;
                } else if ($scope.player.speed < 0) {
                    newSpeed = newSpeed * 2;
                }
                setSpeed(newSpeed >= -32 ? newSpeed : 1);
            };

            $scope.forward = function () {
                var newSpeed = $scope.player.speed;
                if ($scope.player.speed === -1) {
                    newSpeed = 1;
                } else if ($scope.player.speed > 0) {
                    newSpeed = newSpeed * 2;
                } else if ($scope.player.speed < 0) {
                    newSpeed = newSpeed / 2;
                }
                setSpeed(newSpeed <= 32 ? newSpeed : 1);
            };

            $scope.play = function (item) {
                $scope.xbmc.send('Player.Open', {
                    'item': item
                });
            };

            $scope.togglePlay = function () {
                if ($scope.player.speed === 0 || $scope.player.speed === 1) {
                    $scope.xbmc.send('Player.PlayPause', {
                        'playerid': $scope.player.id
                    });
                } else {
                    setSpeed(1);
                }
            };

            $scope.next = function () {
                $scope.xbmc.send('Player.GoTo', {
                    'playerid': $scope.player.id,
                    'to': 'next'
                });
            };

            $scope.previous = function () {
                $scope.xbmc.send('Player.GoTo', {
                    'playerid': $scope.player.id,
                    'to': 'previous'
                });
            };

            $scope.stop = function () {
                $scope.xbmc.send('Player.Stop', {
                    'playerid': $scope.player.id
                });
            };
        }
    ])