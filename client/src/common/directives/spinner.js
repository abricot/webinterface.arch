"use strict";
angular.module('directives.spinner', [])
.directive('spinner', function () {
  return {
    restrict: 'E',
    replace : true,
    templateUrl: 'template/spinner/spinner.tpl.html',
    link: function (scope, elem, attrs) {
    }
  };
});