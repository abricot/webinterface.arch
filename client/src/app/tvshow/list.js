angular.module('app')
.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('tvshows', {
      url: '/tvshows',
      views: {
        header: {templateUrl: 'layout/headers/navigation.tpl.html', controller : 'HeaderNavController'},
        body: { templateUrl: 'tvshow/list.tpl.html', controller: 'TvShowListCtrl'}
      }
    }).state('tvshows.all', {
      url : '/all',
      templateUrl: 'tvshow/shows.tpl.html',
      controller: 'ShowsCtrl'
    }).state('tvshows.recents', {
      url: '/recents',
      templateUrl: 'tvshow/episodes.tpl.html',
      controller: 'EpisodesCtrl'
    }).state('tvshows.popular', {
      url : '/popular',
      templateUrl: 'tvshow/popular.tpl.html',
      controller: 'PopularTVShowsCtrl'
    });
  }
])
.controller('TvShowListCtrl', ['$scope',
  function TvShowListCtrl($scope) {
    $scope.isSelected = function (stateName) {
      return $scope.$state.current.name === stateName;
    }
  }
]);