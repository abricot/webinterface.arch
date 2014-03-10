"use strict";
angular.module('directives.image', [])
    .directive('source', function () {
        return function (scope, elm, attrs) {
            var asChromeApp = false;
            try {
                asChromeApp = typeof window.localStorage === 'undefined';
            } catch (e) {
                asChromeApp = true;
            }
            if(asChromeApp) {
                var remoteImage = new RAL.RemoteImage({
                    element : elm[0],
                    src : attrs.source,
                    width : elm[0].offsetWidth
                });
                RAL.Queue.add(remoteImage, true);
            } else {
                elm[0].src = attrs.source;
            }
        };
    });