"use strict";
angular.module('directives.onlastrepeat', [])
.directive('onLastRepeat', function () {
  return function(scope, element, attrs) {
    if (scope.$last){
      setTimeout(function(){
        scope.$emit('onRepeatLast', element, attrs);
      }, 1);
    }
  };
});