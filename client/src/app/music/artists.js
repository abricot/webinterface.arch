angular.module('app')
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