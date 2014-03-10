angular.module('services.storage', [])
    .provider('storage', function () {
        var runInChrome = false;
        try {
            runInChrome = typeof window.localStorage === 'undefined';
        } catch (e) {
            runInChrome = true;
        }
        this.getItem = function (key, cb) {
            if(!runInChrome) {
                cb(window.localStorage.getItem(key));
            } else {
                chrome.storage.local.get(key, function(items){
                    cb(items[key] || null);
                })
            }
        }

        this.setItem = function (key, value) {
             if(!runInChrome) {
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