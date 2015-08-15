"use strict";
angular.module('directives.traktStats', ['filters.unit'])
.directive('traktStats', function () {
  return {
    restrict: 'E',
    replace : true,
    templateUrl: 'template/stats/stats.tpl.html',
    scope: {
      stats: '='
    },
    link: function (scope, elem, attrs) {}
  };
}); 