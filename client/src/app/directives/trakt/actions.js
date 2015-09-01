"use strict";
angular.module('directives.traktActions', ['services.trakt'])
.directive('traktActions', ['$q', '$filter', 'trakt', function ($q, $filter, trakt) {
  return {
    restrict: 'E',
    replace : true,
    templateUrl: 'template/actions/actions.tpl.html',
    scope: {
      mediaType : '=',
      imdb : '='
    },
    link: function (scope, elem, attrs) {
      var arrFilter = $filter('filter');
      var entity = scope.mediaType === 'movies' ? 'movie' : 'show';
      var item = null;
      var history = [];
      scope.historyMatch = [];
      scope.collectionMatch = [];
      scope.watchlistMatch = [];

      $q.all([
          trakt[scope.mediaType].summary(scope.imdb),
          trakt.sync.get('watched', scope.mediaType),
          trakt.sync.get('collection', scope.mediaType),
          trakt.sync.get('watchlist', scope.mediaType)
        ]).then(function(results){
          item = results[0].data;
          history = results[1].data;
          collection = results[2].data;
          watchlist = results[3].data;
          var searchCriteria = {};
          searchCriteria[entity] = {ids : {trakt : item.ids.trakt}};
          scope.historyMatch = arrFilter(history, searchCriteria);
          scope.collectionMatch = arrFilter(collection, searchCriteria);
          scope.watchlistMatch = arrFilter(watchlist, searchCriteria);
          console.log(results);
        });
    }
  };
}]);