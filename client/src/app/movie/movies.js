angular.module('app')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('movies', {
    url: '/movies',
    views: {
      header: {templateUrl: 'layout/headers/navigation.tpl.html', controller : 'HeaderNavController'},
      body: {templateUrl: 'movie/movies.tpl.html', controller: 'MovieListCtrl'}
    }
  }).state('movies.all', {
    url : '/all',
    templateUrl: 'movie/list.tpl.html',
    controller: 'MoviesCtrl',
    data : {
      methodName : 'getMovies'
    }
  }).state('movies.recents', {
    url: '/recents',
    templateUrl: 'movie/list.tpl.html',
    controller: 'MoviesCtrl',
    data : {
      methodName : 'getRecentlyAddedMovies'
    }
  }).state('movies.popular', {
    url : '/popular',
    templateUrl: 'movie/list.tpl.html',
    controller: 'PopularMoviesCtrl'
  }).state('movies.details', {
    url: '/:movieid',
    templateUrl: 'movie/details.tpl.html',
    controller: 'MovieDetailsCtrl'
  }).state('movies.tmdb', {
    url: '/tmdb/:movieid',
    templateUrl: 'movie/details.tpl.html',
    controller: 'TMDBMovieDetailsCtrl'
  });
}])
.controller('MovieListCtrl', ['$scope',
  function MovieListCtrl($scope) {
    $scope.isSelected = function (stateName) {
      return $scope.$state.current.name === stateName;
    }
  }
]);