angular.module('app')
.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('search', {
      url: '/search/:query',
      views: {
        header: {templateUrl: 'modules/common/navigation.tpl.html', controller : 'HeaderNavController'},
        body: { templateUrl: 'modules/search/list.tpl.html', controller: 'SearchListCtrl'}
      }
    });
  }
])
.controller('SearchListCtrl', ['$scope', '$stateParams', 
  function SearchListCtrl($scope, $stateParams) {
    $scope.query = $stateParams.query;
    $scope.results = [];
    $scope.filter = {mediaType : ''};
    
    $scope.pages = 1;
    $scope.total = Infinity;

    var cleanUpResults = function(results) {
      return results.filter(function(result) {
        return result.mediaType === 'movie' || result.mediaType === 'tv';
      }).map(function(result) {
        if(result.hasOwnProperty('firstaired')) {
          result.year = moment(result.firstaired).year();
        }
        return result;
      });
    };

    function onResultsFromSource(response) {
      $scope.total = response.data.totalPages;
      $scope.results = $scope.results.concat(cleanUpResults(response.data.results));
    }; 

    $scope.getPath = function (result) {
      if(result.mediaType === 'tv') {
        return '#/tvshows/tmdb/'+result.id;
      } else {
        return '#/movies/tmdb/'+result.id;
      }
    };

    $scope.loadMore = function () {
      if( $scope.pages < $scope.total) {
        $scope.fetching = true;
        $scope.tmdb.search($scope.query, ++$scope.pages).then(onResultsFromSource);
      }
    };

    $scope.tmdb.search($scope.query, $scope.pages).then(onResultsFromSource);
  }
]);