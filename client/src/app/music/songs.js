angular.module('app')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('filteredSongs', {
            url: '/music/songs/:filter/:filterId',
            views: {
                header: {templateUrl: 'layout/headers/backable.tpl.html'},
                body: {
                    templateUrl: 'music/album.songs.tpl.html', controller: 'MusicSongsCtrl'
                }
            }
        });
    }])
    .controller('MusicSongsCtrl', ['$scope', '$rootScope', '$stateParams', '$filter',
    function MusicSongsCtrl($scope, $rootScope, $stateParams, $filter) {
        $scope.loading = true;
        $scope.filter = $stateParams.filter;
        $scope.queue = [];
        $scope.artist = null;
        var filter = null;
        if ($scope.filter) {
            filter = {key : $scope.filter, value : parseInt($stateParams.filterId)}
        }
        function onSongsRetrieved (songs) {
            $scope.songs = songs;
            if(filter !== null) {
                $scope.xbmc.getArtistDetails(songs[0].albumartistid[0], onArtistRetrieved);
            } else {
                $scope.loading = false;
            }
        };

        function onArtistRetrieved (artist) {
            $scope.artist = artist;
            $scope.loading = false;
        }

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
                return assetFilter(song.thumbnail, $scope.configuration.host);
            } else {
                return '';
            }
        }

        $scope.isFiltered = function () {
            return typeof $scope.filter !== 'undefined';
        }

        $scope.play = function (item) {
            $scope.xbmc.open(item);
        };

        $scope.addAlbumToQueue = function () {
            $scope.queue = $scope.songs.slice(1);
            $scope.play({songid : $scope.songs[0].songid})
        }
    }
])