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
        var filter = null;
        if ($scope.filter) {
            filter = {key : $scope.filter, value : parseInt($stateParams.filterId)}
        }
        function onSongsRetrieved (songs) {
            $scope.loading = false;
            $scope.songs = songs;
        };
        var onLoad = function () {
            $scope.xbmc.getSongs(filter, onSongsRetrieved);
        };

        var playlistAdd = function () {
            if ($scope.isFiltered() && $scope.queue.length > 0) {
                $scope.xbmc.queue({songid: $scope.queue[0].songid});
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
            $scope.xbmc.register('Websocket.OnConnected', { fn : onLoad, scope : this});
        }

        $scope.getCover = function (song) {
            var assetFilter = $filter('asset');
            var hasCover = typeof $scope.filter !== 'undefined' && song && song.thumbnail !== '';
            if (hasCover) {
                return assetFilter(song.thumbnail, $scope.configuration.host.ip);
            } else {
                return 'img/backgrounds/album.png';
            }
        }

        $scope.isFiltered = function () {
            return typeof $scope.filter !== 'undefined';
        }

        $scope.play = function (item, index) {
            $scope.xbmc.open(item);
            if (index + 1 < $scope.songs.length) {
                $scope.queue = $scope.songs.slice(index + 1);
            }
        };
    }
])