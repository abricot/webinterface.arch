angular.module('app')
    .config(['$stateProvider',
        function($stateProvider) {
            $stateProvider.state('seasons', {
                url: '/tvshow/:tvshowid',
                views: {
                    header: {
                        templateUrl: 'layout/headers/searchable.tpl.html'
                    },
                    body: {
                        templateUrl: 'tvshow/seasons.tpl.html',
                        controller: 'TvShowSeasonsCtrl'
                    }
                }
            });
        }
    ])
    .controller('TvShowSeasonsCtrl', ['$scope', '$stateParams', '$location',
        function TvShowSeasonsCtrl($scope, $stateParams, $location) {
            $scope.loading = true;
            $scope.tvshowid = parseInt($stateParams.tvshowid);

            function onSeasonsRetrieved(seasons) {
                $scope.seasons = seasons || [];
                $scope.loading = false;
                if (seasons.length === 1) {
                    $scope.go('/tvshow/' + $scope.tvshowid + '/' + seasons[0].season);
                }
            };
            var onLoad = function() {
                $scope.xbmc.getSeasons($scope.tvshowid, onSeasonsRetrieved);
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
    ])