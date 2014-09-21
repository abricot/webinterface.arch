
angular.module('services.websocket', [])
.factory('websocket', function () {
  // We return this object to anything injecting our service
  var factory = {};
  var isWSConnected = false;
  var attempts = 1;
  // Create our websocket object with the address to the websocket
  var ws = null;

  function dispose () {
    isWSConnected = false;
  };

  function generateInterval (k) {
    var maxInterval = (Math.pow(2, k) - 1) * 1000;
    if (maxInterval > 60*1000) {
      maxInterval = 60*1000; // If the generated interval is more than 60 seconds, truncate it down to 30 seconds.
    }
      
    // generate the interval to a random number between 0 and the maxInterval determined from above
    return Math.random() * maxInterval; 
  };

  factory.isConnected = function () {
    return isWSConnected;
  }

  factory.connect = function (url, connectCallback, disconnectCallback) {
    ws = new WebSocket(url);
    ws.onopen = function () {
      attempts = 1;
      isWSConnected = true;
      if (connectCallback) {
        connectCallback();
      }
    };

    ws.onclose = function () {
      if(disconnectCallback) {
        disconnectCallback();
      }
      dispose();
      var time = generateInterval(attempts);
      window.setTimeout(function () {
        attempts++;
        factory.connect(url, connectCallback)
      }.bind(this), time);
    };
  };

  factory.disconnect = function () {
    ws.onclose = function(){}
    ws.close();
    dispose();
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
  };

  return factory;
});