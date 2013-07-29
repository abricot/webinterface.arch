angular.module('app')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('moviedetails', {
            url: '/movie/:movieid',
            views: {
                header: {templateUrl: 'layout/headers/basic.tpl.html'},
                body: {
                    templateUrl: 'movie/details.tpl.html',
                    controller: 'MovieDetailsCtrl'
                },
                footer: {templateUrl: 'layout/footers/details.tpl.html', controller: 'FooterCtrl'}
            }
        });
    }])
    .controller('MovieDetailsCtrl', ['$scope', '$stateParams', '$location',
        function MovieDetailsCtrl($scope, $stateParams, $location, utilities) {
            $scope.movieid = parseInt($stateParams.movieid);
            $scope.loading = true;
            var onLoad = function () {
                $scope.library.item = $scope.xbmc.send('VideoLibrary.GetMovieDetails', {
                    'movieid': $scope.movieid,
                    'properties': ['title', 'genre', 'rating', 'thumbnail', 'plot',
                        'studio', 'director', 'fanart', 'runtime', 'trailer', 'imdbnumber']
                }, true, 'result.moviedetails').then(function (item) {
                        $scope.loading = false;
                        item.type = 'movie';
                        return item;
                    });

            }.bind(this);
            if ($scope.xbmc.isConnected()) {
                onLoad();
            } else {
                $scope.xbmc.register('Websocket.OnConnected', onLoad);
            }
        }
    ]);