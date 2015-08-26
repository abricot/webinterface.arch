'use strict';
angular.module('directives.tmdbFanarts', [
  'directives.image',
  'filters.tmdb.image',
  'filters.fallback'
]).directive('tmdbFanarts', ['$filter', '$interval', function ($filter, $interval) {
  return {
    restrict: 'E',
    replace : true,
    templateUrl: 'template/fanarts/fanarts.tpl.html',
    scope: {
      fanarts: '=',
      fanartSize: '=',
      delay : '=',
      primary : '='
    },
    link: function (scope, elem, attrs) {
      var timeoutId = null;
      scope.getImage = function (path) {
        var url = $filter('tmdbImage')(path, scope.fanartSize || 'original');
        return $filter('fallback')(url, 'img/icons/awe-512.png');
      };

      var index = 1;
      var kenBurns = function(){
        var images = elem[0].querySelectorAll('img');
        var length =images.length;
        if(length) {
          images[index-1].className = '';
          if(index===length){ index = 0;}
          images[index].className = 'fx';
          index++;
        }
      };

      scope.$watch('fanarts', function(value) {
        if(value && value.length) {
          if(timeoutId) {
            $interval.cancel(timeoutId);
          }
          timeoutId  = $interval(kenBurns, parseInt(scope.delay) || 30000);
        }
      });

      elem.on('$destroy', function() {
        $interval.cancel(timeoutId);
      });
    }
  };
}]);