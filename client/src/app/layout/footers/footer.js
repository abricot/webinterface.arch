angular.module('app')
    .controller('FooterCtrl', ['$scope',
        function FooterCtrl($scope) {
            $scope.goTo = function (window, category) {
                var params = {'window': window};
                if (category) {
                    params.parameters = [category]
                }
                $scope.xbmc.activateWindow(params);
            };

            $scope.imdb = function (imdbnumber) {
                window.open('http://www.imdb.com/title/' + imdbnumber + '/', '_blank');
            };

            var setSpeed = function (speed) {
                $scope.player.speed = speed;
                $scope.xbmc.setSpeed(speed);
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
        }
    ])