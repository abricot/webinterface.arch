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
            var onLoad = function () {
                $scope.loading = true;
                $scope.artists = $scope.xbmc.send('AudioLibrary.GetArtists', {
                    'limits': {
                        'start': 0,
                        'end': 100
                    },
                    'properties': ['genre', 'thumbnail'],
                    'sort': {
                        'order': 'ascending',
                        'method': 'label',
                        'ignorearticle': true
                    }
                }, true, 'result.artists').then(function (artists) {
                        $scope.loading = false;
                        return artists;
                    });
            }.bind(this);
            if ($scope.xbmc.isConnected()) {
                onLoad();
            } else {
                $scope.xbmc.register('Websocket.OnConnected', onLoad);
            }

            $scope.hasCover = function (artist) {
                return artist.thumbnail !== '';
            }
        }
    ]);