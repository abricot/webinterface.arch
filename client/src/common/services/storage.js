angular.module('services.storage', [])
    .provider('storage', function () {
        var asChromeApp = false;
        if(window.chrome && window.chrome.storage) {
            asChromeApp = true;
        }
        this.getItem = function (key, cb) {
            if(!asChromeApp) {
                cb(window.localStorage.getItem(key));
            } else {
                chrome.storage.local.get(key, function(items){
                    cb(items[key] || null);
                })
            }
        }

        this.setItem = function (key, value) {
            if(!asChromeApp) {
                window.localStorage.setItem(key, value);
            } else {
                var items = {};
                items[key] = value;
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