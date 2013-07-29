"use strict";
angular.module('directives.tap', [])
    .directive('ngTap', function () {
        var isTouch = !!('ontouchstart' in window);
        return function (scope, elm, attrs) {
            // if there is no touch available, we'll fall back to click
            if (isTouch) {
                var tapping = false;
                elm.bind('touchstart', function () {
                    tapping = true;
                    elm.addClass('active');
                });
                // prevent firing when someone is f.e. dragging
                elm.bind('touchmove', function () {
                    tapping = false;
                });
                elm.bind('touchend', function () {
                    tapping && scope.$apply(attrs.ngTap);
                    elm.removeClass('active');
                });
            }
            else {
                elm.bind('click', function () {
                    scope.$apply(attrs.ngTap);
                });
            }
        };
    });