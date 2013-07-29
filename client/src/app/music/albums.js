angular.module('app')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('filteredAlbums', {
            url: '/music/albums/:filter/:filterId',
            views: {
                header: {templateUrl: 'layout/headers/searchable.tpl.html'},
                body: {
                    templateUrl: 'music/albums.tpl.html', controller: 'MusicAlbumsCtrl'
                }
            }
        }).state('albums', {
                url: '/music/albums',
                views: {
                    header: {templateUrl: 'layout/headers/searchable.tpl.html'},
                    body: {
                        templateUrl: 'music/albums.tpl.html', controller: 'MusicAlbumsCtrl'
                    }
                }
            });
    }])
    .controller('MusicAlbumsCtrl', ['$scope', '$stateParams',
        function MusicAlbumsCtrl($scope, $stateParams) {
            $scope.loading = true;
            $scope.filter = $stateParams.filter;

            var params = {
                'limits': {
                    'start': 0,
                    'end': 100
                },
                'properties': ['title', 'artist', 'thumbnail', 'year', 'genre'],
                'sort': {
                    'order': 'ascending',
                    'method': 'label',
                    'ignorearticle': true
                }
            };

            if ($scope.filter) {
                $scope.filterId = parseInt($stateParams.filterId);
                params['filter'] = {};
                params['filter'][$scope.filter] = $scope.filterId;
            }
            var onLoad = function () {
                $scope.albums = $scope.xbmc.send('AudioLibrary.GetAlbums', params, true, 'result.albums').then(function (albums) {
                    $scope.loading = false;
                    return albums;
                });
            }.bind(this);
            if ($scope.xbmc.isConnected()) {
                onLoad();
            } else {
                $scope.xbmc.register('Websocket.OnConnected', onLoad);
            }

            $scope.hasCover = function (album) {
                return album.thumbnail !== '';
            }
        }
    ]);