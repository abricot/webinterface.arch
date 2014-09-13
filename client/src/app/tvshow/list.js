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
    .controller('TvShowListCtrl', ['$scope', 'storage',
        function TvShowListCtrl($scope, storage) {
            $scope.loading = true;
            $scope.updating = true;

            function updateRandomShow() {
                 var randomIndex = Math.floor(Math.random()*$scope.tvshows.length);
                $scope.randomShow = $scope.tvshows[randomIndex];
            }

            function onTvShowsFromCache(tvshows) {
                if(tvshows) {
                    $scope.loading = false;
                    $scope.tvshows = tvshows;
                    updateRandomShow();
                }
            }

            function onTvShowsFromSource(tvshows) {
                $scope.loading = false;
                $scope.updating = false;
                storage.setItem('VideoLibrary.TVShows', tvshows);
                if(!angular.equals(tvshows, $scope.tvshows)) {
                    updateRandomShow();
                }
                $scope.tvshows = tvshows;
            };

            var onLoad = function() {
                storage.getItem('VideoLibrary.TVShows', onTvShowsFromCache);
                $scope.xbmc.getTVShows(onTvShowsFromSource);
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