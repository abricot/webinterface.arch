"use strict";
angular.module('directives.hold', [])
.directive('ngHold', ['$parse', '$interval', function ($parse, $interval) {
  var isTouch = !!('ontouchstart' in window);
  var promise = null;
  return  {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var promise = null;;
      var  clickHandler = $parse(attrs.ngHold);

      var down = function () {
        if(promise === null) {
          promise = $interval(function() {
            clickHandler(scope);
          }, 100);
        }
      };

      var up = function () {
        $interval.cancel(promise);
        promise = null;
      };

      // if there is no touch available, we'll fall back to click
      if (isTouch) {
        element.bind('touchstart', down);
        element.bind('touchleave', up);
        element.bind('touchend', up);
      } else {
        element.bind('mousedown', down);
        element.bind('mouseup', up);
      }
    }
  };
}]);