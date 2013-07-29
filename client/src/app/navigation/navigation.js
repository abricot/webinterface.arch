angular.module('app')
    .controller('NavigationCtrl', ['$scope', '$location', '$filter',
        function ($scope, $location, $filter) {
            $scope.medias = [
                {
                    hash: '/movies',
                    icon: 'icon-film',
                    label: 'Movies'
                },
                {
                    hash: '/tvshows',
                    icon: 'icon-facetime-video',
                    label: 'TV Shows'
                },
                {
                    hash: '/musics',
                    icon: 'icon-music',
                    label: 'Musics'
                }
            ];
            $scope.controls = [
                {
                    hash: '/',
                    icon: 'icon-remote',
                    label: 'Remote'
                },
                {
                    hash: '/settings',
                    icon: 'icon-cogs',
                    label: 'Settings'
                }
            ];
            $scope.getThumb = function (art) {
                var asset = $filter('asset');
                if (art) {
                    if (art['album.thumb']) {
                        return  asset(art['album.thumb'], $scope.configuration.host.ip);
                    }
                    if (art['tvshow.poster']) {
                        return  asset(art['tvshow.poster'], $scope.configuration.host.ip);
                    }
                    if (art.poster) {
                        return  asset(art.poster, $scope.configuration.host.ip);
                    }
                    if (art.thumb) {
                        return asset(art.thumb, $scope.configuration.host.ip);
                    }

                }
                return '/img/blank.gif';
            };

            $scope.getLabel = function (item) {
                if (item) {
                    return  item.title !== '' ? item.title : item.label;
                }
                return '';
            }

            $scope.go = function (path) {
                $location.path(path);
                $scope.toggleDrawer();
            };

            $scope.isCurrent = function (hash) {
                return hash === $location.path() ? 'selected' : '';
            };
            $scope.togglePlay = function () {
                $scope.xbmc.send('Player.PlayPause', {
                    'playerid': $scope.player.id
                });
            };
            $scope.next = function () {
                $scope.xbmc.send('Player.GoTo', {
                    'playerid': $scope.player.id,
                    'to': 'next'
                });
            }
        }]);
