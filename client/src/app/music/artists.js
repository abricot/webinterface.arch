angular.module('app')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('artists', {
            url: '/music/artists',
            views: {
                header: {templateUrl: 'layout/headers/searchable.tpl.html'},
                body: {
                    templateUrl: 'music/artists.tpl.html', controller: 'MusicArtistsCtrl'
                }
            }
        });
    }])
    .controller('MusicArtistsCtrl', ['$scope',
        function MusicAlbumsCtrl($scope, $stateParams) {
            function onArtistsRetrieve (artists) {
                $scope.loading = false;
                $scope.artists = artists;
            };
            var onLoad = function () {
                $scope.loading = true;
                $scope.xbmc.getArtists(onArtistsRetrieve);
            };
            if ($scope.xbmc.isConnected()) {
                onLoad();
            } else {
                $scope.xbmc.register('Websocket.OnConnected', { fn : onLoad, scope : this});
            }

            $scope.hasCover = function (artist) {
                return artist.thumbnail !== '';
            }
        }
    ]);