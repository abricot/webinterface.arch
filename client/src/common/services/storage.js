angular.module('services.storage', [])
.provider('storage', function () {
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

  this.getItem = function (key, cb) {
    if(!asChromeApp) {
      cb(toObject(window.localStorage.getItem(key)));
    } else {
      chrome.storage.local.get(key, function(items){
        cb(toObject(items[key] || null));
      })
    }
  };

  this.setItem = function (key, value) {
    if(!asChromeApp) {
      window.localStorage.setItem(key, toJSON(value));
    } else {
      var items = {};
      items[key] = toJSON(value);
      chrome.storage.local.set(items);
    }
  };

  this.removeItem = function (key) {
    if(!asChromeApp) {
      window.localStorage.removeItem(key);
    } else {
      chrome.storage.local.remove(key);
    }
  };

  this.$get = function () {
    return {
      getItem: this.getItem,
      setItem: this.setItem,
      removeItem: this.removeItem
    }
  };
});