angular.module('app')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('seasons', {
            url: '/tvshow/:tvshowid',
            views: {
                header: {templateUrl: 'layout/headers/searchable.tpl.html'},
                body: {
                    templateUrl: 'tvshow/seasons.tpl.html',
                    controller: 'TvShowSeasonsCtrl'
                }
            }
        });
    }])
    .controller('TvShowSeasonsCtrl', ['$scope', '$stateParams', '$location',
    function TvShowSeasonsCtrl($scope, $stateParams, $location) {
        $scope.loading = true;
        $scope.tvshowid = parseInt($stateParams.tvshowid);
        var onLoad = function () {
            $scope.xbmc.send('VideoLibrary.GetSeasons', {
                'tvshowid': $scope.tvshowid,
                'properties': ['season', 'showtitle', 'fanart', 'thumbnail'],
                'limits': {
                    'start': 0,
                    'end': 75
                },
                'sort': {
                    'order': 'ascending',
                    'method': 'label'
                }
            }, true, 'result.seasons').then(function (seasons) {
                    $scope.seasons = seasons || [];
                    $scope.loading = false;
                    if (seasons.length === 1) {
                        $scope.go('/tvshow/' + $scope.tvshowid + '/' + seasons[0].season);
                    }
                });
        }.bind(this);
        if ($scope.xbmc.isConnected()) {
            onLoad();
        } else {
            $scope.xbmc.register('Websocket.OnConnected', onLoad);
        }
    }])