angular.module('app')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('filteredSongs', {
            url: '/music/songs/:filter/:filterId',
            views: {
                header: {templateUrl: 'layout/headers/searchable.tpl.html'},
                body: {
                    templateUrl: 'music/songs.tpl.html', controller: 'MusicSongsCtrl'
                }
            }
        }).state('songs', {
                url: '/music/songs',
                views: {
                    header: {templateUrl: 'layout/headers/searchable.tpl.html'},
                    body: {
                        templateUrl: 'music/songs.tpl.html', controller: 'MusicSongsCtrl'
                    }
                }
            });
    }])
    .controller('MusicSongsCtrl', ['$scope', '$rootScope', '$stateParams', '$filter',
    function MusicSongsCtrl($scope, $rootScope, $stateParams, $filter) {
        $scope.loading = true;
        $scope.filter = $stateParams.filter;
        $scope.queue = [];
        var params = {
            'limits': {
                'start': 0,
                'end': 500
            },
            'properties': ['title', 'artist', 'album', 'albumid', 'thumbnail', 'duration', 'track', 'year'],
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
            params.sort.method = 'track';
        }
        var onLoad = function () {
            $scope.xbmc.send('AudioLibrary.GetSongs', params, true, 'result.songs').then(function (songs) {
                $scope.loading = false;
                $scope.songs = songs;
            });

        }.bind(this);

        var playlistAdd = function () {
            if ($scope.queue.length > 0) {
                $scope.xbmc.send('Playlist.Add', {
                    'playlistid': $scope.playlist,
                    'item': {songid: $scope.queue[0].songid}
                });
                $scope.queue = $scope.queue.slice(1);
                if ($scope.queue.length > 0) {
                    window.setTimeout(playlistAdd.bind(this), 500);
                }
            }
        }

        $scope.$watch('playlist', function () {
            playlistAdd();
        }, true);

        if ($scope.xbmc.isConnected()) {
            onLoad();
        } else {
            $scope.xbmc.register('Websocket.OnConnected', onLoad);
        }

        $scope.getCover = function (song) {
            var assetFilter = $filter('asset');
            var hasCover = typeof $scope.filter !== 'undefined' && song && song.thumbnail !== '';
            if (hasCover) {
                return assetFilter(song.thumbnail, $scope.configuration.host.ip);
            } else {
                return '/img/backgrounds/album.png';
            }
        }

        $scope.isFiltered = function () {
            return typeof $scope.filter !== 'undefined';
        }

        $scope.play = function (item, index) {
            $scope.xbmc.send('Player.Open', {
                'item': item
            });
            if (index + 1 < $scope.songs.length) {
                $scope.queue = $scope.songs.slice(index + 1);
            }
        };
    }
])