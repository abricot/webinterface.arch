angular.module('app')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('movies', {
    url: '/movies',
    views: {
      header: {templateUrl: 'layout/headers/navigation.tpl.html', controller : 'HeaderNavController'},
      body: {templateUrl: 'movie/list.tpl.html', controller: 'MovieListCtrl'}
    }
  }).state('movies.all', {
      url : '/all',
      templateUrl: 'movie/movies.tpl.html',
      controller: 'MoviesCtrl',
      data : {
        methodName : 'getMovies'
      }
    }).state('movies.recents', {
      url: '/recents',
      templateUrl: 'movie/movies.tpl.html',
      controller: 'MoviesCtrl',
      data : {
        methodName : 'getRecentlyAddedMovies'
      }
    }).state('movies.popular', {
      url : '/popular',
      templateUrl: 'movie/movies.tpl.html',
      controller: 'PopularMoviesCtrl'
    });
}])
.controller('MovieListCtrl', ['$scope',
  function MovieListCtrl($scope) {
    $scope.isSelected = function (stateName) {
      return $scope.$state.current.name === stateName;
    }
  }
]);