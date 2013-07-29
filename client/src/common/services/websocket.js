
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

        factory.connect = function (url, callback) {
            ws = new WebSocket(url);
            ws.onopen = function () {
                isWSConnected = true;
                if (callback) {
                    callback();
                }
            };

            ws.onclose = function () {
                isWSConnected = false;
                console.log('Lost connection retry in 10 sec')
                window.setTimeout(function () {
                    factory.connect(url, callback)
                }.bind(this), 10000);
            };

            ws.onerror = function () {
                isWSConnected = false;
                console.log('Can t connect retry in 10 sec');
                window.setTimeout(function () {
                    factory.connect(url, callback)
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