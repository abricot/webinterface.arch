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
                $scope.volume = $scope.xbmc.send('Application.GetProperties', {
                    'properties': ['volume']
                }, true, 'result.volume').then(function(volume) {
                    $scope.volume = volume;
                });
            }.bind(this);
            if ($scope.xbmc.isConnected()) {
                onLoad();
            } else {
                $scope.xbmc.register('Websocket.OnConnected', onLoad);
            }

            var onVolumeChanged = function (result) {
                $scope.volume = result.params.data.volume;
            };
            $scope.xbmc.register('Application.OnVolumeChanged', onVolumeChanged);

            $scope.setVolume = function (volume) {
                volume = Math.max(0, Math.min(volume, 100));
                $scope.xbmc.send('Application.SetVolume', {'volume': volume});
            }
        }]);