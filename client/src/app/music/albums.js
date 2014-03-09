angular.module('app')
    .config(['$stateProvider',
        function($stateProvider) {
            $stateProvider.state('filteredAlbums', {
                url: '/music/albums/:filter/:filterId',
                views: {
                    header: {
                        templateUrl: 'layout/headers/searchable.tpl.html'
                    },
                    body: {
                        templateUrl: 'music/albums.tpl.html',
                        controller: 'MusicAlbumsCtrl'
                    }
                }
            }).state('albums', {
                url: '/music/albums',
                views: {
                    header: {
                        templateUrl: 'layout/headers/searchable.tpl.html'
                    },
                    body: {
                        templateUrl: 'music/albums.tpl.html',
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

            function onAlbumsRetrieved(albums) {
                $scope.loading = false;
                $scope.albums = albums;
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