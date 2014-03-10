"use strict";
angular.module('services.io', ['services.websocket'])
    .factory('io', ['$rootScope', '$q', '$parse', '$interval', 'websocket',
        function($rootScope, $q, $parse, $interval, websocket) {
            var callbacks = {};
            var currentCallbackId = 0;
            var notifications = {};

            var timeout = 60000;

            // This creates a new callback ID for a request
            function getCallbackId() {
                currentCallbackId += 1;
                if (currentCallbackId > 10000) {
                    currentCallbackId = 0;
                }
                return currentCallbackId;
            }

            function getDefer(id, method, pathExpr) {
                var defer = $q.defer();
                callbacks[id] = {
                    timestamp: Date.now(),
                    cb: defer,
                    parseExpr: pathExpr,
                    method: method
                };
                return defer;
            }

            function onConnected() {
                websocket.subscribe(onMessage.bind(this));
                var onConnectedCallbacks = notifications['Websocket.OnConnected'] || [];
                for (var i = 0; i < onConnectedCallbacks.length; i++) {
                    var cb = onConnectedCallbacks[i];
                    cb.fn.call(cb.scope);
                }
            };

            function onDiconnected() {
                var onDiscConnectedCallbacks = notifications['Websocket.OnDisconnected'] || [];
                for (var i = 0; i < onDiscConnectedCallbacks.length; i++) {
                    var cb = onDiscConnectedCallbacks[i];
                    cb.fn.call(cb.scope);
                }
            };

            function onMessage(event) {
                if (event.data !== '') {
                    console.log(event.data);
                    var data = JSON.parse(event.data);
                    if (callbacks.hasOwnProperty(data.id)) {
                        var cb = callbacks[data.id];
                        var obj = data;
                        if (cb.hasOwnProperty('parseExpr')) {
                            var getter = $parse(cb.parseExpr);
                            obj = getter(data);
                        }
                        $rootScope.$apply(callbacks[data.id].cb.resolve(obj));
                        delete callbacks[data.id];
                    } else if (notifications[data.method] && notifications[data.method].length > 0) {
                        for (var i = 0; i < notifications[data.method].length; i++) {
                            var cb = notifications[data.method][i];
                            $rootScope.$apply(cb.fn.call(cb.scope, data));
                        }
                    }
                }
            };

            function send(method, params, shouldDefer, pathExpr) {
                shouldDefer = shouldDefer || false;
                pathExpr = pathExpr || 'result';

                var request = {
                    'jsonrpc': '2.0',
                    'method': method
                };
                if (params) {
                    request.params = params;
                }
                if (shouldDefer) {
                    request.id = getCallbackId();
                    var defer = getDefer(request.id, method, pathExpr);
                }
                websocket.send(request);
                return shouldDefer ? defer.promise : 0;
            };


            factory.isConnected = function() {
                return websocket.isConnected();
            }

            factory.register = function(method, callback) {
                notifications[method] = notifications[method] || [];
                notifications[method].push(callback);
            }

            factory.unregister = function(method, callback) {
                notifications[method] = notifications[method] || [];
                var indexOf = notifications[method].indexOf(callback);
                if (indexOf > -1) {
                    notifications[method] = notifications[method].splice(indexOf, 1);
                }
            }

            factory.connect = function(url, port) {
                websocket.connect('ws://' + url + ':' + port + '/jsonrpc', onConnected, onDiconnected);
            }

            var canceljob = function() {
                angular.forEach(callbacks, function(callback, key) {
                    var now = Date.now();
                    if (now - callback.timestamp > timeout) {
                        callback.cb.reject();
                        delete callbacks[key];
                    }
                });
            };

            $interval(canceljob, 1000)

            return factory;
        }
    ])