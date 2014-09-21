"use strict";
angular.module('directives.flipper', [])
.directive('flipper', ['$timeout', function ($timeout) {
  return {
    restrict: 'E',
    transclude : true,
    replace : true,
    template: '<div class="flipper" ng-transclude ng-class="{flipped : flipped}"></div>',
    link: function (scope, elem, attrs) {
      scope.flipped = false;
      elem.bind('touchstart', function (evt) {
        evt.stopPropagation();
      });
      elem.bind('touchend', function (evt) {
        evt.stopPropagation();
        if(!scope.flipped) {
          scope.flipped = !scope.flipped;
          $timeout(function(){scope.flipped = false}, 1000);
        }
      });
    }
  };
}]); 