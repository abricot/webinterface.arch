angular.module('app')
    .config(['$stateProvider',
        function($stateProvider) {
            $stateProvider.state('remote', {
                url: '/',
                views: {
                    header: {
                        templateUrl: 'layout/headers/basic.tpl.html'
                    },
                    body: {
                        templateUrl: 'remote/remote.tpl.html',
                        controller: 'RemoteCtrl'
                    }
                }
            });
        }
    ]).controller('RemoteCtrl', ['$scope', '$location',
        function RemoteCtrl($scope, $location) {
            $scope.textToSend = '';
            $scope.showKeyboard = false;

            $scope.toggleKeyboard = function() {
                $scope.showKeyboard = !$scope.showKeyboard;
            };

            $scope.onValidateText = function() {
                $scope.xbmc.sendText($scope.textToSend);
                $scope.showKeyboard = false;
                $scope.textToSend = '';
            };

        }
    ]);