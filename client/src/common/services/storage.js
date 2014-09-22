angular.module('services.storage', [])
.factory('storage', [ '$q', '$timeout', function ($q, $timeout) {
  var factory = {};
  var asChromeApp = false;
  if(window.chrome && window.chrome.storage) {
    asChromeApp = true;
  }

  var toObject = function (jsonStr) {
    var obj = null;
    if(jsonStr !== null && typeof jsonStr !== 'undefined') {
      obj = JSON.parse(jsonStr);
    }
    return obj;
  };

  var toJSON = function (obj) {
    return JSON.stringify(obj);
  };

  factory.getItem = function (key) {
    var defer = $q.defer();
    if(!asChromeApp) {
      $timeout(function(){
        defer.resolve(toObject(window.localStorage.getItem(key)));
      }, 100);
    } else {
      chrome.storage.local.get(key, function(items){
        defer.resolve(toObject(items[key] || null));
      });
    }
    return defer.promise;
  };

  factory.setItem = function (key, value) {
    if(!asChromeApp) {
      window.localStorage.setItem(key, toJSON(value));
    } else {
      var items = {};
      items[key] = toJSON(value);
      chrome.storage.local.set(items);
    }
  };

  factory.removeItem = function (key) {
    if(!asChromeApp) {
      window.localStorage.removeItem(key);
    } else {
      chrome.storage.local.remove(key);
    }
  };

  return factory;
}]);