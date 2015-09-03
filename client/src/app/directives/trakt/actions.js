"use strict";
angular.module('directives.traktActions', ['services.trakt'])
.directive('traktActions', ['$q', '$filter', 'trakt', function ($q, $filter, trakt) {
  return {
    restrict: 'E',
    replace : true,
    templateUrl: 'template/actions/actions.tpl.html',
    scope: {
      mediaType : '=',
      imdb : '=',
      slug : '='
    },
    link: function (scope, elem, attrs) {
      var arrFilter = $filter('filter');
      var entity = scope.mediaType === 'movies' ? 'movie' : 'show';
      var item = null;
      scope.loading = true;
      scope.loadings = {
        history : false,
        collection : false,
        watchlist : false
      }
      scope.historyMatch = [];
      scope.collectionMatch = [];
      scope.watchlistMatch = [];

      var addTo = function(method, obj){
        scope.loadings[method] = true;
        trakt.sync.add(method, scope.mediaType, item).then(function(result){
          var added = result.data.added;
          obj[entity] = item;
          scope[method+'Match'] = [obj];
          scope.loadings[method] = false;
        });
      };
      var removeFrom = function(method) {
        scope.loadings[method] = true;
        trakt.sync.remove(method, scope.mediaType, item).then(function(result){
          scope[method+'Match'] = [];
          scope.loadings[method] = false;
        });
      };

      scope.toggleHistory = function () {
        if(scope.historyMatch.length) {
          removeFrom('history');
        } else {
          addTo('history', {plays:1, last_watched_at: new Date().toISOString()});
        }
      };

      scope.toggleCollection = function () {
        if(scope.collectionMatch.length) {
          removeFrom('collection');
        } else {
          addTo('collection', {collected_at: new Date().toISOString()});
        }
      };

      scope.toggleWatchlist = function () {
        if(scope.watchlistMatch.length) {
          removeFrom('watchlist');
        } else {
          addTo('watchlist', {listed_at: new Date().toISOString()});
        }
      };

      $q.all([
          trakt[scope.mediaType].summary(scope.imdb || scope.slug),
          trakt.sync.get('watched', scope.mediaType),
          trakt.sync.get('collection', scope.mediaType),
          trakt.sync.get('watchlist', scope.mediaType)
        ]).then(function(results){
          item = results[0].data;
          var history = results[1].data;
          var collection = results[2].data;
          var watchlist = results[3].data;
          var searchCriteria = {};
          searchCriteria[entity] = {ids : {trakt : item.ids.trakt}};
          scope.historyMatch = arrFilter(history, searchCriteria);
          scope.collectionMatch = arrFilter(collection, searchCriteria);
          scope.watchlistMatch = arrFilter(watchlist, searchCriteria);
          scope.loading = false;
        });
    }
  };
}]);