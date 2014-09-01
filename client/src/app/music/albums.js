angular.module('app')
    .config(['$stateProvider',
        function($stateProvider) {
            $stateProvider.state('filteredAlbums', {
                url: '/music/albums/:filter/:filterId',
                views: {
                    header: {
                        templateUrl: 'layout/headers/backable.tpl.html'
                    },
                    body: {
                        templateUrl: 'music/artist.albums.tpl.html',
                        controller: 'MusicAlbumsCtrl'
                    }
                }
            });
        }
    ])
    .controller('MusicAlbumsCtrl', ['$scope', '$stateParams',
        function MusicAlbumsCtrl($scope, $stateParams) {
            $scope.loading = true;
            $scope.filter = $stateParams.filter;

            var filter = null;
            if ($scope.filter) {
                $scope.filterId = parseInt($stateParams.filterId);
                filter = {
                    key: $scope.filter,
                    value: $scope.filterId
                };
            }
            function onArtistRetrieved (artist) {
                $scope.artist = artist;
                $scope.loading = false;

            };
            function onAlbumsRetrieved(albums) {
                $scope.albums = albums;
                $scope.xbmc.getArtistDetails(albums[0].artistid[0], onArtistRetrieved);
            };
            var onLoad = function() {
                $scope.xbmc.getAlbums(filter, onAlbumsRetrieved);
            };
            if ($scope.xbmc.isConnected()) {
                onLoad();
            } else {
                $scope.xbmc.register('Websocket.OnConnected', {
                    fn: onLoad,
                    scope: this
                });
            }

            $scope.hasCover = function(album) {
                return album.thumbnail !== '';
            }
        }
    ]);