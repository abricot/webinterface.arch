"use strict";
angular.module('directives.image', [])
    .directive('source', function () {
        return function (scope, elm, attrs) {
            var element = elm[0];
            var asChromeApp = false;
            try {
                asChromeApp = typeof window.localStorage === 'undefined';
            } catch (e) {
                asChromeApp = true;
            }
            if(asChromeApp) {
                var remoteImage = new RAL.RemoteImage({
                    element : element,
                    src : attrs.source,
                    width : element.offsetWidth
                });
                RAL.Queue.add(remoteImage, true);
            } else {
                if(element.tagName.toLowerCase() === 'img') {
                    element.src = attrs.source;
                } else {
                    element.style.backgroundImage = 'url(' + attrs.source + ')';
                } 
                
            }
        };
    });