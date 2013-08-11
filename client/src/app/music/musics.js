angular.module('app')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('music', {
            url: '/musics',
            views: {
                header: {templateUrl: 'layout/headers/basic.tpl.html'},
                body: {
                    templateUrl: 'music/musics.tpl.html', controller : 'MusicsCtrl'
                }
            }
        })
    }]).controller('MusicsCtrl', ['$scope',
        function MusicsCtrl($scope) {
            $scope.party = function() {
                $scope.xbmc.send('Player.Open', {
                    'item': {'file' : undefined}
                });
            }
        }
    ]);