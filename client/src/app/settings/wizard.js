angular.module('app')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('settings', {
            url: '/settings',
            views: {
                header: {templateUrl: 'layout/headers/basic.tpl.html'},
                body: {templateUrl: 'settings/wizard.tpl.html', controller: 'WizardCtrl'}
            }
        });
    }])
    .controller('WizardCtrl', ['$scope', 'storage',
        function WizardCtrl($scope, storage) {
            $scope.validIpAddressRegex = new RegExp("^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$");

            $scope.save = function () {
                if($scope.wizard.$valid) {
                    storage.setItem('xbmchost', JSON.stringify($scope.configuration));
                    $scope.xbmc.connect($scope.configuration.host.ip, $scope.configuration.host.port);
                    $scope.go('/');
                }
            }
        }]);