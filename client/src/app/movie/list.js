angular.module('app')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('movies', {
            url: '/movies',
            views: {
                header: {templateUrl: 'layout/headers/basic.tpl.html'},
                body: {templateUrl: 'movie/list.tpl.html', controller: 'MovieListCtrl'}
            }
        })
    }])
    .controller('MovieListCtrl', ['$scope',
        function MovieListCtrl($scope) {
            $scope.loading = true;
            function onMoviesRetrieved (movies) {
                $scope.loading = false;
                $scope.movies = movies;
                var randomIndex = Math.floor(Math.random()*movies.length);
                $scope.randomMovie = movies[randomIndex];
            };
            var onLoad = function () {
                 $scope.xbmc.getMovies(onMoviesRetrieved);
            };
            if ($scope.xbmc.isConnected()) {
                onLoad();
            } else {
                $scope.xbmc.register('Websocket.OnConnected', { fn : onLoad, scope : this});
            }

            $scope.getRandomIndex = function () {
                
                return randomIndex;
            }
        }
    ]);