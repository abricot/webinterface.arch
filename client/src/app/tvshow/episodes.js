angular.module('app')
    .config(['$stateProvider',
        function($stateProvider) {
            $stateProvider.state('episodes', {
                url: '/tvshow/:tvshowid/:season',
                views: {
                    header: {
                        templateUrl: 'layout/headers/basic.tpl.html'
                    },
                    body: {
                        templateUrl: 'tvshow/episodes.tpl.html',
                        controller: 'TvShowEpisodesCtrl'
                    }
                }
            });
        }
    ])
    .controller('TvShowEpisodesCtrl', ['$scope', '$stateParams', '$location',
        function TvShowEpisodesCtrl($scope, $stateParams, $location) {
            $scope.loading = true;
            $scope.tvshowid = parseInt($stateParams.tvshowid);
            $scope.season = parseInt($stateParams.season);

            function onEpisodesRetrieved(episodes) {
                $scope.loading = false;
                $scope.episodes = episodes;
            }
            var onLoad = function() {
                $scope.laoding = true;
                $scope.xbmc.getEpisodes($scope.tvshowid, $scope.season, onEpisodesRetrieved);
            };
            if ($scope.xbmc.isConnected()) {
                onLoad();
            } else {
                $scope.xbmc.register('Websocket.OnConnected', {
                    fn: onLoad,
                    scope: this
                });
            }
        }
    ]);