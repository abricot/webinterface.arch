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
            function onMovieRetrieved (item) {
                $scope.loading = false;
                item.type = 'movie';
                $scope.library.item = item;
            };
            var onLoad = function () {
                $scope.xbmc.getMovieDetails($scope.movieid, onMovieRetrieved);
            };
            if ($scope.xbmc.isConnected()) {
                onLoad();
            } else {
                $scope.xbmc.register('Websocket.OnConnected', { fn : onLoad, scope : this});
            }
        }
    ]);