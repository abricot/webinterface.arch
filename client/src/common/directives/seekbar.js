"use strict";
angular.module('directives.seekbar', [])
    .directive('seekbar', function ($document) {
        return {
            restrict: 'A',
            template: '<progress max="{{seekbarMax}}"></progress>' +
                '<button></button>',
            scope: {
                seekbarValue: '=',
                seekbarMax: '=',
                onSeekbarChanged: '&'
            },
            link: function (scope, elem, attrs) {
                var thumb = elem.find('button');
                var progress = elem.find('progress');
                var body = angular.element(document).find('body');
                var moving = false;
                var newValue = -1;

                var offset = function (el) {
                    var offsetLeft = el.prop('offsetLeft');
                    var offsetTop = el.prop('offsetTop');
                    var tmp = el;
                    var position;
                    var hasParent = true;
                    while (hasParent) {
                        tmp = tmp.parent();
                        if (tmp[0].nodeName.toLowerCase() === 'body') {
                            hasParent = false;
                        } else {
                            position = getComputedStyle(tmp[0]).position;
                            if (position === 'relative' || position === 'absolute' || position === 'fixed') {
                                offsetLeft += tmp.prop('offsetLeft');
                                offsetTop += tmp.prop('offsetTop');
                            }
                        }
                    }
                    return {left: offsetLeft, top: offsetTop};
                }

                var update = function (value) {
                    thumb.css('left', value + '%');
                    progress.attr('value', Math.round(value));
                }

                progress.bind('click touchstart', function (evt) {
                    evt.stopPropagation();
                    var target = evt.touches ? evt.touches[0] : evt;
                    var x = target.clientX;
                    var percent = (x - offset(progress).left) / progress.prop('offsetWidth');
                    if (percent < 0)
                        percent = 0;
                    if (percent > 1)
                        percent = 1;
                    update(scope.seekbarMax * percent);
                    scope.onSeekbarChanged({newValue: parseInt(progress.attr('value'))});
                });

                thumb.bind('mousedown touchstart', function (evt) {
                    evt.stopPropagation();
                    thumb.addClass('active');
                    moving = true;
                });
                var onMove = function (evt) {
                    evt.stopPropagation();
                    if (moving) {
                        var target = evt.touches ? evt.touches[0] : evt;
                        var x = target.clientX;
                        var percent = (x - offset(progress).left) / progress.prop('offsetWidth');
                        if (percent < 0)
                            percent = 0;
                        if (percent > 1)
                            percent = 1;
                        update(scope.seekbarMax * percent);
                    }
                };
                thumb.bind('touchmove', onMove);
                body.bind('mousemove', onMove);

                var onMoveEnd = function () {
                    if(moving) {
                        scope.onSeekbarChanged({newValue: parseInt(progress.attr('value'))});
                        moving = false;
                        thumb.removeClass('active');
                    }
                }
                thumb.bind('touchend', onMoveEnd);
                body.bind('mouseup', onMoveEnd);
                scope.$watch('seekbarValue', function (newVal, oldVal) {
                    if (newVal && !moving) {
                        scope.seekbarValue = newVal;
                        update(newVal);
                    }
                });
            }
        }
    });