"use strict";
angular.module('directives.flipper', [])
.directive('flipper', ['$timeout', function ($timeout) {
  return {
    restrict: 'E',
    transclude : true,
    replace : true,
    templateUrl: 'template/flipper/flipper.tpl.html',
    link: function (scope, elem, attrs) {
      function isTouchDevice() {
        return (('ontouchstart' in window) || 
                (navigator.MaxTouchPoints > 0) || 
                (navigator.msMaxTouchPoints > 0));
      };
      if(isTouchDevice()) {
        scope.flipped = false;
        elem.bind('touchstart', function (evt) {
          evt.stopPropagation();
        });

        elem.bind('click', function (evt) {
          evt.stopPropagation();
        });
        elem.bind('touchend', function (evt) {
          evt.stopPropagation();
          scope.flipped = !scope.flipped;
        });
      }
    }
  };
}]); 