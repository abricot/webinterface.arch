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

            $scope.hasPoster = function (art) {
                var result = false;
                if (art) {
                    if (art['album.thumb'] || art['tvshow.poster'] ||
                        art.poster || art.thumb) {
                        result =  true;
                    }
                }
                return result;
            };

            $scope.isCurrent = function (hash) {
                return hash === $location.path() ? 'selected' : '';
            };
        }]);
