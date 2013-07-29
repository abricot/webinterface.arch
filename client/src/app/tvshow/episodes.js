angular.module('app')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('episodes', {
            url: '/tvshow/:tvshowid/:season',
            views: {
                header: {templateUrl: 'layout/headers/searchable.tpl.html'},
                body: {
                    templateUrl: 'tvshow/episodes.tpl.html',
                    controller: 'TvShowEpisodesCtrl'
                }
            }
        });
    }])
    .controller('TvShowEpisodesCtrl', ['$scope', '$stateParams', '$location',
        function TvShowEpisodesCtrl($scope, $stateParams, $location) {
            $scope.loading = true;
            $scope.tvshowid = parseInt($stateParams.tvshowid);
            $scope.season = parseInt($stateParams.season);
            var onLoad = function () {
                $scope.laoding = true;
                $scope.episodes = $scope.xbmc.send('VideoLibrary.GetEpisodes', {
                    'tvshowid': $scope.tvshowid,
                    'season': $scope.season,
                    'properties': ['title', 'rating', 'firstaired', 'runtime', 'season', 'episode', 'thumbnail', 'art'],
                    'limits': {
                        'start': 0,
                        'end': 75
                    },
                    'sort': {
                        'order': 'ascending',
                        'method': 'label'
                    }
                }, true, 'result.episodes').then(function (episodes) {
                        $scope.loading = false;
                        return episodes;
                    });
            }.bind(this);
            if ($scope.xbmc.isConnected()) {
                onLoad();
            } else {
                $scope.xbmc.register('Websocket.OnConnected', onLoad);
            }
        }]);