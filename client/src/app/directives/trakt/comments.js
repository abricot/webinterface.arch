"use strict";
angular.module('directives.traktComments', ['filters.unit'])
.directive('traktComments', function () {
  return {
    restrict: 'E',
    replace : true,
    templateUrl: 'template/comments/comments.tpl.html',
    scope: {
      comments: '='
    },
    link: function (scope, elem, attrs) {
    }
  };
}); 