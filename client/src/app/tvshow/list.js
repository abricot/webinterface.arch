angular.module('app')
    .config(['$stateProvider',
        function($stateProvider) {
            $stateProvider.state('tvshows', {
                url: '/tvshows',
                views: {
                    header: {
                        templateUrl: 'layout/headers/basic.tpl.html'
                    },
                    body: {
                        templateUrl: 'tvshow/list.tpl.html',
                        controller: 'TvShowListCtrl'
                    }
                }
            });
        }
    ])
    .controller('TvShowListCtrl', ['$scope',
        function TvShowListCtrl($scope) {
            function onTvShowsRetrieved(tvshows) {
                $scope.loading = false;
                $scope.tvshows = tvshows;
                var randomIndex = Math.floor(Math.random()*tvshows.length);
                $scope.randomShow = tvshows[randomIndex];
            };
            var onLoad = function() {
                $scope.loading = true;
                $scope.xbmc.getTVShows(onTvShowsRetrieved);
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