angular.module('app')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('movies', {
            url: '/movies',
            views: {
                header: {templateUrl: 'layout/headers/searchable.tpl.html'},
                body: {templateUrl: 'movie/list.tpl.html', controller: 'MovieListCtrl'}
            }
        })
    }])
    .controller('MovieListCtrl', ['$scope',
        function MovieListCtrl($scope) {
            $scope.loading = true;
            var onLoad = function () {
                $scope.movies = $scope.xbmc.send('VideoLibrary.GetMovies', {
                    'limits': {
                        'start': 0,
                        'end': 75
                    },
                    'properties': ['title', 'genre', 'rating', 'thumbnail', 'runtime', 'playcount', 'streamdetails'],
                    'sort': {
                        'order': 'ascending',
                        'method': 'label',
                        'ignorearticle': true
                    }
                }, true, 'result.movies').then(function (movies) {
                        $scope.loading = false;
                        return movies;
                    });
            }.bind(this);
            if ($scope.xbmc.isConnected()) {
                onLoad();
            } else {
                $scope.xbmc.register('Websocket.OnConnected', onLoad);
            }
        }
    ]);