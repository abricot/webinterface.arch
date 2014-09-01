angular.module('app')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('music', {
            url: '/musics',
            views: {
                header: {templateUrl: 'layout/headers/basic.tpl.html'},
                body: {
                    templateUrl: 'music/musics.tpl.html',
                    controller: 'MusicCtrl'
                }
            }
        }).state('music.albums', {
            url : '/albums',
            templateUrl: 'music/albums.tpl.html',
            controller: 'MusicAlbumsCtrl'
        }).state('music.artists', {
            url : '/artists',
            templateUrl: 'music/artists.tpl.html',
            controller: 'MusicArtistsCtrl'
        }).state('music.songs', {
            url : '/songs',
            templateUrl: 'music/songs.tpl.html',
            controller: 'MusicSongsCtrl'
        });
    }])
    .controller('MusicCtrl', ['$scope',
        function MusicCtrl($scope, $stateParams) {
            $scope.isSelected = function (category) {
                return $scope.$state.current.name === category;
            }
        }
    ]);