angular.module('app')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('episode', {
            url: '/tvshow/:tvshowid/:season/:episodeid',
            views: {
                header: {templateUrl: 'layout/headers/basic.tpl.html'},
                body: {
                    templateUrl: 'tvshow/details.tpl.html',
                    controller: 'EpisodeDetailsCtrl'
                },
                footer: {templateUrl: 'layout/footers/details.tpl.html', controller: 'FooterCtrl'}
            }
        });
    }])
    .controller('EpisodeDetailsCtrl', ['$scope', '$stateParams', '$location',
        function EpisodeDetailsCtrl($scope, $stateParams, $location) {
            $scope.episodeid = parseInt($stateParams.episodeid);
            var onLoad = function () {
                $scope.loading = true;
                $scope.library.item = $scope.xbmc.send('VideoLibrary.GetEpisodeDetails', {
                    'episodeid': $scope.episodeid,
                    'properties': ['title', 'plot', 'rating', 'firstaired', 'runtime', 'thumbnail', 'art']
                }, true, 'result.episodedetails').then(function (item) {
                        $scope.loading = false;
                        item.type = 'episode';
                        return item;
                    });

            }.bind(this);
            if ($scope.xbmc.isConnected()) {
                onLoad();
            } else {
                $scope.xbmc.register('Websocket.OnConnected', onLoad);
            }

            $scope.play = function (episodeid) {
                $scope.xbmc.send('Player.Open', {
                    'item': {
                        'episodeid': episodeid
                    }
                });
            }
        }]);