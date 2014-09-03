"use strict";
angular.module('directives.image', [])
    .directive('image', function () {
        return  {
            restrict: 'A',
            scope: {
                imageSource: '='
            },
            link: function (scope, elem, attrs) {
                var element = elem[0];
                var asChromeApp = false;
                try {
                    asChromeApp = typeof window.localStorage === 'undefined';
                } catch (e) {
                    asChromeApp = true;
                }
                var updateValue = function () {
                    if(asChromeApp) {
                        var remoteImage = new RAL.RemoteImage({
                            element : element,
                            src : scope.imageSource ,
                            width : element.offsetWidth
                        });
                        RAL.Queue.add(remoteImage, true);
                    } else {
                        if(element.tagName.toLowerCase() === 'img') {
                            element.src = scope.imageSource 
                        } else {
                            element.style.backgroundImage = 'url(' + scope.imageSource + ')';
                        } 
                        
                    }
                };
                scope.$watch('imageSource', function (newVal, oldVal) {
                    if (newVal) {
                        updateValue();
                    }
                });
            }
        };
    });