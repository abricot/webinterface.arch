angular.module('app')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('tvshows', {
            url: '/tvshows',
            views: {
                header: {templateUrl: 'layout/headers/searchable.tpl.html'},
                body: {templateUrl: 'tvshow/list.tpl.html',
                    controller: 'TvShowListCtrl'}
            }
        });
    }])
    .controller('TvShowListCtrl', ['$scope',
        function TvShowListCtrl($scope) {
            var onLoad = function () {
                $scope.loading = true;
                $scope.tvshows = $scope.xbmc.send('VideoLibrary.GetTVShows', {
                    'limits': {
                        'start': 0,
                        'end': 75
                    },
                    'properties': ['genre', 'title', 'rating', 'art', 'playcount'],
                    'sort': {
                        'order': 'ascending',
                        'method': 'label'
                    }
                }, true, 'result.tvshows').then(function (tvshows) {
                        $scope.loading = false;
                        return tvshows;
                    });
            }.bind(this);
            if ($scope.xbmc.isConnected()) {
                onLoad();
            } else {
                $scope.xbmc.register('Websocket.OnConnected', onLoad);
            }
        }]);