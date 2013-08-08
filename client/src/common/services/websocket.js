
angular.module('services.websocket', [])
    .factory('websocket', function () {
        // We return this object to anything injecting our service
        var factory = {};
        var isWSConnected = false;
        // Create our websocket object with the address to the websocket
        var ws = null;
        factory.isConnected = function () {
            return isWSConnected;
        }

        factory.connect = function (url, connectCallback, disconnectCallback) {
            ws = new WebSocket(url);
            ws.onopen = function () {
                isWSConnected = true;
                if (connectCallback) {
                    connectCallback();
                }
            };

            ws.onclose = function () {
                isWSConnected = false;
                disconnectCallback();
                window.setTimeout(function () {
                    factory.connect(url, connectCallback)
                }.bind(this), 10000);
            };

            ws.onerror = function () {
                isWSConnected = false;
                window.setTimeout(function () {
                    factory.connect(url, connectCallback)
                }.bind(this), 10000);
            };
        };

        factory.disconnect = function () {
            ws.close();
        };

        factory.send = function (request) {
            if (isWSConnected) {
                ws.send(JSON.stringify(request));
            }
        };

        factory.subscribe = function (callback) {
            if (isWSConnected) {
                ws.onmessage = function (evt) {
                    callback(evt);
                }
            }
        }
        return factory;
    })