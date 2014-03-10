angular.module('services.storage', [])
    .provider('storage', function () {
        var asChromeApp = false;
        try {
            asChromeApp = typeof window.localStorage === 'undefined';
        } catch (e) {
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

        this.$get = function () {
          return {
            getItem: this.getItem,
            setItem: this.setItem
          }
        };
    });