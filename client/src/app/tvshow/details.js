angular.module('app')
    .config(['$stateProvider',
        function($stateProvider) {
            $stateProvider.state('episode', {
                url: '/tvshow/:tvshowid/:season/:episodeid',
                views: {
                    header: {
                        templateUrl: 'layout/headers/basic.tpl.html'
                    },
                    body: {
                        templateUrl: 'tvshow/details.tpl.html',
                        controller: 'EpisodeDetailsCtrl'
                    },
                    footer: {
                        templateUrl: 'layout/footers/details.tpl.html',
                        controller: 'FooterCtrl'
                    }
                }
            });
        }
    ])
    .controller('EpisodeDetailsCtrl', ['$scope', '$stateParams', '$location',
        function EpisodeDetailsCtrl($scope, $stateParams, $location) {
            $scope.episodeid = parseInt($stateParams.episodeid);

            function onEpisodeDetailsRetrieved(item) {
                $scope.loading = false;
                item.type = 'episode';
                $scope.library.item = item
            };

            var onLoad = function() {
                $scope.loading = true;
                $scope.xbmc.getEpisodeDetails($scope.episodeid, onEpisodeDetailsRetrieved);
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