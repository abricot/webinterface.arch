angular.module('app')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('remote', {
            url: '/',
            views: {
                header: {templateUrl: 'layout/headers/basic.tpl.html'},
                body: {
                    templateUrl: 'remote/remote.tpl.html',
                    controller: 'RemoteCtrl'
                },
                footer: {templateUrl: 'layout/footers/basic.tpl.html', controller: 'FooterCtrl'}
            }
        });
    }])
    .controller('RemoteCtrl', ['$scope', '$location',
        function RemoteCtrl($scope, $location) {
            var onLoad = function () {
                $scope.xbmc.send('Application.GetProperties', {
                    'properties': ['volume']
                }, true, 'result.volume').then(function(volume) {
                    $scope.volume = volume;
                });
            };
            if ($scope.xbmc.isConnected()) {
                onLoad();
            } else {
                $scope.xbmc.register('Websocket.OnConnected', { fn : onLoad, scope : this});
            }

            $scope.setVolume = function (volume) {
                $scope.volume = Math.max(0, Math.min(volume, 100));
                $scope.xbmc.send('Application.SetVolume', {'volume': $scope.volume});
            }
        }]);