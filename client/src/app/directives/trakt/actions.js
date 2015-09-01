"use strict";
angular.module('directives.traktActions', ['services.trakt'])
.directive('traktActions', ['$filter', 'trakt', function ($filter, trakt) {
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
      scope.isInHistory = false;


      trakt[scope.mediaType].summary(scope.imdb).then(function(result){
        item = result.data;
        trakt.sync.get('history', scope.mediaType).then(function(result){
          history = result.data;
          arrFilter(history, {})
        })
      });
    }
  };
}]);