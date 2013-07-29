"use strict";
angular.module('services.xbmc.mock', [])
    .factory('xbmc', ['$rootScope', '$q', '$http', '$parse',
        function ($rootScope, $q, $http, $parse) {
            // We return this object to anything injecting our service
            var factory = {};
            var isConnected = false;
            factory.isConnected = function () {
                return isConnected;
            }

            factory.register = function (method, callback) {

            }

            factory.send = function (method, params, shouldDefer, pathExpr) {
                var defer = $q.defer();
                $http.get('/app/data/' + method + '.json').success(function (data) {
                    var obj = data;
                    if (pathExpr) {
                        var getter = $parse(pathExpr);
                        obj = getter(data);
                    } else {
                        obj = data;
                    }
                    window.setTimeout(function () {
                        $rootScope.$apply(function () {
                            defer.resolve(obj);
                        });
                    }, Math.round(Math.random() * 5000))
                });
                return defer.promise;
            }

            factory.unregister = function (method, callback) {

            }

            factory.connect = function () {
                isConnected = true;
            }

            return factory;
        }
    ])