"use strict";
angular.module('directives.rating', [])
.directive('rating', function () {
  return {
    restrict: 'A',
    templateUrl: 'template/rating/rating.tpl.html',
    scope: {
      ratingValue: '=',
      ratingMax: '='
    },
    link: function (scope, elem, attrs) {
      var updateValue = function () {
        scope.roundedValue = Math.floor(scope.ratingValue * 10 )/10;
      };

      scope.$watch('ratingValue', function (newVal, oldVal) {
        if (newVal) {
          updateValue();
        }
      });
    }
  };
});