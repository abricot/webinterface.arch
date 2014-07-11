"use strict";
angular.module('directives.tap', [])
    .directive('ngTap', ['$interval', function ($interval) {
        var isTouch = !!('ontouchstart' in window);
        var promise = null;
        return  {
            restrict: 'A',
            scope : {
                holdTrigger : '=',
                ngTap : '&'
            },
            link: function (scope, elm, attrs) {
                // if there is no touch available, we'll fall back to click
                if (isTouch) {
                    var THRESHOLD = 5;
                    var start;
                    var  coordinates = function (t) {
                        return Object.freeze({
                            screenX: t.screenX,
                            screenY: t.screenY,
                            clientX: t.clientX,
                            clientY: t.clientY
                        });
                    }
                    elm.bind('touchstart', function (evt) {
                        start = coordinates(evt.touches[0]);
                        elm.addClass('active');
                    });

                    elm.bind('touchend', function (evt) {
                        var end = coordinates(evt.changedTouches[0]);
                        var tapping  = Math.abs(end.screenX - start.screenX)  < THRESHOLD &&
                                       Math.abs(end.screenY - start.screenY)  < THRESHOLD;
                        if(tapping) {
                            scope.$apply(attrs.ngTap);
                        }
                        elm.removeClass('active');
                    });
                }
                else {
                    elm.bind('mousedown', function () {
                        elm.addClass('active');
                        if(scope.holdTrigger) {
                            promise = $interval(scope.ngTap, 100);
                        }
                    });
                    elm.bind('mouseup', function () {
                        elm.removeClass('active');
                        if(promise !== null) {
                            $interval.cancel(promise);
                        }
                    });
                    elm.bind('click', function () {
                        scope.ngTap();
                    });
                }
            }
        };
    }]);