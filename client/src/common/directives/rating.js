"use strict";
angular.module('directives.rating', [])
.directive('rating', function () {
  return {
    restrict: 'A',
    template: '<div class="md-circle rating">' +
    '<div class="value">{{roundedValue}}</div>' +
    '<i class="star icon-star left"></i>'+
    '<i class="star icon-star middle"></i>'+
    '<i class="star icon-star right"></i>'+
    '</div>',
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