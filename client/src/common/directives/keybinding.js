"use strict";
angular.module('directives.keybinding', [])
    .directive('keybinding', function () {
    return {
        restrict: 'E',
        link: function (scope, el, attrs) {
            var fn = function (e) {
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    // internet explorer
                    e.returnValue = false;
                }
                scope.$apply(attrs.invoke);
            };
            Mousetrap.bind(attrs.on, fn);
            el.on('$destroy', function() {
                Mousetrap.unbind(attrs.on);
            });
        }
    };
});