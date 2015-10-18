/*! webinterface.arch - v2.0.3 - 2015-10-18
 * Copyright (c) 2015 Nicolas ABRIC;
 * Licensed MIT
 */
var RAL = {
    debug: !1
};
RAL.Heap = function() {
    this.items = []
}, RAL.Heap.prototype = {
    getNextHighestPriority: function() {
        var e = 1;
        return this.items[0] && (e = this.items[0].priority + 1), e
    },
    parentIndex: function(e) {
        return Math.floor(.5 * e)
    },
    leftChildIndex: function(e) {
        return 2 * e
    },
    rightChildIndex: function(e) {
        return 2 * e + 1
    },
    get: function(e) {
        var t = null;
        return e >= 1 && this.items[e - 1] && (t = this.items[e - 1]), t
    },
    set: function(e, t) {
        this.items[e - 1] = t
    },
    swap: function(e, t) {
        var n = this.get(e);
        this.set(e, this.get(t)), this.set(t, n)
    },
    upHeap: function(e) {
        var t = null,
            n = null,
            i = null,
            o = !1;
        do o = !1, i = this.parentIndex(e), t = this.get(e), n = this.get(i), o = null !== n && t.priority > n.priority, o && (this.swap(e, i), e = i); while (o)
    },
    downHeap: function(e) {
        var t = null,
            n = null,
            i = null,
            o = null,
            r = null,
            s = null,
            a = !1;
        do a = !1, o = this.leftChildIndex(e), r = this.rightChildIndex(e), t = this.get(e) && this.get(e).priority, n = this.get(o) && this.get(o).priority, i = this.get(r) && this.get(r).priority, null === n && (n = Number.NEGATIVE_INFINITY), null === i && (i = Number.NEGATIVE_INFINITY), s = Math.max(n, i), s > t && (i === s ? (this.swap(e, r), e = r) : (this.swap(e, o), e = o), a = !0); while (a)
    },
    add: function(e) {
        this.items.push(e), this.upHeap(this.items.length)
    },
    remove: function() {
        var e = null;
        return this.items.length && (this.swap(1, this.items.length), e = this.get(this.items.length), this.items.length -= 1, this.downHeap(1)), e
    }
}, RAL.Sanitiser = function() {
    function e(e) {
        return e.replace(/.*?:\/\//, "", e)
    }
    return {
        cleanURL: e
    }
}(), RAL.CacheParser = function() {
    function e(e) {
        var t = /max\-age=(\d+)/gi,
            n = /Cache-Control:.*?no\-cache/gi,
            i = /Cache-Control:.*?no\-store/gi,
            o = /Cache-Control:.*?must\-revalidate/gi,
            r = /Expires:\s(.*)/gi,
            s = [],
            a = t.exec(e),
            l = Date.now();
        return i.test(e) && s.push("Cache-Control: no-store is set"), n.test(e) && s.push("Cache-Control: no-cache is set"), o.test(e) && s.push("Cache-Control: must-revalidate is set"), null !== a ? l = Date.now() + 1e3 * a[1] : (a = r.exec(e), null !== a ? l = Date.parse(a[1]) : s.push("Cache-Control: max-age and Expires: headers are not set")), {
            headers: e,
            cacheable: 0 === s.length,
            useBy: l,
            warnings: s
        }
    }
    return {
        parse: e
    }
}(), RAL.FileSystem = function() {
    function e() {
        return l
    }

    function t(e) {
        c.push(e)
    }

    function n(e, t, n) {
        l && (e = RAL.Sanitiser.cleanURL(e), h.getFile(e, {}, function(e) {
            t(e.toURL())
        }, n))
    }

    function i(e, t, n) {
        l && (e = RAL.Sanitiser.cleanURL(e), h.getFile(e, {}, function(e) {
            e.file(function(e) {
                var n = new FileReader;
                n.onloadend = function() {
                    t(this.result)
                }, n.readAsText(e)
            })
        }, n))
    }

    function o(e, t, n) {
        if (l) {
            e = RAL.Sanitiser.cleanURL(e);
            var i = e.split("/");
            i.pop(), r(h, i, function() {
                h.getFile(e, {
                    create: !0
                }, function(e) {
                    e.createWriter(function(i) {
                        i.onwriteend = function() {
                            i.onwriteend = function() {
                                n(e.toURL())
                            }, i.truncate(t.size)
                        }, i.onerror = function(e) {
                            console.warn("Write failed: " + e.toString())
                        }, i.write(t)
                    }, u.onError)
                }, u.onError)
            })
        }
    }

    function r(e, t, n) {
        ("." === t[0] || "" === t[0]) && (t = t.slice(1)), t.length ? e.getDirectory(t[0], {
            create: !0
        }, function(e) {
            t.length && r(e, t.slice(1), n)
        }, u.onError) : n()
    }

    function s(e, t, n) {
        l && h.getDirectory(e, {}, function(e) {
            e.removeRecursively(t, u.onError)
        }, n || u.onError)
    }

    function a(e, t, n) {
        l && h.getFile(e, {}, function(e) {
            e.remove(t, u.onError)
        }, n || u.onError)
    }
    var l = !1,
        c = [],
        h = null,
        u = {
            onError: function(e) {
                var t = "";
                switch (e.code) {
                    case FileError.QUOTA_EXCEEDED_ERR:
                        t = "QUOTA_EXCEEDED_ERR";
                        break;
                    case FileError.NOT_FOUND_ERR:
                        t = "NOT_FOUND_ERR";
                        break;
                    case FileError.SECURITY_ERR:
                        t = "SECURITY_ERR";
                        break;
                    case FileError.INVALID_MODIFICATION_ERR:
                        t = "INVALID_MODIFICATION_ERR";
                        break;
                    case FileError.INVALID_STATE_ERR:
                        t = "INVALID_STATE_ERR";
                        break;
                    default:
                        t = "Unknown Error"
                }
                console.error("Error: " + t, e)
            },
            onInitialised: function(e) {
                if (h = e.root, l = !0, c.length)
                    for (var t = c.length; t--;) c[t]()
            }
        };
    return function(e) {
        e = e || 10, window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem, window.resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL, window.requestFileSystem && window.requestFileSystem(window.TEMPORARY, 1024 * 1024 * e, u.onInitialised, u.onError)
    }(), {
        isReady: e,
        registerOnReady: t,
        getPath: n,
        getDataAsText: i,
        set: o,
        removeFile: a,
        removeDir: s
    }
}(), RAL.FileManifest = function() {
    function e() {
        return h
    }

    function t(e) {
        u.push(e)
    }

    function n(e, t) {
        var n = RAL.Sanitiser.cleanURL(e),
            i = c[n] || null;
        t(i)
    }

    function i(e, t, n) {
        var i = RAL.Sanitiser.cleanURL(e);
        c[i] = t, a(n)
    }

    function o() {
        c = {}, a()
    }

    function r() {
        s("{}")
    }

    function s(e) {
        if (h = !0, c = JSON.parse(e), u.length)
            for (var t = u.length; t--;) u[t]()
    }

    function a(e) {
        var t = new Blob([JSON.stringify(c)], {
            type: "application/json"
        });
        RAL.FileSystem.set("manifest.json", t, function() {
            e && e()
        })
    }

    function l() {
        RAL.FileSystem.getDataAsText("manifest.json", s, r)
    }
    var c = null,
        h = !1,
        u = [];
    return RAL.FileSystem.isReady() ? l() : RAL.FileSystem.registerOnReady(l), {
        isReady: e,
        registerOnReady: t,
        get: n,
        set: i,
        reset: o
    }
}(), RAL.RemoteFile = function() {}, RAL.RemoteFile.prototype = {
    element: null,
    src: null,
    autoLoad: !1,
    ignoreCacheHeaders: !1,
    timeToLive: 12096e5,
    priority: 0,
    loaded: !1,
    wURL: window.URL || window.webkitURL,
    callbacks: {
        onCacheError: function(e) {
            e.src = this.src, this.sendEvent("cacheerror", e)
        },
        onRemoteFileLoaded: function(e, t) {
            if (this.ignoreCacheHeaders && (t.cacheable = !0, t.useBy += this.timeToLive), t.cacheable) RAL.FileSystem.set(this.src, e, this.callbacks.onFileSystemSet.bind(this, t));
            else {
                var n = this.wURL.createObjectURL(e);
                this.callbacks.onLocalFileLoaded.call(this, n), this.callbacks.onCacheError.call(this, t)
            }
            this.sendEvent("remoteloaded", t)
        },
        onRemoteFileUnavailable: function() {
            this.sendEvent("remoteunavailable")
        },
        onLocalFileLoaded: function(e) {
            this.loaded = !0, this.sendEvent("loaded", e)
        },
        onLocalFileUnavailable: function() {
            this.showPlaceholder(), this.loadFromRemote(), this.sendEvent("localunavailable")
        },
        onFileSystemSet: function(e) {
            RAL.FileManifest.set(this.src, e, this.callbacks.onFileManifestSet.bind(this))
        },
        onFileManifestSet: function() {
            this.load()
        },
        onFileManifestGet: function(e) {
            var t = Date.now();
            null !== e ? e.useBy > t || !RAL.NetworkMonitor.isOnline() ? RAL.FileSystem.getPath(this.src, this.callbacks.onLocalFileLoaded.bind(this), this.callbacks.onLocalFileUnavailable.bind(this)) : this.loadFromRemote() : this.loadFromRemote()
        }
    },
    sendEvent: function(e, t) {
        this.checkForElement();
        var n = document.createEvent("Event");
        n.initEvent(e, !0, !0), t && (n.data = t), this.element.dispatchEvent(n)
    },
    loadFromRemote: function() {
        RAL.Loader.load(this.src, "blob", this.callbacks.onRemoteFileLoaded.bind(this), this.callbacks.onRemoteFileUnavailable.bind(this)), this.sendEvent("remoteloadstart")
    },
    load: function() {
        RAL.FileManifest.get(this.src, this.callbacks.onFileManifestGet.bind(this))
    },
    checkForElement: function() {
        this.element || (this.element = document.createElement("span"))
    },
    addEventListener: function(e, t, n) {
        this.checkForElement(), this.element.addEventListener(e, t, n)
    }
}, RAL.RemoteImage = function(e) {
    RAL.RemoteFile.call(this), e = e || {}, this.element = e.element || document.createElement("img"), this.src = this.element.dataset.src || e.src, this.width = this.element.width || e.width || null, this.height = this.element.height || e.height || null, this.placeholder = this.element.dataset.placeholder || null, this.priority = e.priority || 0, this.addEventListener("remoteloadstart", this.showPlaceholder.bind(this)), this.addEventListener("loaded", this.showImage.bind(this)), "undefined" != typeof e.autoLoad && (this.autoLoad = e.autoLoad), "undefined" != typeof e.ignoreCacheHeaders && (this.ignoreCacheHeaders = e.ignoreCacheHeaders), this.ignoreCacheHeaders && "undefined" != typeof this.timeToLive && (this.timeToLive = e.timeToLive), this.autoLoad ? this.load() : this.showPlaceholder()
}, RAL.RemoteImage.prototype = new RAL.RemoteFile, RAL.RemoteImage.prototype.showPlaceholder = function() {
    null !== this.placeholder && (this.element.style["-webkit-transition"] = "background-image 0.5s ease-out", this.showImage({
        data: this.placeholder
    }))
}, RAL.RemoteImage.prototype.showImage = function(e) {
    var t = e.data,
        n = new Image,
        i = function(e) {
            this.wURL.revokeObjectURL(e)
        }.bind(this, t),
        o = function() {
            var e = this.width || n.naturalWidth,
                o = this.height || n.naturalHeight;
            this.element.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", this.element.style.backgroundImage = "url(" + t + ")", /blob:/.test(t) && setTimeout(i, 100)
        };
    n.onload = o.bind(this), n.src = t
}, RAL.Loader = function() {
    function e(e, t, n, i) {
        e.abort(), this.load(t, n, i)
    }

    function t(i, o, r, s) {
        if (RAL.NetworkMonitor.isOnline()) {
            var a = new XMLHttpRequest;
            a.responseType = o, a.onerror = n.onError.bind(this, s), a.onload = n.onLoad.bind(this, i, r, s);
            if(RAL.authorization) {
             a.open("GET", i, !0, RAL.authorization.username, RAL.authorization.password);
            } else {
             a.open("GET", i, !0);
            }
            a.send(), RAL.NetworkMonitor.registerForOffline(e.bind(this, a, i, r, s))
        } else RAL.NetworkMonitor.registerForOnline(t.bind(this, i, r, s))
    }
    var n = {
        onLoad: function(e, t, n, i) {
            var o = i.target,
                r = o.response,
                s = RAL.CacheParser.parse(o.getAllResponseHeaders());
            4 === o.readyState && (200 === o.status ? t(r, s) : n(i))
        },
        onError: function(e, t) {
            e(t)
        }
    };
    return {
        load: t
    }
}(), RAL.NetworkMonitor = function() {
    function e(e) {
        i.push(e)
    }

    function t(e) {
        o.push(e)
    }

    function n() {
        return window.navigator.onLine
    }
    var i = [],
        o = [];
    return window.addEventListener("online", function() {
        for (var e = i.length, t = null; e--;) t = i.pop(), t()
    }), window.addEventListener("offline", function() {
        for (var e = o.length, t = null; e--;) t = o.pop(), t()
    }), {
        registerForOnline: e,
        registerForOffline: t,
        isOnline: n
    }
}(), RAL.Queue = function() {
    function e() {
        return r.getNextHighestPriority()
    }

    function t(e) {
        a = e
    }

    function n(e, t) {
        "undefined" == typeof e.priority && (e.priority = r.getNextHighestPriority()), r.add(e), t && i()
    }

    function i() {
        for (; a > s;) {
            if (nextFile = r.remove(), null === nextFile) {
                RAL.debug && console.log("[Connections: " + s + "] - No more images queued");
                break
            }
            nextFile.addEventListener("loaded", l.onFileLoaded), nextFile.load(), RAL.debug && console.log("[Connections: " + s + "] - Loading " + nextFile.src), s++
        }
    }

    function o() {
        r.clear()
    }
    var r = new RAL.Heap,
        s = 0,
        a = 6,
        l = {
            onFileLoaded: function() {
                RAL.debug && console.log("[Connections: " + s + "] - File loaded"), s--, i()
            }
        };
    return {
        getNextHighestPriority: e,
        setMaxConnections: t,
        add: n,
        clear: o,
        start: i
    }
}();

/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.10.0 - 2014-01-14
 * License: MIT
 */
angular.module("ui.bootstrap", ["ui.bootstrap.timepicker"]);
angular.module('ui.bootstrap.timepicker', [])

.constant('timepickerConfig', {
  hourStep: 1,
  minuteStep: 1,
  showMeridian: true,
  meridians: null,
  readonlyInput: false,
  mousewheel: true
})

.directive('timepicker', ['$parse', '$log', 'timepickerConfig', '$locale', function ($parse, $log, timepickerConfig, $locale) {
  return {
    restrict: 'EA',
    require:'?^ngModel',
    replace: true,
    scope: {},
    templateUrl: 'template/timepicker/timepicker.html',
    link: function(scope, element, attrs, ngModel) {
      if ( !ngModel ) {
        return; // do nothing if no ng-model
      }

      var selected = new Date(),
          meridians = angular.isDefined(attrs.meridians) ? scope.$parent.$eval(attrs.meridians) : timepickerConfig.meridians || $locale.DATETIME_FORMATS.AMPMS;

      var hourStep = timepickerConfig.hourStep;
      if (attrs.hourStep) {
        scope.$parent.$watch($parse(attrs.hourStep), function(value) {
          hourStep = parseInt(value, 10);
        });
      }

      var minuteStep = timepickerConfig.minuteStep;
      if (attrs.minuteStep) {
        scope.$parent.$watch($parse(attrs.minuteStep), function(value) {
          minuteStep = parseInt(value, 10);
        });
      }

      // 12H / 24H mode
      scope.showMeridian = timepickerConfig.showMeridian;
      if (attrs.showMeridian) {
        scope.$parent.$watch($parse(attrs.showMeridian), function(value) {
          scope.showMeridian = !!value;

          if ( ngModel.$error.time ) {
            // Evaluate from template
            var hours = getHoursFromTemplate(), minutes = getMinutesFromTemplate();
            if (angular.isDefined( hours ) && angular.isDefined( minutes )) {
              selected.setHours( hours );
              refresh();
            }
          } else {
            updateTemplate();
          }
        });
      }

      // Get scope.hours in 24H mode if valid
      function getHoursFromTemplate ( ) {
        var hours = parseInt( scope.hours, 10 );
        var valid = ( scope.showMeridian ) ? (hours > 0 && hours < 13) : (hours >= 0 && hours < 24);
        if ( !valid ) {
          return undefined;
        }

        if ( scope.showMeridian ) {
          if ( hours === 12 ) {
            hours = 0;
          }
          if ( scope.meridian === meridians[1] ) {
            hours = hours + 12;
          }
        }
        return hours;
      }

      function getMinutesFromTemplate() {
        var minutes = parseInt(scope.minutes, 10);
        return ( minutes >= 0 && minutes < 60 ) ? minutes : undefined;
      }

      function pad( value ) {
        return ( angular.isDefined(value) && value.toString().length < 2 ) ? '0' + value : value;
      }

      // Input elements
      var inputs = element.find('input'), hoursInputEl = inputs.eq(0), minutesInputEl = inputs.eq(1);

      // Respond on mousewheel spin
      var mousewheel = (angular.isDefined(attrs.mousewheel)) ? scope.$eval(attrs.mousewheel) : timepickerConfig.mousewheel;
      if ( mousewheel ) {

        var isScrollingUp = function(e) {
          if (e.originalEvent) {
            e = e.originalEvent;
          }
          //pick correct delta variable depending on event
          var delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
          return (e.detail || delta > 0);
        };

        hoursInputEl.bind('mousewheel wheel', function(e) {
          scope.$apply( (isScrollingUp(e)) ? scope.incrementHours() : scope.decrementHours() );
          e.preventDefault();
        });

        minutesInputEl.bind('mousewheel wheel', function(e) {
          scope.$apply( (isScrollingUp(e)) ? scope.incrementMinutes() : scope.decrementMinutes() );
          e.preventDefault();
        });
      }

      scope.readonlyInput = (angular.isDefined(attrs.readonlyInput)) ? scope.$eval(attrs.readonlyInput) : timepickerConfig.readonlyInput;
      if ( ! scope.readonlyInput ) {

        var invalidate = function(invalidHours, invalidMinutes) {
          ngModel.$setViewValue( null );
          ngModel.$setValidity('time', false);
          if (angular.isDefined(invalidHours)) {
            scope.invalidHours = invalidHours;
          }
          if (angular.isDefined(invalidMinutes)) {
            scope.invalidMinutes = invalidMinutes;
          }
        };

        scope.updateHours = function() {
          var hours = getHoursFromTemplate();

          if ( angular.isDefined(hours) ) {
            selected.setHours( hours );
            refresh( 'h' );
          } else {
            invalidate(true);
          }
        };

        hoursInputEl.bind('blur', function(e) {
          if ( !scope.validHours && scope.hours < 10) {
            scope.$apply( function() {
              scope.hours = pad( scope.hours );
            });
          }
        });

        scope.updateMinutes = function() {
          var minutes = getMinutesFromTemplate();

          if ( angular.isDefined(minutes) ) {
            selected.setMinutes( minutes );
            refresh( 'm' );
          } else {
            invalidate(undefined, true);
          }
        };

        minutesInputEl.bind('blur', function(e) {
          if ( !scope.invalidMinutes && scope.minutes < 10 ) {
            scope.$apply( function() {
              scope.minutes = pad( scope.minutes );
            });
          }
        });
      } else {
        scope.updateHours = angular.noop;
        scope.updateMinutes = angular.noop;
      }

      ngModel.$render = function() {
        var date = ngModel.$modelValue ? new Date( ngModel.$modelValue ) : null;

        if ( isNaN(date) ) {
          ngModel.$setValidity('time', false);
          $log.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
        } else {
          if ( date ) {
            selected = date;
          }
          makeValid();
          updateTemplate();
        }
      };

      // Call internally when we know that model is valid.
      function refresh( keyboardChange ) {
        makeValid();
        ngModel.$setViewValue( new Date(selected) );
        updateTemplate( keyboardChange );
      }

      function makeValid() {
        ngModel.$setValidity('time', true);
        scope.invalidHours = false;
        scope.invalidMinutes = false;
      }

      function updateTemplate( keyboardChange ) {
        var hours = selected.getHours(), minutes = selected.getMinutes();

        if ( scope.showMeridian ) {
          hours = ( hours === 0 || hours === 12 ) ? 12 : hours % 12; // Convert 24 to 12 hour system
        }
        scope.hours =  keyboardChange === 'h' ? hours : pad(hours);
        scope.minutes = keyboardChange === 'm' ? minutes : pad(minutes);
        scope.meridian = selected.getHours() < 12 ? meridians[0] : meridians[1];
      }

      function addMinutes( minutes ) {
        var dt = new Date( selected.getTime() + minutes * 60000 );
        selected.setHours( dt.getHours(), dt.getMinutes() );
        refresh();
      }

      scope.incrementHours = function() {
        addMinutes( hourStep * 60 );
      };
      scope.decrementHours = function() {
        addMinutes( - hourStep * 60 );
      };
      scope.incrementMinutes = function() {
        addMinutes( minuteStep );
      };
      scope.decrementMinutes = function() {
        addMinutes( - minuteStep );
      };
      scope.toggleMeridian = function() {
        addMinutes( 12 * 60 * (( selected.getHours() < 12 ) ? 1 : -1) );
      };
    }
  };
}]);

"use strict";
RAL.FileManifest.reset();

angular.module('app', [
  'ngAnimate',
  'ngTouch',
  'ui.state',
  'ui.bootstrap',
  'directives.image',
  'directives.flipper',
  'directives.hold',
  'directives.keybinding',
  'directives.rating',
  'directives.seekbar',
  'directives.streamdetails',
  'directives.spinner',
  'directives.onlastrepeat',
  'directives.noSource',
  'directives.tmdbFanarts',
  'directives.traktComments',
  'directives.traktStats',
  'directives.traktActions',
  'filters.xbmc',
  'filters.tmdb',
  'filters.fallback',
  'services.xbmc',
  'services.tmdb',
  'services.trakt',
  'services.helper',
  'services.storage',
  'templates.abricot',
  'templates.app',
  'lrInfiniteScroll'
  ]);

// this is where our app definition is
angular.module('app')
.config(['$stateProvider', '$urlRouterProvider' ,
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/movies/recents");
  }
])
.controller('AppCtrl', ['$scope', '$rootScope', '$state', '$location', '$filter',
  '$interpolate', 'helper', 'xbmc', 'storage', 'tmdb', 'trakt',
  function($scope, $rootScope, $state, $location, $filter, $interpolate, helper, xbmc, storage, tmdb, trakt) {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-66170707-1', 'auto');
    ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
    ga('require', 'displayfeatures');

    $scope.theme = 'yang';
    storage.getItem('theme', function(theme) {
      $scope.theme = theme;
    });
    $scope.$state = $state;
    $scope.connected = false;
    $scope.initialized = true;
    $scope.isMaximized = false;
    $scope.isSupportVisible = false;
    $scope.application = {};
    $scope.player = {
      id: -1,
      active: false,
      audiostreams: [],
      current: {},
      intervalId: -1,
      item: {},
      seek: {},
      speed: 0,
      subtitles: [],
      type: ''
    };
    $scope.playlist = -1;
    $scope.library = {
      item: {},
      criteria: ''
    };

    $scope.isExternalAddonAvailable = false;

    $scope.hosts = [];
    $scope.host = null;
    $scope.webserverURL = 'about:blank';
    $scope.xbmc = xbmc;
    $scope.tmdb = tmdb;
    $scope.trakt = trakt;
    $scope.helper = helper;
    $scope.helper.setProviders({xbmc : $scope.xbmc, tmdb : $scope.tmdb});

    $scope.studioFn = $interpolate('https://cdn.rawgit.com/ccMatrix/StudioLogos/master/161x109_mono_png/{{studio}}.png');
    $scope.languageFn = $interpolate('https://cdn.rawgit.com/BigNoid/Aeon-Nox/master/media/flags/subtitles/flags/{{language}}.png')
    $scope.back = function() {
      $scope.go($scope.previousHash);
    };

    $scope.go = function(path) {
      if ($scope.isMaximized) {
        $scope.isMaximized = !$scope.isMaximized;
      }
      $location.path(path);
    };

    $scope.hasFooter = function() {
      return $scope.$state.current.views && $scope.$state.current.views.footer;
    };

    $scope.initialize = function(host) {
      if($scope.xbmc.isConnected()) {
        $scope.xbmc.disconnect();
      }
      $scope.xbmc.connect(host.ip, host.port);
      $scope.initialized = true;
      var hash = window.location.hash;
      var path = hash.replace('#', '');
      $scope.go(path === '' ? '/' : path);
    };

    $scope.isConnected = function() {
      return xbmc.isConnected()
    };

    $scope.isPlaying = function (id) {
      return  $scope.player && $scope.player.item  && $scope.player.item.id === id;
    };

    $scope.toggleDrawer = function() {
      $scope.isMaximized = !$scope.isMaximized;
    };

    $scope.toggleTheme = function() {
      $scope.theme = $scope.theme === 'yin' ? 'yang' : 'yin';
      storage.setItem('theme', $scope.theme);
    };

    $scope.hideDrawer = function() {
      $scope.isMaximized = false;
    };

    $scope.showDrawer = function() {
      $scope.isMaximized = true;
    };

    $scope.hideSupport = function() {
      $scope.isSupportVisible = false;
    };
    $scope.showSupport = function() {
      $scope.isSupportVisible = true;
    };

    function onApplicationPropertiesRetrieved(properties) {
      $scope.application = properties;
    }

    function onPlayerPropertiesRetrieved(properties) {
      if (properties) {
        var timeFilter = $filter('time');
        $scope.player.audiostreams = properties.audiostreams;
        $scope.player.current = {
          audiostream: properties.currentaudiostream,
          subtitle: properties.currentsubtitle
        };
        $scope.player.seek = {
          time: timeFilter(properties.time),
          totaltime: timeFilter(properties.totaltime),
          percentage: properties.percentage
        };
        $scope.player.speed = properties.speed;
        $scope.player.subtitles = properties.subtitles;
        $scope.player.type = properties.type;

        $scope.playlist = properties.playlistid;
        xbmc.setActivePlaylist(properties.playlistid);
        if (properties.speed === 1) {

          window.clearInterval($scope.player.intervalId);
          $scope.player.intervalId = window.setInterval(updateSeek, 1000);
        }
      }
    };

    function onPlayerItemRetrieved(item) {
      $scope.player.item = item;
      if($scope.trakt.isAuthenticated() && $scope.trakt.autoScrobble()) {
        if(item.showtitle && item.season && item.episode) {
          $scope.player.item.type = 'episode';
          var traktSlug = item.showtitle.replace(/ /gi, '-').replace(/\./gi, '').toLowerCase()
          $scope.trakt.episodes.summary(traktSlug.toLowerCase(), item.season, item.episode).then(function(result){
            $scope.player.item.trakt = result.data;
            $scope.trakt.scrobble.start($scope.player.item.type, $scope.player.item.trakt, $scope.player.seek.percentage || 0);
          });
        } else if(item.imdbnumber) {
          $scope.trakt.movies.summary($scope.player.item.imdbnumber).then(function(result){
            $scope.player.item.trakt = result.data;
            $scope.trakt.scrobble.start($scope.player.item.type, $scope.player.item.trakt, $scope.player.seek.percentage || 0);
          });
        }
      }
      xbmc.getPlayerProperties(onPlayerPropertiesRetrieved);
    };

    function onPlayersRetrieved(players) {
      if (players.length > 0) {
        var player = players[0];
        $scope.player.id = player.playerid;
        $scope.player.active = true;
        xbmc.setActivePlayer($scope.player.id);
        xbmc.getPlayerItem(onPlayerItemRetrieved);
      }
    };

    function onVolumeChanged(obj) {
      $scope.application.volume = obj.params.data.volume;
      $scope.application.muted = obj.params.data.muted;
    };

    var updateSeek = function() {
      $scope.$apply(function() {
        $scope.player.seek.time++;
        $scope.player.seek.percentage = $scope.player.seek.time / $scope.player.seek.totaltime * 100;
        var now = Date.now();
        if (now - $scope.player.seek.lastUpdate > 5000) {
          xbmc.getPlayerProperties(onPlayerPropertiesRetrieved);
        } else {
          $scope.player.seek.lastUpdate = now;
        }
      });
    };

    var onPlayerPause = function() {
      $scope.player.speed = 0;
      window.clearInterval($scope.player.intervalId);
      if($scope.trakt.isAuthenticated() &&  $scope.trakt.autoScrobble() && $scope.player.item.trakt) {
        $scope.trakt.scrobble.pause($scope.player.item.type, $scope.player.item.trakt, $scope.player.seek.percentage);
      }
    };

    var onPlayerPlay = function(obj) {
      $scope.$apply(function() {
        var player = obj.params.data.player;
        $scope.player.id = player.playerid;
        $scope.player.active = true;
        xbmc.setActivePlayer(player.playerid);
        xbmc.getPlayerItem(onPlayerItemRetrieved);
      });
    };

    var onPlayerStop = function(obj) {
      window.clearInterval($scope.player.intervalId);
      $scope.player.seek.time = $scope.player.seek.totaltime;
      $scope.player.seek.percentage = 100;
      $scope.player.seek.lastUpdate = Date.now();
      $scope.player.active = false;
      if($scope.trakt.isAuthenticated() &&  $scope.trakt.autoScrobble() && $scope.player.item.trakt) {
        $scope.trakt.scrobble.stop($scope.player.item.type, $scope.player.item.trakt, $scope.player.seek.percentage);
      }
    };

    var onPlayerSeek = function(obj) {
      var data = obj.params.data;
      var time = data.player.time;
      var timeFilter = $filter('time');
      var seek = $scope.player.seek;
      seek.time = timeFilter(time);
      seek.percentage = seek.time / seek.totaltime * 100;
      if($scope.trakt.isAuthenticated() &&  $scope.trakt.autoScrobble() && $scope.player.item.trakt) {
        $scope.trakt.scrobble.start($scope.player.item.type, $scope.player.item.trakt, $scope.player.seek.percentage);
      }
    };

    var onPlaylistClear = function() {
      $scope.playlist = -1;
      xbmc.setActivePlaylist(-1);
    };

    var onExternalAddonRetrieved = function (result) {
      if(result && typeof result !== 'undefined' && result.addon) {
        $scope.isExternalAddonAvailable = result.addon.enabled;
      }
    };

    xbmc.register('Player.OnPause', {
      fn: onPlayerPause,
      scope: this
    });
    xbmc.register('Player.OnPlay', {
      fn: onPlayerPlay,
      scope: this
    });
    xbmc.register('Player.OnStop', {
      fn: onPlayerStop,
      scope: this
    });
    xbmc.register('Player.OnSeek', {
      fn: onPlayerSeek,
      scope: this
    });
    xbmc.register('Playlist.OnClear', {
      fn: onPlaylistClear,
      scope: this
    });
    xbmc.register('Application.OnVolumeChanged', {
      fn: onVolumeChanged,
      scope : this
    });

    var onLoad = function() {
      $scope.$apply(function() {
        $scope.connected = true;
      });
      xbmc.getApplicationProperties(onApplicationPropertiesRetrieved);
      xbmc.getActivePlayers(onPlayersRetrieved);
      xbmc.getAddonDetails($scope.host.videoAddon, onExternalAddonRetrieved);
    }
    var onDisconnect = function() {
      $scope.connected = false;
      $scope.initialized = true;
    };

    if (xbmc.isConnected()) {
      onLoad();
    } else {
      xbmc.register('Websocket.OnConnected', {
        fn: onLoad,
        scope: this
      });
      xbmc.register('Websocket.OnDisconnected', {
        fn: onDisconnect,
        scope: this
      });

      //New version of the app migration was done. Default behavior
      storage.getItem('hosts').then(function(value) {
        var filterDefault = function(el) {
          return el.default;
        };
        if (value !== null) {
          $scope.hosts = value;
        } else {
           $scope.hosts = [{
            default: true,
            displayName: 'localhost',
            httpPort: window.location.port === '' ? '80': window.location.port,
            ip: window.location.hostname,
            port: '9090',
            videoAddon : 'plugin.video.youtube',
            username : '',
            password : ''
          }];
        }
        var defaultHost = $scope.hosts.filter(filterDefault)[0];
        $scope.initialize(defaultHost);
      });

    }

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      ga('send', 'pageview', $location.path());
    });

    $scope.$watch('hosts', function(newVal, oldVal) {
      var filterDefault = function(el) {
        return el.default;
      }
      var filtered = $scope.hosts.filter(filterDefault);
      $scope.host = filtered[0];
    });
  }
]);
"use strict";
angular.module('directives.onlastrepeat', [])
.directive('onLastRepeat', function () {
  return function(scope, element, attrs) {
    if (scope.$last){
      setTimeout(function(){
        scope.$emit('onRepeatLast', element, attrs);
      }, 1);
    }
  };
});
"use strict";
angular.module('directives.noSource', [])
.directive('noSource', function () {
  return {
    restrict: 'E',
    replace : true,
    templateUrl: 'template/nosource/nosource.tpl.html',
    scope: {
      source: '='
    },
    link: function (scope, elem, attrs) {
      scope.getBackgroundImg = function () {
        if(scope.source === 'movies') {
          return '../img/interstellar-blur.jpg';
        } else if (scope.source === 'tvshows') {
          return '../img/twd-blur.jpg';
        } else if (scope.source === 'musics') {
          return '../img/acdc-blur.jpg';
        }
        return '../img/blank.gif';
      };

      scope.getWikiPage = function () {
        if(scope.source === 'movies' || scope.source === 'tvshows') {
          return 'http://kodi.wiki/view/Adding_video_sources';
        } else if (scope.source === 'musics') {
          return 'http://kodi.wiki/view/Adding_music_to_the_library';
        }
        return 'about:blank';
      };

      scope.getIcon = function(){
        if(scope.source === 'movies') {
          return 'adventure';
        } else if (scope.source === 'tvshows') {
          return 'horror';
        } else if (scope.source === 'musics') {
          return 'music';
        }
        return '';
      };

      scope.hasPopular = function () {
        return scope.source === 'movies' || scope.source === 'tvshows';
      };
    }
  };
});
'use strict';
angular.module('directives.tmdbFanarts', [
  'directives.image',
  'filters.tmdb.image',
  'filters.fallback'
]).directive('tmdbFanarts', ['$filter', '$interval', function ($filter, $interval) {
  return {
    restrict: 'E',
    replace : true,
    templateUrl: 'template/fanarts/fanarts.tpl.html',
    scope: {
      fanarts: '=',
      fanartSize: '=',
      delay : '=',
      primary : '='
    },
    link: function (scope, elem, attrs) {
      var timeoutId = null;
      scope.getImage = function (path) {
        var url = $filter('tmdbImage')(path, scope.fanartSize || 'original');
        return $filter('fallback')(url, 'img/icons/awe-512.png');
      };

      scope.index = 0;
      var kenBurns = function(){
        if(scope.fanarts.length) {
          scope.index++;
          if(scope.index>=scope.fanarts.length){ scope.index = 0;}
        }
      };

      scope.wideEnough = function(value, index, array) {
        return value.width >= 1920;
      };

      scope.$watch('fanarts', function(value) {
        if(value && value.length) {
          if(timeoutId) {
            $interval.cancel(timeoutId);
          }
          timeoutId  = $interval(kenBurns, parseInt(scope.delay) || 30000);
        }
      });

      elem.on('$destroy', function() {
        $interval.cancel(timeoutId);
      });
    }
  };
}]);
"use strict";
angular.module('directives.traktActions', ['services.trakt'])
.directive('traktActions', ['$q', '$filter', 'trakt', function ($q, $filter, trakt) {
  return {
    restrict: 'E',
    replace : true,
    templateUrl: 'template/actions/actions.tpl.html',
    scope: {
      mediaType : '=',
      imdb : '=',
      slug : '='
    },
    link: function (scope, elem, attrs) {
      var arrFilter = $filter('filter');
      var entity = scope.mediaType === 'movies' ? 'movie' : 'show';
      var item = null;
      scope.loading = true;
      scope.loadings = {
        history : false,
        collection : false,
        watchlist : false
      }
      scope.historyMatch = [];
      scope.collectionMatch = [];
      scope.watchlistMatch = [];

      var addTo = function(method, obj){
        scope.loadings[method] = true;
        trakt.sync.add(method, scope.mediaType, item).then(function(result){
          var added = result.data.added;
          obj[entity] = item;
          scope[method+'Match'] = [obj];
          scope.loadings[method] = false;
        });
      };
      var removeFrom = function(method) {
        scope.loadings[method] = true;
        trakt.sync.remove(method, scope.mediaType, item).then(function(result){
          scope[method+'Match'] = [];
          scope.loadings[method] = false;
        });
      };

      scope.toggleHistory = function () {
        if(scope.historyMatch.length) {
          removeFrom('history');
        } else {
          addTo('history', {plays:1, last_watched_at: new Date().toISOString()});
        }
      };

      scope.toggleCollection = function () {
        if(scope.collectionMatch.length) {
          removeFrom('collection');
        } else {
          addTo('collection', {collected_at: new Date().toISOString()});
        }
      };

      scope.toggleWatchlist = function () {
        if(scope.watchlistMatch.length) {
          removeFrom('watchlist');
        } else {
          addTo('watchlist', {listed_at: new Date().toISOString()});
        }
      };

      $q.all([
          trakt[scope.mediaType].summary(scope.imdb || scope.slug),
          trakt.sync.get('watched', scope.mediaType),
          trakt.sync.get('collection', scope.mediaType),
          trakt.sync.get('watchlist', scope.mediaType)
        ]).then(function(results){
          item = results[0].data;
          var history = results[1].data;
          var collection = results[2].data;
          var watchlist = results[3].data;
          var searchCriteria = {};
          searchCriteria[entity] = {ids : {trakt : item.ids.trakt}};
          scope.historyMatch = arrFilter(history, searchCriteria);
          scope.collectionMatch = arrFilter(collection, searchCriteria);
          scope.watchlistMatch = arrFilter(watchlist, searchCriteria);
          scope.loading = false;
        });
    }
  };
}]);
"use strict";
angular.module('directives.traktComments', ['filters.unit'])
.directive('traktComments', function () {
  return {
    restrict: 'E',
    replace : true,
    templateUrl: 'template/comments/comments.tpl.html',
    scope: {
      comments: '='
    },
    link: function (scope, elem, attrs) {
      scope.$watch('comments', function (newVal, oldVal) {
        if (newVal) {
          scope.comments = newVal;
        }
      });
    }
  };
}); 
"use strict";
angular.module('directives.traktStats', ['filters.unit'])
.directive('traktStats', function () {
  return {
    restrict: 'E',
    replace : true,
    templateUrl: 'template/stats/stats.tpl.html',
    scope: {
      stats: '='
    },
    link: function (scope, elem, attrs) {}
  };
}); 
angular.module('filters.fallback', [])
.filter('fallback', function () {
  return function (input, fallback) {
    fallback = fallback || '';
    if (typeof input === 'undefined' || input === null || input === '') {
      return fallback;
    }
    return input;
  };
});
angular.module('filters.tmdb.image', [])
.filter('tmdbImage', function () {
  return function (subpath, size) {
    size = size || 'original';
    var url = 'http://image.tmdb.org/t/p/'+size;
    if(typeof subpath  === 'undefined' || subpath === null) {
      return '';
    }
    return url + subpath;
  };
});
angular.module('filters.tmdb', [
  'filters.tmdb.image'
]);
angular.module('filters.unit', [])
.filter('unit', ['$filter', function ($filter) {
  return function (input) {
    var parsed, value; 
    var numFilter = $filter('number');
    if(!angular.isNumber(input)) {
      parsed = parseInt(input);
    } else {
      parsed = input;
    }
    if(!isNaN(parsed)) {
      if(parsed > 1000000) {
        value = numFilter(parsed/1000000, 1)+'m';
      } else if (parsed > 1000) {
        value = numFilter(parsed/1000, 1)+'k';
      } else {
        value = parsed;
      }
    } else {
      value = input;
    }
    return value;
  };
}]);
angular.module('app')
.controller('HeaderNavController', ['$scope', '$location', '$filter',
  function ($scope, $location, $filter) {
    $scope.showWizard = false;
    $scope.query = '';
    $scope.isOpen = false;
    $scope.medias = [{
      hash: '/movies/recents',
      label: 'Movies',
      matchRegExp : /movie.*$/
    }, {
      hash: '/tvshows/recents',
      label: 'TV Shows',
      matchRegExp : /.*show.*$/
    }, {
      hash: '/musics/artists/all',
      label: 'Musics',
      matchRegExp : /music.*$/
    }, {
      hash: '/settings',
      label: 'Settings',
      matchRegExp : /settings.*$/
    }];

    $scope.isCurrent = function (matchRegExp) {
      return $location.path().match(matchRegExp) !== null;
    };

    $scope.open =  function () {
      $scope.isOpen = !$scope.isOpen;
      document.querySelector('header nav .search input').focus();
    }

    $scope.search = function () {
      $scope.go('/search/'+$scope.query);
    };

    $scope.toggleWizard = function () {
      $scope.showWizard = !$scope.showWizard;
    };

    $scope.scan = function() {
      var hash = window.location.hash;
      if(hash.indexOf('movies')>-1 || hash.indexOf('tvshows') > -1) {
        $scope.xbmc.scan('VideoLibrary');
      } else if (hash.indexOf('musics')>-1 ) {
        $scope.xbmc.scan('AudioLibrary');
      }
    };
  }
]);

angular.module('app')
.controller('DonationFormCtrl', ['$scope',
  function DonationFormCtrl ($scope) {
    $scope.donation = {
      amount : 5,
      currency : {value : 'USD', label : 'US Dollar'},
      currencies : [
        {value : 'USD', label : 'US Dollar'},
        {value : 'EUR', label : 'Euro'},
        {value : 'GBP', label : 'British Pound'},
        {value : 'CAD', label : 'Canadian Dollar'},
        {value : 'AUD', label : 'Australian Dollar'},
        {value : 'JPY', label : 'Japanese Yen'}
      ]
    }
  }
]);

var BaseMovieDetailsCtrl = function ($scope, $stateParams) {
  $scope.movieid = parseInt($stateParams.movieid);
  $scope.loading = true;
  $scope.affixable = false;
  $scope.isCurrentlyPlaying = false;

  $scope.seeMoreActors = false;
  $scope.similars = [];
  $scope.stats = [];
  $scope.comments = [];
  $scope.movie  = null;

  $scope.findSimilars = function (movieid) {
    $scope.tmdb.movies.similars(movieid, 1).then(function(result){
      var similars = result.data.results.filter(function(similar) {
        return typeof similar.poster !== 'undefined' && similar.poster !== null;
      });
      $scope.similars = similars.slice(0, Math.min(similars.length, 8));
    });
  };

  $scope.additionalImages = function (movieid) {
    $scope.tmdb.movies.images(movieid).then(function(result){
      $scope.fanarts = result.data.fanarts || [];
    });
  };

  $scope.getActors = function () {
    var actors = $scope.movie.cast.filter(function(actor) {
      return actor.role !== '' && typeof actor.thumbnail !== 'undefined';
    });
    return actors.slice(0, Math.min(actors.length, 10));
  };

  $scope.getTraktAdditionalInfo = function (movie) {
    if(movie) {
      $scope.trakt.movies.stats(movie.imdbnumber).then(function(result){
        $scope.stats = result.data;
      });
      $scope.trakt.movies.comments(movie.imdbnumber).then(function(result){
        var sortFn = function(o1, o2) {
          if(o1.likes > o2.likes) {
            return -1;
          } else if(o1.likes < o2.likes) {
            return 1;
          } else {
            return 0;
          }
        };
        if(result.data && angular.isArray(result.data)) {
          var comments = result.data.sort(sortFn);
          $scope.comments = comments.slice(0, Math.min(comments.length, 3));
        }
      });
    }
  };

  $scope.$watch('movie', function () {
    $scope.getTraktAdditionalInfo($scope.movie);
  });

  var detail = document.querySelector('.movie.detail');
  detail.onscroll = function () {
    if(detail.scrollTop > 200) {
      if(!detail.classList.contains('affixable')) {
        var sidebar = detail.querySelector('.description > .sidebar');
        var dimension = sidebar.getBoundingClientRect();
        detail.classList.add('affixable');
        sidebar.style.marginLeft = dimension.left + 'px';
        sidebar.style.width = dimension.width + 'px';
      }
    } else {
      var sidebar = detail.querySelector('.description > .sidebar');
      detail.classList.remove('affixable');
      sidebar.removeAttribute('style');
    }
  };
};

angular.module('app')
.controller('MovieDetailsCtrl', ['$scope', '$stateParams', '$injector', '$filter',
  function MovieDetailsCtrl($scope, $stateParams, $injector, $filter) {
    $injector.invoke(BaseMovieDetailsCtrl, this, {$scope: $scope, $stateParams: $stateParams});

    function isCurrentlyPlaying() {
      return $scope.player.active && $scope.player.item.id === $scope.movie.movieid;
    };

    function onMovieRetrieved (item) {
      item.type = 'movie';
      $scope.movie = item;
      $scope.isCurrentlyPlaying = isCurrentlyPlaying();
      $scope.loading = false;
      $scope.tmdb.find('imdb_id', item.imdbnumber).then(function(result){
        var movies = result.data.movies;
        if(movies.length === 1) {
          var movieid = movies[0].id;
          $scope.findSimilars(movieid);
          $scope.additionalImages(movieid);
        }
      });
    };
    var onLoad = function () {
      $scope.xbmc.getMovieDetails($scope.movieid, onMovieRetrieved);
    };
    if ($scope.xbmc.isConnected()) {
      onLoad();
    } else {
      $scope.xbmc.register('Websocket.OnConnected', { fn : onLoad, scope : this});
    }

    $scope.getImage = function (path) {
      var url = $filter('asset')(path, $scope.host);
      return $filter('fallback')(url, 'img/icons/awe-512.png');
    };

    $scope.imdb = function (imdbnumber) {
      window.open('http://www.imdb.com/title/' + imdbnumber + '/', '_blank');
    };

    $scope.getAudio = function () {
      if($scope.movie.streamdetails.audio.length > 0) {
        return $scope.movie.streamdetails.audio.map(function(audio) {
          return audio.language;
        }).join(', ');
      } else {
        return '-';
      }
    };

    $scope.getVideoDefinition = function () {
      if($scope.movie.streamdetails.audio.length > 0) {
        var video = $scope.movie.streamdetails.video[0];
        return video.width + 'x' + video.height;
      } else {
        return '-';
      }
    };

    $scope.hasAdditionalInfo = function () {
      return true;
    };

    $scope.isUsingExternalAddon = function () {
      return false;
    };

    $scope.play = function(movie) {
      $scope.helper.local.movies.play(movie);
    };

    $scope.queue = function(movie) {
      $scope.xbmc.queue({'movieid': movie.movieid});
    };

    $scope.$watch('player.item', function (newVal, oldVal) {
      $scope.isCurrentlyPlaying = isCurrentlyPlaying();
    });
  }
])
.controller('TMDBMovieDetailsCtrl', ['$scope', '$stateParams', '$injector', '$filter', '$http', '$interpolate',
  function TMDBMovieDetailsCtrl($scope, $stateParams, $injector, $filter, $http, $interpolate) {
    $injector.invoke(BaseMovieDetailsCtrl, this, {$scope: $scope, $stateParams: $stateParams});
    var playFn = $interpolate('http://{{ip}}:{{port}}/jsonrpc?request={ "jsonrpc": "2.0", "method": "Player.Open", "params" : {"item": { "file": "{{path}}" }}, "id": {{uid}}}');

    $scope.tmdb.movies.details($scope.movieid).then(function(result) {
      $scope.movie = result.data;
      $scope.tmdb.movies.credits($scope.movieid).then(function(result){
        $scope.movie.cast = result.data.cast;
        var crew = result.data.crew;
        $scope.movie.director = crew.filter(function(member){
          return member.job.toLowerCase() === 'director';
        }).map(function(obj) {
          return obj.name;
        });
        $scope.movie.writer = crew.filter(function(member){
          return member.job.toLowerCase() === 'writer';
        }).map(function(obj) {
          return obj.name;
        });
        $scope.loading = false;
      });
      $scope.tmdb.movies.videos($scope.movieid).then(function(result){
        var videos = result.data.results;
        if(videos && videos.length > 0) {
          $scope.movie.trailer = 'plugin://plugin.video.youtube/?action=play_video&videoid='+videos[0].key;
        }
      })
    });
    $scope.findSimilars($scope.movieid);
    $scope.additionalImages($scope.movieid);

    $scope.getImage = function (path, size) {
      var url = $filter('tmdbImage')(path, size || 'original');
      return $filter('fallback')(url, 'img/icons/awe-512.png');
    };

    $scope.hasAdditionalInfo = function () {
      return false;
    };

    $scope.isUsingExternalAddon = function () {
      return true;
    };

    $scope.play = function(movie) {
      $scope.helper.foreign.movies.play($scope.host, movie);
    };

    $scope.queue = function(movie) {
      xbmc.queue({'movieid': movie.movieid});
    };
  }
]);
angular.module('app')
.controller('MoviesCtrl', ['$scope', '$state', '$filter',
  function MoviesCtrl($scope, $state, $filter) {
    $scope.loading = true;
    $scope.fetching = false;
    $scope.empty = false;

    $scope.requestItemsBy = 50;
    $scope.total = Infinity;
    $scope.movies = [];
    $scope.supportIndex = -1;
    var method = $state.current.data.methodName;

    function onMoviesFromSource(result) {
      var movies = result && result.movies ? result.movies : [];
      $scope.total = result && result.limits ? result.limits.total : Infinity;
      $scope.movies = $scope.movies.concat(movies);
      $scope.loading = false;
      $scope.fetching = false
      $scope.empty = !$scope.movies.length;
    };

    function onLoad() {
      var limits =  {
        'start' : 0,
        'end' : $scope.requestItemsBy
      }
      $scope.xbmc[method](onMoviesFromSource, limits);
    };

    $scope.xbmc.register('VideoLibrary.OnScanFinished', {
      fn: onLoad,
      scope: this
    });

    if ($scope.xbmc.isConnected()) {
      onLoad();
    } else {
      $scope.xbmc.register('Websocket.OnConnected', { fn : onLoad, scope : this});
    }

    $scope.getMoviesPath = function(movie) {
      return '#/movies/'+movie.movieid;
    };

    $scope.getPoster = function (movie) {
      var url = $filter('asset')(movie.thumbnail, $scope.host);
      return $filter('fallback')(url, 'img/icons/awe-512.png');
    };

    $scope.hasControls = function() {
      return true;
    };

    $scope.loadMore = function () {
      if($scope.movies.length < $scope.total) {
        $scope.fetching = true;
        var limits =  {
          'start' : $scope.movies.length,
          'end' : Math.min($scope.movies.length+$scope.requestItemsBy, $scope.total)
        };
        $scope.xbmc[method](onMoviesFromSource, limits);
      }
    };

    $scope.queue = function (movie) {
      $scope.xbmc.queue({'movieid' : movie.movieid})
    };

    $scope.remove = function (index, movie) {
      var onMovieRemoved = function(){
        $scope.movies.splice(index, 1);
      };
      $scope.xbmc.removeEpisode(movie.movieid, onMovieRemoved);
    };


    $scope.toggleWatched = function (movie) {
      var newValue =  movie.playcount ? 0 : 1;
      $scope.xbmc.setMovieDetails({
        movieid : movie.movieid,
        playcount  :newValue
      },  function(result) {
        if(result === 'OK') {
          movie.playcount = newValue;
        }
      })
    };
  }
]);
angular.module('app')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('movies', {
    url: '/movies',
    views: {
      header: {templateUrl: 'modules/common/navigation.tpl.html', controller : 'HeaderNavController'},
      body: {templateUrl: 'modules/movie/movies.tpl.html', controller: 'MovieListCtrl'}
    }
  }).state('movies.all', {
    url : '/all',
    templateUrl: 'modules/movie/list.tpl.html',
    controller: 'MoviesCtrl',
    data : {
      methodName : 'getMovies'
    }
  }).state('movies.recents', {
    url: '/recents',
    templateUrl: 'modules/movie/list.tpl.html',
    controller: 'MoviesCtrl',
    data : {
      methodName : 'getRecentlyAddedMovies'
    }
  }).state('movies.popular', {
    url : '/popular',
    templateUrl: 'modules/movie/list.tpl.html',
    controller: 'PopularMoviesCtrl'
  }).state('movies.details', {
    url: '/:movieid',
    templateUrl: 'modules/movie/details.tpl.html',
    controller: 'MovieDetailsCtrl'
  }).state('movies.tmdb', {
    url: '/tmdb/:movieid',
    templateUrl: 'modules/movie/details.tpl.html',
    controller: 'TMDBMovieDetailsCtrl'
  });
}])
.controller('MovieListCtrl', ['$scope',
  function MovieListCtrl($scope) {
    $scope.isSelected = function (stateName) {
      return $scope.$state.current.name === stateName;
    }
  }
]);
angular.module('app')
.controller('PopularMoviesCtrl', ['$scope', '$filter',
  function PopularMoviesCtrl($scope, $filter) {
    $scope.loading = true;
    $scope.fetching = false;

    $scope.pages = 1;
    $scope.total = Infinity;
    $scope.movies = [];
    $scope.supportIndex = -1;

    var now = new Date();
    var firstReleaseDate = (now.getFullYear()-2)+'-01-01';
    var cleanUpResults = function(results) {
      return results;
    };

    function onMoviesFromSource(response) {
      $scope.total = response.data.totalPages;
      $scope.movies = $scope.movies.concat(cleanUpResults(response.data.results));
      if($scope.supportIndex === -1) {
        $scope.supportIndex = 5+Math.floor(Math.random()*($scope.movies.length-5));
      }
      $scope.fetching = false;
      $scope.loading = false;
    };

    $scope.tmdb.movies.populars(firstReleaseDate, 5, $scope.pages).then(onMoviesFromSource);

    $scope.hasControls = function () {
      return false;
    };

    $scope.getMoviesPath = function(movie) {
      return '#/movies/tmdb/'+movie.id;
    };

    $scope.getPoster = function (show) {
      var url = $filter('tmdbImage')(show.poster, 'w500');
      return $filter('fallback')(url, 'img/icons/awe-512.png');
    };

    $scope.loadMore = function () {
      if( $scope.pages < $scope.total) {
        $scope.fetching = true;
        $scope.tmdb.movies.populars(firstReleaseDate, 5, ++$scope.pages).then(onMoviesFromSource);
      }
    };
  }]
);
angular.module('app')
.controller('MusicAlbumsCtrl', ['$scope', '$stateParams', 'storage',
  function MusicAlbumsCtrl($scope, $stateParams, storage) {
    $scope.loading = true;
    $scope.fetching = false;
    $scope.empty = false;

    $scope.requestItemsBy = 50;
    $scope.total = Infinity;

    $scope.filter = $stateParams.filter;
    $scope.albums =[];

    var filter = null;
    if ($scope.filter) {
      $scope.filterId = parseInt($stateParams.filterId);
      filter = {
        key: $scope.filter,
        value: $scope.filterId
      };
    }

    function onSongsFromSource (result) {
      $scope.songs = result.songs;
      $scope.loading = false;
    }

    function onArtistFromSource (artist) {
      $scope.artist = artist;
      var songFilter = {
        key : 'artistid',
        value : $scope.albums[0].artistid[0]
      }
      $scope.xbmc.getSongs(songFilter, onSongsFromSource, {start:0, end:200});
    };

    function onAlbumsFromSource(result) {
      var albums = result && result.albums ? result.albums : [];
      $scope.total = result ? result.limits.total : Infinity;
      $scope.albums = $scope.albums.concat(albums);
      $scope.empty = !$scope.albums.length;
      if ($scope.filter) {
        $scope.xbmc.getArtistDetails(albums[0].artistid[0], onArtistFromSource);
      } else {
        $scope.loading = false;
        $scope.fetching = false;

      }
    };

    function onLoad() {
      var limits =  {
        'start' : 0,
        'end' : $scope.requestItemsBy
      };
      $scope.xbmc.getAlbums(filter, onAlbumsFromSource, limits);
    };

    if ($scope.xbmc.isConnected()) {
      onLoad();
    } else {
      $scope.xbmc.register('Websocket.OnConnected', {
        fn: onLoad,
        scope: this
      });
    }

    $scope.isPartOf = function (album) {
      return function (song) {
        return song.albumid === album.albumid;
      };
    };

    $scope.hasCover = function(album) {
      return album.thumbnail !== '';
    };

    $scope.loadMore = function () {
      if($scope.albums.length < $scope.total) {
        $scope.fetching = true;
        var limits =  {
          'start' : $scope.albums.length,
          'end' : Math.min($scope.albums.length+$scope.requestItemsBy, $scope.total)
        };
         $scope.xbmc.getAlbums(filter, onAlbumsFromSource, limits);
      }
    };

    var detail = document.querySelector('.songs-wrapper.detail');
    if(detail) {
      detail.onscroll = function () {
        if(detail.scrollTop > 250) {
          if(!detail.classList.contains('affixable')) {
            detail.classList.add('affixable');
          }
        } else {
          detail.classList.remove('affixable');
        };
      };
    }
  }
]);
angular.module('app')
.controller('MusicArtistsCtrl', ['$scope', 'storage',
  function MusicArtistsCtrl($scope, storage) {
    $scope.loading = true;
    $scope.fetching = false;
    $scope.empty = false;

    $scope.requestItemsBy = 50;
    $scope.total = Infinity;
    $scope.artists = [];

    function onArtistsFromSource(result) {
       var artists = result && result.artists ? result.artists : [];
      $scope.total = result ? result.limits.total : Infinity;
      $scope.artists = $scope.artists.concat(artists);
      $scope.loading = false;
      $scope.fetching = false;
      $scope.empty = !$scope.artists.length;
    };


    function onLoad () {
      $scope.loading = true;
      var limits =  {
        'start' : 0,
        'end' : $scope.requestItemsBy
      }
      $scope.xbmc.getArtists(onArtistsFromSource, limits);
    };
    if ($scope.xbmc.isConnected()) {
      onLoad();
    } else {
      $scope.xbmc.register('Websocket.OnConnected', { fn : onLoad, scope : this});
    }

    $scope.hasCover = function (artist) {
      return artist.thumbnail !== '';
    };

    $scope.loadMore = function () {
      if($scope.artists.length < $scope.total) {
        $scope.fetching = true;
        var limits =  {
          'start' : $scope.artists.length,
          'end' : Math.min($scope.artists.length+$scope.requestItemsBy, $scope.total)
        };
         $scope.xbmc.getArtists(onArtistsFromSource, limits);
      }
    };
  }
]);
angular.module('app')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('music', {
    url: '/musics',
    views: {
      header: {templateUrl: 'modules/common/navigation.tpl.html', controller : 'HeaderNavController'},
      body: {
        templateUrl: 'modules/music/musics.tpl.html',
        controller: 'MusicCtrl'
      }
    }
  }).state('music.albums', { 
    url : '/albums/all',
    templateUrl: 'modules/music/albums.tpl.html',
    controller: 'MusicAlbumsCtrl'
  }).state('music.filteredAlbums', { 
    url: '/albums/:filter/:filterId',
    templateUrl: 'modules/music/artist.albums.tpl.html',
    controller: 'MusicAlbumsCtrl'
  }).state('music.artists', {
    url : '/artists/all',
    templateUrl: 'modules/music/artists.tpl.html',
    controller: 'MusicArtistsCtrl'
  }).state('music.songs', {
    url : '/songs/all',
    templateUrl: 'modules/music/songs.tpl.html',
    controller: 'MusicSongsCtrl'
  }).state('music.filteredSongs', {
    url : '/songs/:filter/:filterId',
    templateUrl: 'modules/music/songs.tpl.html',
    controller: 'MusicSongsCtrl'
  });
}])
.controller('MusicCtrl', ['$scope',
  function MusicCtrl($scope, $stateParams) {
    $scope.isSelected = function (regExpStr) {
      var regExp = new RegExp(regExpStr, 'gi');
      return $scope.$state.current.name.match(regExp) !== null;
    }
  }
]);
angular.module('app')
.controller('MusicSongsCtrl', ['$scope', '$rootScope', '$stateParams', '$filter', 'storage',
  function MusicSongsCtrl($scope, $rootScope, $stateParams, $filter, storage) {
    $scope.loading = true;
    $scope.fetching = false;
    $scope.empty = false;

    $scope.requestItemsBy = 75;
    $scope.total = Infinity;

    $scope.filter = $stateParams.filter;
    $scope.album = null;
    $scope.songs = [];

    var filter = null;
    if ($scope.filter) {
      filter = {key : $scope.filter, value : parseInt($stateParams.filterId)}
    }

    function onSongsFromSource (result) {
      var songs = result && result.songs ? result.songs : [];
      $scope.total = result ? result.limits.total : Infinity;
      $scope.songs = $scope.songs.concat(songs);
      $scope.empty = !$scope.songs.length;

      if(filter !== null) {
        $scope.xbmc.getAlbumDetails(filter.value, onAlbumRetrieved);
      } else {
        $scope.loading = false;
        $scope.fetching = false;
      }
    };

    function onAlbumRetrieved (album) {
      $scope.album = album;
      $scope.loading = false;
    };

    function onLoad() {
      var limits =  {
        'start' : 0,
        'end' : $scope.requestItemsBy
      }
      $scope.xbmc.getSongs(filter, onSongsFromSource, limits);
    };

    if ($scope.xbmc.isConnected()) {
      onLoad();
    } else {
      $scope.xbmc.register('Websocket.OnConnected', { fn : onLoad, scope : this});
    }

    $scope.getCover = function (song) {
      var assetFilter = $filter('asset');
      var hasCover = typeof $scope.filter !== 'undefined' && song && song.thumbnail !== '';
      if (hasCover) {
        return assetFilter(song.thumbnail, $scope.host);
      } else {
        return '';
      }
    };

    $scope.isFiltered = function () {
      return typeof $scope.filter !== 'undefined';
    };

    $scope.loadMore = function () {
      if($scope.songs.length < $scope.total) {
        $scope.fetching = true;
        var limits =  {
          'start' : $scope.songs.length,
          'end' : Math.min($scope.songs.length+$scope.requestItemsBy, $scope.total)
        };
         $scope.xbmc.getSongs(filter, onSongsFromSource, limits);
      }
    };

    var detail = document.querySelector('.songs-wrapper.detail');
    detail.onscroll = function () {
      if(detail.scrollTop > 250) {
        if(!detail.classList.contains('affixable')) {
          detail.classList.add('affixable');
        }
      } else {
        detail.classList.remove('affixable');
      };
    };
  }
]);
angular.module('app')
.controller('NowPlayingCtrl', ['$scope', '$filter',
  function NowPlayingCtrl($scope, $filter) {
    $scope.loading = false;
    $scope.view = 'remote';

    $scope.showAudioSelect = false;
    $scope.showSubtitleSelect = false;
    $scope.showTimePicker = false;
    $scope.showShutdownOptions = false;
    $scope.showRemote = false;
    $scope.textToSend = '';
    $scope.showKeyboard = false;
    $scope.showShutdownOptions = false;

    $scope.stream = 0;
    $scope.sub = 0;

    $scope.$watch('player.current', function (newVal, oldVal) {
      if($scope.player.current) {
        if( $scope.player.current.audiostream) {
          $scope.stream = $scope.player.current.audiostream.index;
        }
        if($scope.player.current.subtitle) {
          $scope.sub = $scope.player.current.subtitle.index || 'off';
        }
      }
    });
    
    $scope.$watch('playlist', function (newVal, oldVal) {
      if(newVal > -1) {
        getItems();
      }
    });

    var timeFilter = $filter('time');
    $scope.seekTime = timeFilter($scope.player.seek.time);

    $scope.execCommand = function(xbmcCommand){
      $scope.toggleShutdownOptions();
      $scope.xbmc[xbmcCommand]();
    };

    $scope.getHashForItem = function () {
      if($scope.player.type === 'video' && $scope.player.item) {
        if( $scope.player.item.tvshowid === -1) {
          return '/movies/'+ $scope.player.item.id;
        } else {
          return '/tvshows/'+ $scope.player.item.tvshowid
        }
      } else if($scope.player.type === 'audio' && $scope.player.item) {
        return '/musics/songs/albumid/'+ $scope.player.item.albumid;
      }
      return '';
    };

    $scope.goTo = function(index) {
      document.querySelector('.playlist [data-type="list"]').scrollTop = 0;
      $scope.xbmc.goTo(index);
    };

    $scope.isPlaying = function (id) {
      return  $scope.player.item.id === id;
    };

    $scope.isTypeVideo = function() {
      return $scope.player.type === 'video' ||
      $scope.player.type === 'movie' ||
      $scope.player.type === 'episode';
    };

    $scope.isSelected = function(current, obj) {
      if (typeof obj === 'string') {
        return obj === current;
      } else {
        return obj.index === current.index;
      }
    };

    $scope.onSeekbarChanged = function(newValue) {
      $scope.updateSeek(newValue);
    };

    var removeTime = function(date) {
      date.setSeconds(0);
      date.setHours(0);
      date.setMinutes(0);
      return date;
    };

    $scope.onValidateSeekTime = function() {
      var startTime = removeTime(new Date()).getTime();
      var totalTime = timeFilter($scope.player.seek.totaltime).getTime();
      var seekTime = $scope.seekTime.getTime();
      var percent = (seekTime - startTime) / (totalTime - startTime) * 100;
      $scope.updateSeek(Math.floor(percent));
      $scope.showTimePicker = false;
    };

    $scope.onValidateAudioStream = function() {
      $scope.showAudioSelect = false;
      $scope.xbmc.setAudioStream($scope.stream);
    };

    $scope.onValidateText = function() {
      $scope.xbmc.sendText($scope.textToSend);
      $scope.showKeyboard = false;
      $scope.textToSend = '';
    };
    

    $scope.onValidateSubtitles = function() {
      $scope.showSubtitleSelect = false;
      $scope.xbmc.setSubtitle($scope.sub);
    };

    $scope.onVolumeChanged = function(newValue) {
      $scope.xbmc.setVolume(newValue);
    }

    $scope.toggleAudioStreams = function() {
      $scope.showAudioSelect = !$scope.showAudioSelect;
    };

     $scope.toggleRemote = function() {
      $scope.showRemote = !$scope.showRemote;
    };

    $scope.toggleSubtitles = function() {
      $scope.showSubtitleSelect = !$scope.showSubtitleSelect;
    };

    $scope.toggleTimePicker = function() {
      $scope.seekTime = timeFilter($scope.player.seek.time);
      $scope.showTimePicker = !$scope.showTimePicker;
    };

    $scope.toggleKeyboard = function() {
      $scope.showKeyboard = !$scope.showKeyboard;
    };

    $scope.toggleShutdownOptions = function() {
      $scope.showShutdownOptions = !$scope.showShutdownOptions;
    };

    $scope.toggleShutdownOptions = function() {
      $scope.showShutdownOptions = !$scope.showShutdownOptions;
    };

    $scope.updateSeek = function(newValue) {
      newValue = Math.min(newValue, 100);
      newValue = Math.max(newValue, 0);
      $scope.xbmc.seek(newValue);
    };

    var getItems = function () {
      $scope.loading = true;
      $scope.xbmc.getPlaylistItems(function (items) {
        $scope.items = items;
        $scope.loading = false;
      });
    };
    
    var onPlaylistAdd = function (obj) {
      getItems();
    };

    var onPlaylistRemove = function (obj) {
      var data = obj.params.data;
      if (!$scope.loading && $scope.playlist === data.playlistid && typeof $scope.items !== 'undefined') {
        $scope.items.splice(data.position);
      }
    };

    $scope.xbmc.register('Playlist.OnAdd', { fn: onPlaylistAdd, scope: this});
    $scope.xbmc.register('Playlist.OnRemove', { fn: onPlaylistRemove, scope: this});

  }
]);
angular.module('app')
.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('search', {
      url: '/search/:query',
      views: {
        header: {templateUrl: 'modules/common/navigation.tpl.html', controller : 'HeaderNavController'},
        body: { templateUrl: 'modules/search/list.tpl.html', controller: 'SearchListCtrl'}
      }
    });
  }
])
.controller('SearchListCtrl', ['$scope', '$stateParams', 
  function SearchListCtrl($scope, $stateParams) {
    $scope.query = $stateParams.query;
    $scope.results = [];
    $scope.filter = {mediaType : ''};
    
    $scope.pages = 1;
    $scope.total = Infinity;

    var cleanUpResults = function(results) {
      return results.filter(function(result) {
        return result.mediaType === 'movie' || result.mediaType === 'tv';
      }).map(function(result) {
        if(result.hasOwnProperty('firstaired')) {
          result.year = moment(result.firstaired).year();
        }
        return result;
      });
    };

    function onResultsFromSource(response) {
      $scope.total = response.data.totalPages;
      $scope.results = $scope.results.concat(cleanUpResults(response.data.results));
    }; 

    $scope.getPath = function (result) {
      if(result.mediaType === 'tv') {
        return '#/tvshows/tmdb/'+result.id;
      } else {
        return '#/movies/tmdb/'+result.id;
      }
    };

    $scope.loadMore = function () {
      if( $scope.pages < $scope.total) {
        $scope.fetching = true;
        $scope.tmdb.search($scope.query, ++$scope.pages).then(onResultsFromSource);
      }
    };

    $scope.tmdb.search($scope.query, $scope.pages).then(onResultsFromSource);
  }
]);
angular.module('app')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('settings', {
    url: '/settings',
    views: {
      header: {templateUrl: 'modules/common/navigation.tpl.html', controller : 'HeaderNavController'},
      body: {templateUrl: 'modules/settings/wizard.tpl.html', controller: 'WizardCtrl'}
    }
  });
}])
.controller('WizardCtrl', ['$scope', 'storage', '$stateParams',
  function WizardCtrl($scope, storage, $stateParams) {
    $scope.authentication = null;
    $scope.pin = null;
    $scope.host = {
      ip: '',
      port: '9090',
      httpPort : '8080',
      displayName: '',
      default : false,
      username : 'kodi',
      password : '',
      videoAddon : 'plugin.video.youtube'
    };
    $scope.autoScrobble = true;
    var setAutoScrobble = function(data) {
      $scope.autoScrobble = data
    };
    var setToken = function(data){
      if(data) {
        $scope.authentication = data;
      }
    };

    $scope.save = function () {
      if(this.wizard.$valid) {
        $scope.hosts.splice(0,1,$scope.host);
        storage.setItem('hosts', $scope.hosts);
        $scope.initialize($scope.host);
        $scope.go('/');
        $scope.trakt.autoScrobble($scope.autoScrobble);
      }
    };

    $scope.refreshToken = function() {
      $scope.trakt.getToken($scope.authentication.refresh_token, 'refresh_token').then(setToken);
    }

    $scope.$watch('pin', function(newVal, oldVal) {
      if(newVal) {
        $scope.trakt.getToken(newVal).then(setToken);
      }
    });

    $scope.$watch('hosts', function(newVal, oldVal) {
      var filterDefault = function(el) {
        return el.default;
      }
      var filtered = $scope.hosts.filter(filterDefault);
      if(filtered.length ===1) {
        var host = filtered[0];
        host.videoAddon = host.videoAddon || 'plugin.video.youtube';
        angular.copy(host, $scope.host);
      }
    });

    storage.getItem('trakt-authentication').then(setToken);
    storage.getItem('trakt-autoscrobble').then(setAutoScrobble);
  }
]);
angular.module('app')
.controller('ShowsCalendarCtrl', ['$scope', '$filter', '$interpolate', '$anchorScroll', '$http',
  function ShowsCalendarCtrl($scope, $filter, $interpolate, $anchorScroll, $http) {
    var playFn = $interpolate('http://{{ip}}:{{port}}/jsonrpc?request={ "jsonrpc": "2.0", "method": "Player.Open", "params" : {"item": { "file": "{{path}}" }}, "id": {{uid}}}');
    var autoscroll = true;
    $scope.fetching = false;
    $scope.tvshows = [];
    $scope.refDate = moment();
    $scope.tvshows = [];
    $scope.shows = {};
    var hasAds = false;

    function getDates(date, ref) {
      date.subtract(date.day(), 'd');
      var dates = [];
      var days = ref.diff(date, 'days');
      for(var i=0; i< days; i++){
        dates.push(moment(date));
        date.add(1, 'd');
      }
      //Fill the rest of the week
      while(date.day() !== 0) {
        dates.push(moment(date));
        date.add(1, 'd');
      }
      return dates;
    };

    function onTvShowsFromSource(result) {
      var tvshows = result ? result.data : [];
      $scope.tvshows = tvshows;
      $scope.shows = $scope.getShows();
      $scope.dates = dates;
      $scope.fetching = false;
    };

    function load(date, ref) {
      hasAds = false;
      dates = getDates(date, ref);
      var days = dates[dates.length-1].diff(dates[0], 'days');
      $scope.trakt.calendar.myShows(dates[0].toDate(), days).then(onTvShowsFromSource);
    };

    if ($scope.trakt.isAuthenticated()) {
      var iterator = moment().startOf('month');
      load(iterator, moment().startOf('month').add(1, 'month'));
    } else {
      $scope.trakt.connect().then(function(){
        var iterator = moment().startOf('month');
        load(iterator, moment().startOf('month').add(1, 'month'));
      }, function() {
        $scope.go('/settings');
      });
    }

    $scope.getPoster = function (show) {
      return show.episode.images.screenshot.thumb || show.show.images.fanart.thumb;
    };

    $scope.getBanner = function (show) {
      return show.images.banner.full || show.images.thumb.full;
    };

    $scope.getRandomImage = function () {
      return Math.floor(Math.random()*100)%11 + 1;
    }

    $scope.getShows = function () {
      var shows = {};
      $scope.tvshows.forEach(function(tvshow){
        var showIds = tvshow.show.ids;
        if(!shows.hasOwnProperty(showIds.trakt)){
          shows[showIds.trakt] = angular.copy(tvshow.show);
        }
        shows[showIds.trakt].hit = shows[showIds.trakt].hit ? shows[showIds.trakt].hit+1 : 1;
      });
      return shows;
    };

    $scope.highlight = function (show) {
      $scope.tvshows.forEach(function(tvshow){
        if(tvshow.show.ids.trakt !== show.ids.trakt) {
          tvshow.fade = true;
        } else {
          tvshow.fade = false;
        }
      });
    };

    $scope.showsCount = function () {
      return Object.keys($scope.shows).length;
    }

    $scope.getEpisodesFor = function(date, criteria) {
      criteria = criteria || 'day';
      return $scope.tvshows.filter(function(show){
        var airDate = moment(show.first_aired);
        return date.isSame(airDate, criteria);
      });
    };

    $scope.isFuture = function(date){
      return date.month()> $scope.refDate.month();
    };

    $scope.isPast = function(date){
      return date.month()< $scope.refDate.month();
    };

    $scope.isToday = function(date){
      var now = moment();
      return date.isSame(now, 'day');
    };

    $scope.play = function(show){
      $scope.helper.foreign.shows.play($scope.host, show.show, show.episode);
    };

    $scope.previousMonth = function () {
      if(!$scope.fetching) {
        $scope.fetching = true;
        document.querySelector('.cal-grid').scrollTop = 0;
        var startOfMonth = $scope.refDate.startOf('month');
        var date = moment(startOfMonth).subtract(1, 'd').startOf('month');
        $scope.refDate = moment(date);
        load(date, startOfMonth.subtract(1,'d'));
      }
    };

    $scope.nextMonth = function() {
      if(!$scope.fetching) {
        $scope.fetching = true;
        document.querySelector('.cal-grid').scrollTop = 0;
        var startOfMonth = $scope.refDate.startOf('month').add(1, 'month');
        $scope.refDate = moment(startOfMonth);
        var date = moment(startOfMonth);
        load(date, startOfMonth.add(1, 'month'));
      }
    };

    $scope.$on('onRepeatLast', function(scope, element, attrs){
      if($scope.tvshows.length) {
        var ads =  document.querySelectorAll('.cal-grid .support');
        var num = Math.round(Math.random()*ads.length);
        ads[Math.min(num, ads.length-1)].style.display = 'block';
      }
    }.bind(this));
  }
]);

var BaseTVShowDetailsCtrl = function ($scope, $stateParams) {
  $scope.loading = true;
  $scope.tvshowid = parseInt($stateParams.tvshowid);

  $scope.show = null;
  $scope.season = null;
  $scope.seasons = [];
  $scope.selectedSeason = '';

  $scope.episodes = [];
  $scope.nextAiringEpisode = null;
  $scope.comments = [];

  $scope.seasonName = function (season) {
    return 'Season '+season.season;
  };

  $scope.setNextAiringEpisode = function(episodes) {
    episodes = episodes || [];
    var now = Date.now();
    var futureEpisode = episodes.filter(function(episode){
      var airDate = new Date(episode.firstaired);
      return airDate.getTime() > now;
    });
    if(futureEpisode.length>0) {
      $scope.nextAiringEpisode  = futureEpisode[0];
    }
  };

  $scope.additionalImages = function (tvshowid) {
    $scope.tmdb.tv.images(tvshowid).then(function(result){
      $scope.fanarts = result.data.fanarts || [];
    });
  };

  $scope.getTraktAdditionalInfo = function (season) {
    if($scope.show) {
      $scope.comments =[];
      $scope.trakt.seasons.stats($scope.show.traktSlug, season.season).then(function(result){
        $scope.stats = result.data;
      });
      $scope.trakt.seasons.watching($scope.show.traktSlug, season.season).then(function(result){
        $scope.watching = result.data;
      });
      $scope.trakt.seasons.comments($scope.show.traktSlug, season.season).then(function(result){
        var sortFn = function(o1, o2) {
          if(o1.likes > o2.likes) {
            return -1;
          } else if(o1.likes < o2.likes) {
            return 1;
          } else {
            return 0;
          }
        };
        if(result.data &&  angular.isArray(result.data)) {
          var comments = result.data.sort(sortFn);
          $scope.comments = comments.slice(0, Math.min(comments.length, 3));
        }
      });
    }
  };

  $scope.getYear = function (show, season){
    var year = parseInt(show.year);
    if(season) {
      var number = parseInt(season.season);
      if(!isNaN(year) && !isNaN(number)) {
        return year + number - 1;
      } else {
        return year;
      }
    }
  };

  $scope.$watch('season', function () {
    $scope.getTraktAdditionalInfo($scope.season);
  });

  $scope.previousSeason = function () {
    var index = $scope.seasons.indexOf($scope.season);
    if(index - 1 > -1) {
      $scope.season = $scope.seasons[index-1];
      $scope.changeSeason($scope.season);
    }
  };

  $scope.nextSeason = function () {
    var index = $scope.seasons.indexOf($scope.season);
    if(index + 1 < $scope.seasons.length) {
      $scope.season = $scope.seasons[index+1];
      $scope.changeSeason($scope.season);
    }
  };

  var detail = document.querySelector('.tvshow.detail');
  detail.onscroll = function () {
    if(detail.scrollTop > 200) {
      if(!detail.classList.contains('affixable')) {
        var sidebar = detail.querySelector('.description > .sidebar');
        var dimension = sidebar.getBoundingClientRect();
        detail.classList.add('affixable');
        sidebar.style.marginLeft = dimension.left + 'px';
        sidebar.style.width = dimension.width + 'px';
      }
    } else {
      var sidebar = detail.querySelector('.description > .sidebar');
      detail.classList.remove('affixable');
      sidebar.removeAttribute('style');
    }
  };
};

angular.module('app')
.controller('XBMCShowDetailsCtrl', ['$scope', '$injector', '$stateParams', '$filter',
  function XBMCShowDetailsCtrl($scope, $injector, $stateParams, $filter) {
    $injector.invoke(BaseTVShowDetailsCtrl, this, {$scope: $scope, $stateParams: $stateParams});

    $scope.updating = false;
    $scope.queue = [];

    var onPlaylistAdd = function () {
      if($scope.queue.length > 0) {
        $scope.xbmc.queue({episodeid: $scope.queue[0].episodeid});
        $scope.queue = $scope.queue.slice(1);
        if ($scope.queue.length > 0) {
          window.setTimeout(onPlaylistAdd.bind(this), 500);
        }
      }
    };

    function isCurrentlyPlaying(episodeid) {
      return $scope.player.active && episodeid === $scope.library.item.episodeid;
    };

    $scope.isUsingExternalAddon = function () {
      return false;
    };

    function onEpisodesRetrieved(episodes) {
      $scope.loading = false;
      $scope.episodes = episodes;
    };

    function onSeasonsRetrieved(seasons) {
      $scope.seasons = seasons || [];
      if($scope.seasons.length > 0) {
        $scope.season = seasons[seasons.length-1];

        $scope.xbmc.getEpisodes($scope.tvshowid, $scope.season.season, onEpisodesRetrieved);
      } else {
        $scope.loading = false;
      }

      $scope.tmdb.find('tvdb_id', $scope.show.imdbnumber).then(function(result){
        var shows = result.data.tvShows;
        if(shows.length === 1) {
          $scope.additionalImages(shows[0].id);
          $scope.tmdb.tv.episodes(shows[0].id).then(function(result){
            var episodes = result.data.episodes;
            $scope.setNextAiringEpisode(episodes);
          })
        }
      });
    };

    function onTvShowRetrieved(show) {
      $scope.show = show;
      var name = $scope.show.name || $scope.show.title;
      $scope.show.traktSlug = name.replace(/ |\.|\'/gi, '-').toLowerCase();
      $scope.xbmc.getSeasons($scope.tvshowid, onSeasonsRetrieved);
    };

    var onLoad = function() {
      $scope.xbmc.getTVShowDetails($scope.tvshowid, onTvShowRetrieved);
    };

    $scope.xbmc.register('VideoLibrary.OnScanFinished', {
      fn: onLoad,
      scope: this
    });
    if ($scope.xbmc.isConnected()) {
      onLoad();
    } else {
      $scope.xbmc.register('Websocket.OnConnected', {
        fn: onLoad,
        scope: this
      });
    }

    $scope.$watch('playlist', function () {
      onPlaylistAdd();
    }, true);

    $scope.changeSeason = function (season) {
      $scope.xbmc.getEpisodes($scope.tvshowid, season.season, onEpisodesRetrieved);
      $scope.getTraktAdditionalInfo(season);
    };

    $scope.getImage = function (path) {
      var url = $filter('asset')(path, $scope.host);
      return $filter('fallback')(url, 'img/icons/awe-512.png');
    };

    $scope.hasControls = function () {
      return true;
    };

    $scope.play = function(episode){
      $scope.helper.local.shows.play(episode);
    };

    $scope.queueAll = function () {
      $scope.xbmc.queue({episodeid : $scope.episodes[0].episodeid});
      $scope.queue = $scope.episodes.slice(1);
    };

    $scope.remove = function (index, episode) {
      var onEpisodeRemoved = function(){
        $scope.episodes.splice(index, 1);
      };
      $scope.xbmc.removeEpisode(episode.episodeid, onEpisodeRemoved);
    };

    $scope.toggleWatched = function (episode) {
      var newValue =  episode.playcount ? 0 : 1;
      $scope.xbmc.setEpisodeDetails({
        episodeid : episode.episodeid,
        playcount  :newValue
      },  function(result) {
        if(result === 'OK') {
          episode.playcount = newValue;
        }
      })
    };
  }
]).controller('TMDBShowDetailsCtrl', ['$scope', '$injector', '$stateParams', '$location', '$filter', '$http', '$interpolate',
  function TMDBShowDetailsCtrl($scope, $injector, $stateParams, $location, $filter, $http, $interpolate) {
    $injector.invoke(BaseTVShowDetailsCtrl, this, {$scope: $scope, $stateParams: $stateParams});
    $scope.tvdbid = null;
    var playFn = $interpolate('http://{{ip}}:{{port}}/jsonrpc?request={ "jsonrpc": "2.0", "method": "Player.Open", "params" : {"item": { "file": "{{path}}" }}, "id": {{uid}}}');
    function onEpisodesRetrieved(result) {
      $scope.loading = false;
      var now = new Date();
      var episodes = result.data.episodes;
      $scope.setNextAiringEpisode(episodes);
      $scope.episodes = episodes.filter(function(episode){
        var airDate = new Date(episode.firstaired);
        return airDate.getTime() < now;
      }).reverse();

    };

    function onTvShowRetrieved(result) {
      $scope.show = result.data;
      var name = $scope.show.name || $scope.show.title;
      $scope.show.traktSlug = name.replace(/ |\.|\'/gi, '-').toLowerCase();
      $scope.show.year = moment($scope.show.firstaired).format('YYYY');
      if($scope.show.seasons.length > 0) {
        $scope.seasons = $scope.show.seasons;
        $scope.season = $scope.show.seasons[$scope.show.seasons.length-1];
        $scope.tmdb.tv.seasons($scope.tvshowid, $scope.season.season).then(onEpisodesRetrieved);
        $scope.tmdb.tv.externalIDs($scope.tvshowid).then(onExternalIDsRetrieved);
        $scope.additionalImages($scope.tvshowid);
      } else {
        $scope.loading = false;
      }
    };

    function onExternalIDsRetrieved (result) {
      $scope.tvdbid = result.data.tvdbid;
      result.data.tmdbid = $scope.tvshowid;
      $scope.show.ids = result.data;
    };

    $scope.tmdb.tv.details($scope.tvshowid).then(onTvShowRetrieved);

    $scope.changeSeason = function (season) {
      $scope.tmdb.tv.seasons($scope.tvshowid, season.season).then(onEpisodesRetrieved);
      $scope.getTraktAdditionalInfo(season);
    };

    $scope.getImage = function (path, size) {
      var url = $filter('tmdbImage')(path, size || 'original');
      return $filter('fallback')(url, 'img/icons/awe-512.png');
    };

    $scope.isUsingExternalAddon = function () {
      return true;
    };

    $scope.play = function(episode){
      $scope.helper.foreign.shows.play($scope.host, $scope.show, episode);
    };
  }
]);
angular.module('app')
.controller('EpisodesCtrl', ['$scope',
  function EpisodesCtrl($scope) {
    $scope.loading = true;
    $scope.fetching = false;
    $scope.empty = false;

    $scope.requestItemsBy = 50;
    $scope.total = Infinity;
    $scope.episodes = [];

    function onEpiosdesFromSource(result) {
      var episodes = result && result.episodes ? result.episodes : [];
      $scope.total = result ? result.limits.total : Infinity;
      $scope.episodes = $scope.episodes.concat(episodes);
      $scope.loading = false;
      $scope.fetching = false;
      $scope.empty = !$scope.episodes.length;
    };

    function onLoad() {
      var limits =  {
        'start' : 0,
        'end' : $scope.requestItemsBy
      }
      $scope.xbmc.getRecentlyAddedEpisodes(onEpiosdesFromSource, limits);
    };

    if ($scope.xbmc.isConnected()) {
      onLoad();
    } else {
      $scope.xbmc.register('Websocket.OnConnected', {
        fn: onLoad,
        scope: this
      });
    }

    $scope.loadMore = function () {
      if( $scope.episodes.length < $scope.total) {
        $scope.fetching = true;
        var limits =  {
          'start' : $scope.episodes.length,
          'end' : Math.min($scope.episodes.length+$scope.requestItemsBy, $scope.total)
        };
        $scope.xbmc.getRecentlyAddedEpisodes(onEpiosdesFromSource, limits);
      }
    };

    $scope.remove = function (index, episode) {
      var onEpisodeRemoved = function(){
        $scope.episodes.splice(index, 1);
      };
      $scope.xbmc.removeEpisode(episode.episodeid, onEpisodeRemoved);
    };

    $scope.toggleWatched = function (episode) {
      var newValue =  episode.playcount ? 0 : 1;
      $scope.xbmc.setEpisodeDetails({
        episodeid : episode.episodeid,
        playcount  :newValue
      },  function(result) {
        if(result === 'OK') {
          episode.playcount = newValue;
        }
      })
    };
  }]
);
angular.module('app')
.controller('ShowsCtrl', ['$scope', '$filter',
  function ShowsCtrl($scope, $filter) {
    $scope.loading = true;
    $scope.fetching = false;
    $scope.empty = false;

    $scope.requestItemsBy = 50;
    $scope.total = Infinity;
    $scope.tvshows = [];
    $scope.supportIndex = -1;

    function onTvShowsFromSource(result) {
      var tvshows = result && result.tvshows ? result.tvshows : [];
      $scope.total = result ? result.limits.total : Infinity;
      $scope.tvshows = $scope.tvshows.concat(tvshows);
      $scope.loading = false;
      $scope.fetching = false;
      $scope.empty = !$scope.tvshows.length;
    };

    function onLoad() {
      var limits =  {
        'start' : 0,
        'end' : $scope.requestItemsBy
      }
      $scope.xbmc.getTVShows(onTvShowsFromSource, limits);
    };

    if ($scope.xbmc.isConnected()) {
      onLoad();
    } else {
      $scope.xbmc.register('Websocket.OnConnected', {
        fn: onLoad,
        scope: this
      });
    }

    $scope.loadMore = function () {
      if( $scope.tvshows.length < $scope.total) {
        $scope.fetching = true;
        var limits =  {
          'start' : $scope.tvshows.length,
          'end' : Math.min($scope.tvshows.length+$scope.requestItemsBy, $scope.total)
        };
        $scope.xbmc.getTVShows(onTvShowsFromSource, limits);
      }
    };

    $scope.hasControls = function () {
      return true;
    };

    $scope.getEpisodesPath = function(show) {
      return '#/tvshows/'+show.tvshowid;
    };

    $scope.getExtra = function (show) {
      return show.episode + ' espisodes';
    };

    $scope.getName = function (show) {
      return show.title;
    }

    $scope.getPoster = function (show) {
      var url = $filter('asset')(show.thumbnail, $scope.host);
      return $filter('fallback')(url, 'img/icons/awe-512.png');
    };

    $scope.getRating = function(show){
      return show.rating;
    };

    $scope.getStudio = function(show) {
      return $scope.studioFn({studio : show.studio[0]});
    };

    $scope.remove = function (index, show) {
      var onTVShowRemoved = function(){
        $scope.tvshows.splice(index, 1);
      };
      $scope.xbmc.removeTVShow(show.tvshowid, onTVShowRemoved);
    };

    $scope.toggleWatched = function (show) {
      var newValue =  show.playcount ? 0 : 1;
      $scope.xbmc.setTVShowDetails({
        tvshowid : show.tvshowid,
        playcount  :newValue
      },  function(result) {
        if(result === 'OK') {
          show.playcount = newValue;
        }
      })
    };
  }
]);
angular.module('app')
.controller('PopularShowsCtrl', ['$scope', '$filter',
  function PopularShowsCtrl($scope, $filter) {
    $scope.loading = true;
    $scope.fetching = false;
    $scope.tvshows = [];
    $scope.pages = 1;
    $scope.total = Infinity;
    $scope.supportIndex = -1;

    var now = new Date();
    var firstAirDate = (now.getFullYear()-5)+'-01-01';
    var cleanUpResults = function(results) {
      return results.filter(function(show){
        return show.rating > 0;
      });
    };

    function onTvShowsFromSource(response) {
      $scope.total = response.data.totalPages;
      $scope.tvshows = $scope.tvshows.concat(cleanUpResults(response.data.results));
      if($scope.supportIndex === -1) {
        $scope.supportIndex = 5 + Math.floor(Math.random()*($scope.tvshows.length-5));
      }
      $scope.fetching = false;
      $scope.loading = false;
    };

    $scope.tmdb.tv.populars(firstAirDate, 5, $scope.pages).then(onTvShowsFromSource);

    $scope.hasControls = function () {
      return false;
    };

    $scope.getEpisodesPath = function(show) {
      return '#/tvshows/tmdb/'+show.id;
    };

    $scope.getExtra = function (show) {
      return moment(show.firstaired).format('YYYY');
    };

    $scope.getPoster = function (show) {
      var url = $filter('tmdbImage')(show.poster, 'w500');
      return $filter('fallback')(url, 'img/icons/awe-512.png');
    };
;

    $scope.getStudio = function(show) {
      return 'img/icons/default-studio.png';
    };

    $scope.loadMore = function () {
      if( $scope.pages < $scope.total) {
        $scope.fetching = true;
        $scope.tmdb.tv.populars(firstAirDate, 5, ++$scope.pages).then(onTvShowsFromSource);
      }
    };

  }]
);
angular.module('app')
.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('tvshows', {
      url: '/tvshows',
      views: {
        header: {templateUrl: 'modules/common/navigation.tpl.html', controller : 'HeaderNavController'},
        body: { templateUrl: 'modules/tvshow/shows.tpl.html', controller: 'TvShowListCtrl'}
      }
    }).state('tvshows.all', {
      url : '/all',
      templateUrl: 'modules/tvshow/list.tpl.html',
      controller: 'ShowsCtrl'
    }).state('tvshows.recents', {
      url: '/recents',
      templateUrl: 'modules/tvshow/episodes.tpl.html',
      controller: 'EpisodesCtrl'
    }).state('tvshows.popular', {
      url : '/popular',
      templateUrl: 'modules/tvshow/list.tpl.html',
      controller: 'PopularShowsCtrl'
    }).state('tvshows.calendar', {
      url: '/calendar',
      templateUrl: 'modules/tvshow/calendar.tpl.html',
      controller: 'ShowsCalendarCtrl'
    }).state('tvshows.seasons', {
      url: '/:tvshowid',
      templateUrl: 'modules/tvshow/details.tpl.html',
      controller: 'XBMCShowDetailsCtrl'
    }).state('tvshows.tmdb', {
      url: '/tmdb/:tvshowid',
      templateUrl: 'modules/tvshow/details.tpl.html',
      controller: 'TMDBShowDetailsCtrl'
    });
  }
])
.controller('TvShowListCtrl', ['$scope',
  function TvShowListCtrl($scope) {
    $scope.isSelected = function (stateName) {
      return $scope.$state.current.name === stateName;
    }
  }
]);
angular.module('services.helper', ['services.storage'])
.factory('helper', ['$http', '$interpolate', 'storage',
  function($http, $interpolate, storage) {
    var playFn = $interpolate('http://{{ip}}:{{port}}/jsonrpc?request={ "jsonrpc": "2.0", "method": "Player.Open", "params" : {"item": { "file": "{{path}}" }}, "id": {{uid}}}');
    
    var xbmc, tmdb;
    var factory = {
      local : {
        movies : {},
        shows : {},
        musics : {},
      },
      foreign : {
        movies : {},
        shows : {}
      }
    };
    
    factory.setProviders = function (providers) {
      xbmc = providers.xbmc || null;
      tmdb = providers.tmdb || null;
    };

    factory.local.movies.play = function (movie) {
      xbmc.open({'movieid': movie.movieid});
    };

    factory.local.shows.play = function (episode) {
      xbmc.open({'episodeid': episode.episodeid});
    };

    factory.local.musics.play = function (key, item) {
      var data = {};
      data[key] = item[key];
      xbmc.open(data);
    };

    factory.foreign.movies.play = function (host, movie) {
      var title = movie.name || movie.title;
      if(host.videoAddon.toLowerCase().indexOf('youtube')>-1) {
        xbmc.open({'file': movie.trailer});
      } else if(host.videoAddon.toLowerCase().indexOf('genesis') > -1) {
        xbmc.executeAddon({
          addonid : 'plugin.video.genesis',
          params : 'action=movieSearch'+
                   '&query='+title.replace(/:/gi, ' ')
        });
      } else if(host.videoAddon.toLowerCase().indexOf('pulsar') > -1) {
        var path = '/movie/'+movie.imdbnumber+'/play';
        var url = playFn({
          ip : host.ip,
          port : host.httpPort,
          path : 'plugin://'+ host.videoAddon + path,
          uid : Date.now()
        });
        $http.get(url);
      }
    };

    factory.foreign.shows.play = function (host, show, episode) {
      var tvdb =  show.ids.tvdb || show.ids.tvdbid;
      var tmdb = show.ids.tmdb || show.ids.tmdbid;
      var imdb =  show.ids.imdb || show.ids.imdbnumber;
      var number = episode.number || episode.episode;
      var season = episode.season;
      var title = show.name || show.title;
      var year = episode.hasOwnProperty('firstaired') ? moment(episode.firstaired).year() : episode.year;
      var firstaired = episode.hasOwnProperty('firstaired') ?  moment(episode.firstaired) :  moment(episode.first_aired);

      if(host.videoAddon.toLowerCase().indexOf('youtube') > -1) {
        tmdb.tv.videos(show.ids.tmdbid, season, number).then(function(result){
            var videos = result.data.results;
            var pluginURL = 'plugin://'+host.videoAddon+'/?action=play_video&videoid='+videos[0].key;
            xbmc.open({file: pluginURL});
        });
      } else if(host.videoAddon.toLowerCase().indexOf('genesis') > -1) {
        xbmc.executeAddon({
          addonid : 'plugin.video.genesis',
          params : 'action=episodes'+
                   '&imdb='+ imdb.replace('tt', '')+
                   '&season='+season+
                   '&tmdb='+tmdb+
                   '&tvdb='+tvdb+
                   '&tvshowtitle='+title+
                   '&year='+year
        });
      } else if(host.videoAddon.toLowerCase().indexOf('pulsar') > -1) {
        var path = '/show/'+tvdb+'/season/'+season+'/episode/'+number+'/play';
        var url = playFn({
          ip : host.ip,
          port : host.httpPort,
          path : 'plugin://plugin.video.pulsar' + path,
          uid : Date.now()
        })
        $http.get(url);
      }
    };

    return factory;
  }
]);
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
  angular.module('services.tmdb', [
    'services.tmdb.transform'
    ])
  .factory('tmdb', ['$q', '$http', '$interpolate', 'transform',
    function($q, $http, $interpolate, transform) {
      var apiKey = 'a76cc8ff9e26a5f688544d73c90e4807';
      var factory = {
        movies : {},
        tv : {}
      };
      var interpolateFn = $interpolate('http://api.themoviedb.org/3/{{action}}?api_key={{apiKey}}{{parameters}}');
      var headers = {
        'Accept' : 'application/json'
      };

      var getConfig = function (url, method) {
        return {
          url: url,
          method: method,
          headers : headers,
          transformResponse:  appendTransform($http.defaults.transformResponse, function(value) {
            return transform.translate(value);
          })
        };
      };

      var appendTransform = function(defaults, transform) {
        defaults = angular.isArray(defaults) ? defaults : [defaults];
        return defaults.concat(transform);
      };

      factory.find = function (source, id) {
        var url = interpolateFn({
          action : 'find/'+id,
          apiKey : apiKey,
          parameters : '&external_source='+source
        });
        return $http(getConfig(url, 'GET'));
      };

      factory.search = function (query, page) {
        var url = interpolateFn({
          action : 'search/multi',
          apiKey : apiKey,
          parameters : '&query='+query+'&page='+page
        });
        return $http(getConfig(url, 'GET'));
      };

      factory.movies.details = function (id) {
        var url = interpolateFn({
          action : 'movie/'+id,
          apiKey : apiKey,
          parameters : ''
        });
        return $http(getConfig(url, 'GET'));
      };

      factory.movies.videos = function (id) {
        var url = interpolateFn({
          action : 'movie/'+id+'/videos',
          apiKey : apiKey,
          parameters : ''
        });
        return $http(getConfig(url, 'GET'));
      };

      factory.movies.credits = function (id) {
        var url = interpolateFn({
          action : 'movie/'+id+'/credits',
          apiKey : apiKey,
          parameters : ''
        });
        return $http(getConfig(url, 'GET'));
      };

      factory.movies.images = function (id) {
        var url = interpolateFn({
          action : 'movie/'+id+'/images',
          apiKey : apiKey,
          parameters : ''
        });
        return $http(getConfig(url, 'GET'));
      };

      factory.tv.populars = function (firstAirDateGte, voteAverageGte, page) {
        page = page || 1;
        var url = interpolateFn({
          action : 'discover/tv',
          apiKey : apiKey,
          parameters : '&page='+page+'&first_air_date.gte='+firstAirDateGte+'&sort_by=popularity.desc&vote_average.gte='+voteAverageGte
        });
        return $http(getConfig(url, 'GET'));
      };

      factory.movies.populars = function (primaryReleaseDate, voteAverageGte, page) {
        page = page || 1;
        var url = interpolateFn({
          action : 'discover/movie',
          apiKey : apiKey,
          parameters : '&page='+page+'&primary_release_date.gte='+primaryReleaseDate+'&sort_by=popularity.desc&vote_average.gte='+voteAverageGte
        });
        return $http(getConfig(url, 'GET'));
      };

      factory.movies.similars = function (id, page) {
        var url = interpolateFn({
          action : 'movie/'+id+'/similar',
          apiKey : apiKey,
          parameters : '&page='+page
        });
        return $http(getConfig(url, 'GET'));
      };

      factory.tv.details = function (id) {
        var url = interpolateFn({
          action : 'tv/'+id,
          apiKey : apiKey,
          parameters : ''
        });
        return $http(getConfig(url, 'GET'));
      };

      factory.tv.externalIDs = function (id, season, episode) {
        var path = 'tv/'+id;
        if(season) {
          path += '/season/'+season;
        }
        if(episode) {
          path += '/episode/'+episode;
        }
        path += '/external_ids';
        var url = interpolateFn({
          action : path,
          apiKey : apiKey,
          parameters : ''
        });
        return $http(getConfig(url, 'GET'));
      };

      factory.tv.images = function (id, season, episode) {
        var path = 'tv/'+id;
        if(season) {
          path += '/season/'+season;
        }
        if(episode) {
          path += '/episode/'+episode;
        }
        path += '/images';
        var url = interpolateFn({
          action : path,
          apiKey : apiKey,
          parameters : ''
        });
        return $http(getConfig(url, 'GET'));
      }

      factory.tv.seasons = function (id, season) {
        var url = interpolateFn({
          action : 'tv/'+id+'/season/'+season,
          apiKey : apiKey,
          parameters : ''
        });
        return $http(getConfig(url, 'GET'));
      };

      factory.tv.episodes = function(id) {
        var defer = $q.defer();
        factory.tv.details(id).then(function(result) {
          var tv = result.data;
          var latestSeason = tv.seasons[tv.seasons.length-1];
          factory.tv.seasons(tv.id, latestSeason.season).then(function(result){
            defer.resolve(result);
          });
        });
        return defer.promise;
      };

      factory.tv.videos = function (id, season, episode) {
        var url = interpolateFn({
          action : 'tv/'+id+'/season/'+season+'/episode/'+episode+'/videos',
          apiKey : apiKey,
          parameters : ''
        });
        return $http(getConfig(url, 'GET'));
      };
      return factory;
    }
  ]);
angular.module('services.trakt', [])
.factory('trakt', ['$q', '$http', '$filter', '$interpolate', 'storage',
  function($q, $http, $filter, $interpolate, storage) {
    var $date = $filter('date');
    var notifications = {};
    var factory = {
      calendar : {},
      episodes : {},
      movies : {},
      scrobble : {},
      seasons : {},
      shows : {},
      sync : {}
    };
    var authentication = null;
    var autoscrobble = true;
    var client = {
      id : '1fdcdbccbaf950016ced2896817e8752cfa77250c7720b58b493a12505a49de5',
      secret : '14eebc65a444d9e4336238d9643c76ba31f34a19d9a6e03cb0e3219b42102886'
    };
    var headers = {
        'Content-Type' : 'application/json',
        'trakt-api-version' : 2,
        'trakt-api-key' : client.id
      };

    var interpolateFn = $interpolate('https://api-v2launch.trakt.tv/{{action}}?extended=images,full,metadata{{parameters}}');


    var getConfig = function (url, method, data) {
      headers['X-Proxy-URL'] = url;
      var config = {
        url: 'http://arch.abricot.ovh/trakt.php?t='+Date.now(),
        method: method,
        headers : headers,
        cache : false
      };
      if(data) {
        config.data = data;
      }
      return config;
    }

    factory.autoScrobble = function(value) {
      if(typeof value !== 'undefined') {
        storage.setItem('trakt-autoscrobble', value);
        autoscrobble = value;
      } else {
        return autoscrobble;
      }
    };

    factory.getToken = function (code, grantType) {
      var type = 'code';
      grantType = grantType || 'authorization_code';
      if(grantType === 'refresh_token') {
          type = 'refresh_token';
      }
      var defer = $q.defer();
      var url = interpolateFn({
        action : 'oauth/token'
      });
      var data = {
        'client_id': client.id,
        'client_secret': client.secret,
        'redirect_uri': 'urn:ietf:wg:oauth:2.0:oob'
      };
      data[type] = code;
      data['grant_type'] = grantType;
      $http(getConfig(url, 'POST', data)).
      success(function(data, status, headers, config) {
        if(data) {
          data.created_at = Date.now();
          data.expires_at = Date.now() + data.expires_in * 1000;
          storage.setItem('trakt-authentication', data);
          authentication = data;
          headers['trakt-authorization'] = 'Bearer '+data.access_token;
        }
        defer.resolve(data);
      });
      return defer.promise;;
    };

    factory.isAuthenticated = function () {
      return authentication !== null;
    };


    factory.calendar.myShows = function (startDate, days) {
      var action = 'calendars/my/shows/'+$date(startDate, 'yyyy-MM-dd') + '/'+days;
      var url = interpolateFn({
          action : action
        });
        return $http(getConfig(url, 'GET'));
    };

    factory.episodes.summary = function(id, season, episode) {
      var action = 'shows/'+id+'/seasons/'+season+'/episodes/'+episode;
      var url = interpolateFn({
        action : action
      });
      return $http(getConfig(url, 'GET'));
    };

    factory.episodes.stats = function(id, season, episode) {
      var action = 'shows/'+id+'/seasons/'+season+'/episodes/'+episode+'/stats';
      var url = interpolateFn({
        action : action
      });
      return $http(getConfig(url, 'GET'));
    };

    factory.movies.comments = function(id) {
      var action = 'movies/'+id+'/comments';
      var url = interpolateFn({
        action : action,
        parameters : '&page=1&limit=50'
      });
      return $http(getConfig(url, 'GET'));
    };

    factory.movies.summary = function(id) {
      var action = 'movies/'+id;
      var url = interpolateFn({
        action : action
      });
      return $http(getConfig(url, 'GET'));
    };

    factory.movies.stats = function(id) {
      var action = 'movies/'+id+'/stats';
      var url = interpolateFn({
        action : action
      });
      return $http(getConfig(url, 'GET'));
    };

    factory.scrobble.pause = function (type, item, progress) {
      return factory.scrobble._action('scrobble/pause', type, item, progress);
    };

    factory.scrobble.start = function (type, item, progress) {
      return factory.scrobble._action('scrobble/start', type, item, progress);
    };

    factory.scrobble.stop = function (type, item, progress) {
      return factory.scrobble._action('scrobble/stop', type, item, progress);
    };

    factory.seasons.comments = function(id, season) {
      var action = 'shows/'+id+'/seasons/'+season+'/comments';
      var url = interpolateFn({
        action : action,
        parameters : '&page=1&limit=50'
      });
      return $http(getConfig(url, 'GET'));
    };

    factory.seasons.stats = function(id, season) {
      var action = 'shows/'+id+'/seasons/'+season+'/stats';
      var url = interpolateFn({
        action : action
      });
      return $http(getConfig(url, 'GET'));
    };

    factory.seasons.watching = function(id, season) {
      var action = 'shows/'+id+'/seasons/'+season+'/watching';
      var url = interpolateFn({
        action : action
      });
      return $http(getConfig(url, 'GET'));
    };

    factory.scrobble._action = function (action, type, item, progress) {
      var data = {
        progress : progress
      };
      data[type] = item;
      var url = interpolateFn({
        action : action
      });
      var config = getConfig(url, 'POST');
      config.data = data;
      return $http(config);
    };

    factory.shows.summary = function(id) {
      var action = 'shows/'+id;
      var url = interpolateFn({
        action : action
      });
      return $http(getConfig(url, 'GET'));
    };

    factory.sync.get = function (method, mediaType) {
      var action = 'sync/'+method+'/'+mediaType;
      var url = interpolateFn({
        action : action
      });
      return $http(getConfig(url, 'GET'));
    };

    factory.sync.add = function (method, mediaType, obj) {
      var action = 'sync/'+method;
      return factory.sync._action(action, mediaType, obj);
    };

    factory.sync.remove = function (method, mediaType, obj) {
      var action = 'sync/'+method+'/remove';
      return factory.sync._action(action, mediaType, obj);
    };

    factory.sync._action = function (action, mediaType, obj) {
      var data = {};
      data[mediaType] = [obj];
      var url = interpolateFn({
        action : action
      });
      return $http(getConfig(url, 'POST', data));
    };

    factory.connect = function() {
      var defer = $q.defer();
      storage.getItem('trakt-authentication').then(function(data) {
        var callbacks = [];
        if(data) {
          authentication = data;
          var expeiresAt = authentication['expires_at'];
          var now = Date.now();
          var aWeek = 7 * 24 * 60 * 60 * 1000;
          if(expeiresAt - now < aWeek) {
            factory.getToken(authentication.refresh_token, 'refresh_token').then(function(){
              defer.resolve();
            });
          } else {
            headers['trakt-authorization'] = 'Bearer '+data.access_token;
            defer.resolve();
          }
        } else {
          defer.reject();
        }
      });

      storage.getItem('trakt-autoscrobble').then(function(data) {
        autoscrobble = data;
      });
      return defer.promise;
    };

    factory.connect();

    return factory;
  }
]);
  angular.module('services.tmdb.transform', [])
  .factory('transform', [
    function() {
      var factory = {};

      var flatten = function (objects) {
        objects = objects || [];
        return objects.map(function(object) {
          return object.name;
        });
      };

      var year = function (dateStr) {
        var year = null;
        if(dateStr) {
          var parts = dateStr.split('-');
          year = parseInt(parts[0], 10);
        }
        return year;
      };

      var runtime = function (runtime) {
        return runtime * 60;
      }

      factory.translate = function (tmdbResponse) {
        var fn = function(el){
          var transformed = {};
          for(var key in mapping) {
            if(el.hasOwnProperty(key)) {
              var transformedKey = mapping[key];
              if(angular.isObject(transformedKey)) {
                transformed[transformedKey.key] = transformedKey.transformFn(el[key]);
              } else {
                transformed[transformedKey] = el[key];
              }
            }
          }
          return transformed;
        };
        if(!angular.isArray(tmdbResponse)) {
          return fn(tmdbResponse)
        } else {
          return tmdbResponse.map(fn);
        }
      };

      var mapping = {
        'backdrop_path' : 'fanart',
        'backdrops' : 'fanarts',
        'genres' : {
          key : 'genre',
          transformFn : flatten
        },
        'id' : 'id',
        'tvdb_id' : 'tvdbid',
        'poster_path' : 'poster',
        'posters' : 'posters',
        'name' : 'name',
        'networks' :  {
          key : 'studios',
          transformFn : flatten
        },
        'movie_results' : {
          key : 'movies',
          transformFn : factory.translate
        },
        'seasons' : {
          key : 'seasons',
          transformFn : factory.translate
        },
        'season_number' : 'season',
        'tv_results' : {
          key : 'tvShows',
          transformFn : factory.translate
        },
        'tv_episode_results' : {
          key : 'tvShowEpisodes',
          transformFn : factory.translate
        },
        'tv_season_results' : {
          key : 'tvShowSeasons',
          transformFn : factory.translate
        },
        'episode_count' : 'episode',
        'title' : 'title',
        'vote_average' : 'rating',
        'episodes' : {
          key : 'episodes',
          transformFn : factory.translate
        },
        'still_path':'thumbnail',
        'air_date' : 'firstaired',
        'first_air_date' : 'firstaired',
        'overview' : 'plot',
        'episode_number' : 'episode',
        'season_number' : 'season',
        'results' : {
          key : 'results',
          transformFn : factory.translate
        },
        'release_date' : {
          key : 'year',
          transformFn : year
        },
        'imdb_id' : 'imdbnumber',
        'cast' : {
          key : 'cast',
          transformFn : factory.translate
        },
        'profile_path' : 'thumbnail',
        'character' : 'role',
        'runtime' : {
          key : 'runtime',
          transformFn : runtime
        },
        'production_companies' : {
          key : 'studio',
          transformFn : flatten
        },
        'crew' : {
          key : 'crew',
          transformFn : factory.translate
        },
        'job' : 'job',
        'total_pages' : 'totalPages',
        'key' : 'key',
        'media_type' : 'mediaType',
        'tagline' : 'tagline'
      };
      return factory;
    }
  ]);
angular.module('templates.app', ['modules/common/navigation.tpl.html', 'modules/donation/form.tpl.html', 'modules/movie/details.tpl.html', 'modules/movie/list.tpl.html', 'modules/movie/movies.tpl.html', 'modules/music/albums.tpl.html', 'modules/music/artist.albums.tpl.html', 'modules/music/artists.tpl.html', 'modules/music/musics.tpl.html', 'modules/music/songs.tpl.html', 'modules/now/playing.tpl.html', 'modules/now/playlist.tpl.html', 'modules/remote/remote.tpl.html', 'modules/search/list.tpl.html', 'modules/settings/wizard.tpl.html', 'modules/tvshow/calendar.tpl.html', 'modules/tvshow/details.tpl.html', 'modules/tvshow/episodes.tpl.html', 'modules/tvshow/list.tpl.html', 'modules/tvshow/shows.tpl.html', 'template/actions/actions.tpl.html', 'template/comments/comments.tpl.html', 'template/fanarts/fanarts.tpl.html', 'template/nosource/nosource.tpl.html', 'template/stats/stats.tpl.html']);

angular.module("modules/common/navigation.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/common/navigation.tpl.html",
    "<nav class=\"row\">\n" +
    "    <form class=\"span3 clearfix search\" ng-submit=\"search()\" ng-class=\"{open : isOpen}\">\n" +
    "        <div class=\"btn\" ng-click=\"open()\">\n" +
    "            <i class=\"fa fa-search\"></i>\n" +
    "        </div>\n" +
    "        <input type=\"text\" placeholder=\"Search movies and shows\" ng-model=\"query\"/>\n" +
    "    </form>\n" +
    "    <div class=\"clearfix tabs span6\">\n" +
    "        <a href=\"#{{item.hash}}\" ng-repeat=\"item in medias\" ng-class=\"{selected : isCurrent(item.matchRegExp)}\"\n" +
    "            class=\"tab span{{12/medias.length}}\">\n" +
    "            <div class=\"label\">{{item.label}}</div>\n" +
    "        </a>\n" +
    "    </div>\n" +
    "    <div class=\"donate\"> \n" +
    "        <button class=\"recommend\" ng-click=\"showSupport()\">\n" +
    "            <i class=\"fa fa-paypal\"></i>\n" +
    "        </button>\n" +
    "    </div>\n" +
    "    <div class=\"status\" ng-class=\"{connected : connected, disconnected : !connected}\">\n" +
    "        <i class=\"fa\" ng-class=\"{'fa-check' : connected, 'fa-times' : !connected}\"></i>\n" +
    "    </div>\n" +
    "</nav>");
}]);

angular.module("modules/donation/form.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/donation/form.tpl.html",
    "<form role=\"dialog\" data-type=\"action\" class=\"chooser donation\" \n" +
    "      action=\"https://www.paypal.com/cgi-bin/webscr\"\n" +
    "      method=\"post\" ng-show=\"isSupportVisible\" target=\"_blank\"\n" +
    "      ng-submit=\"hideSupport()\">\n" +
    "    <div class=\"content\">\n" +
    "        <img class=\"arch\" src=\"../img/icons/awe-512.png\"/>\n" +
    "        <i class=\"fa fa-times\" ng-click=\"hideSupport()\"></i>\n" +
    "        <div class=\"body\">\n" +
    "            <input type=\"hidden\" name=\"business\" value=\"nicolas.abric@gmail.com\"/>\n" +
    "            <input type=\"hidden\" name=\"cmd\" value=\"_xclick\"/>\n" +
    "            <input type=\"hidden\" name=\"item_number\" value=\"DONATE\"/>\n" +
    "            <input type=\"hidden\" name=\"item_name\" value=\"One time donation\"/>\n" +
    "            <header>\n" +
    "                One time donation\n" +
    "            </header>\n" +
    "            <p> \n" +
    "                You are enjoying Arch and want to show us your support? Please consider making a donation.\n" +
    "            </p>\n" +
    "            <div class=\"input-wrapper\">\n" +
    "                <i class=\"fa fa-gift\"></i>\n" +
    "                <input type=\"number\" maxlength=\"30\" name=\"amount\" size=\"10\"\n" +
    "                       value=\"5\"/>\n" +
    "            </div>\n" +
    "            <div class=\"input-wrapper\">\n" +
    "                <i class=\"fa\" ng-class=\"{\n" +
    "                    'fa-eur':donation.currency.value === 'EUR',\n" +
    "                    'fa-gbp':donation.currency.value === 'GBP',\n" +
    "                    'fa-jpy':donation.currency.value === 'JPY',\n" +
    "                    'fa-dollar':donation.currency.value === 'USD' || donation.currency.value === 'CAD' || donation.currency.value === 'AUD'\n" +
    "                }\"></i>\n" +
    "                <input type=\"text\" ng-model=\"donation.currency.label\" readonly=\"true\"/>\n" +
    "                <select name=\"currency_code\" ng-options=\"currency.label for currency in donation.currencies track by currency.value\" ng-model=\"donation.currency\"></select>\n" +
    "            </div>\n" +
    "            \n" +
    "            <button class=\"recommend\" type=\"submit\">\n" +
    "                <i class=\"fa fa-paypal\"></i> Donate\n" +
    "            </button>\n" +
    "            <p style=\"padding:2rem 0 0 0;\">\n" +
    "                <i class=\"fa fa-info-circle\"></i>\n" +
    "                Your donation will solely be used to maintain and improve Arch. \n" +
    "                We remind you that features can be requested at any time on the <a href=\"https://github.com/abricot/webinterface.arch/issues\" traget=\"_blank\">Arch github</a>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>");
}]);

angular.module("modules/movie/details.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/movie/details.tpl.html",
    "<div ng-switch on=\"loading\" class=\"movie detail fill-height\" ng-class=\"{loading : loading}\">\n" +
    "    <div ng-switch-when=\"true\" class=\"loading\"><div class=\"kodi\"></div></div>\n" +
    "    <div ng-switch-when=\"false\">\n" +
    "        <div class=\"experimental row\" ng-show=\"!isExternalAddonAvailable && isUsingExternalAddon()\">\n" +
    "            <div class=\"offset2 span8\">\n" +
    "                <i class=\"fa fa-flask\"></i>\n" +
    "                {{host.videoAddon}} needed to preview discoverable content.\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row wrapper\">\n" +
    "            <tmdb-fanarts fanarts=\"fanarts\" delay=\"10000\" primary=\"getImage(movie.fanart)\"></tmdb-fanarts>\n" +
    "            <div class=\"actions\" ng-if=\"hasAdditionalInfo()\">\n" +
    "                <div class=\"md-action md-action-primary\"\n" +
    "                     ng-click=\"play(movie)\" ng-show=\"!player.active\">\n" +
    "                    <i class=\"fa fa-play\"></i>\n" +
    "                </div>\n" +
    "                <div class=\"md-action md-action-primary\"\n" +
    "                     ng-click=\"queue(movie)\" ng-show=\"player.active && !isCurrentlyPlaying\">\n" +
    "                    <i class=\"fa fa-plus\"></i>\n" +
    "                </div>\n" +
    "                <div class=\"md-action md-action-primary\"\n" +
    "                     ng-click=\"xbmc.togglePlay()\" ng-show=\"player.active && isCurrentlyPlaying\">\n" +
    "                    <i class=\"fa fa-play\" ng-show=\"!player.speed\"></i>\n" +
    "                    <i class=\"fa fa-pause\" ng-show=\"player.speed\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"actions\" ng-if=\"!hasAdditionalInfo()\">\n" +
    "                <div class=\"md-action md-action-primary\"\n" +
    "                     ng-click=\"play(movie)\">\n" +
    "                    <i class=\"fa fa-play\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"title\">\n" +
    "                <h1>{{movie.title}}</h1>\n" +
    "                <h2>{{movie.tagline}}</h2>\n" +
    "            </div>\n" +
    "            <trakt-stats stats=\"stats\"></trakt-stats>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"description row\">\n" +
    "            <div class=\"offset1 span2 sidebar\">\n" +
    "                <div class=\"poster-wrapper\">\n" +
    "                    <img class=\" poster\" image image-source=\"getImage(movie.thumbnail || movie.poster, 'w185')\"/>\n" +
    "                    <div class=\"preview\"  ng-click=\"xbmc.open({'file': movie.trailer})\">\n" +
    "                        <i class=\"fa fa-film\"></i>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <ul class=\"nav sections\">\n" +
    "                    <li style=\"text-align: center\">\n" +
    "                        {{movie.title}}\n" +
    "                        <seekbar seekbar-value=\"movie.resume.position || 0\" seekbar-max=\"movie.resume.total || 100\"\n" +
    "                                 seekbar-read-only=\"true\" class=\"progress-wrapper\"\n" +
    "                                 ng-if=\"hasAdditionalInfo()\">\n" +
    "                        </seekbar>\n" +
    "                    </li>\n" +
    "                    <li class=\"row\">\n" +
    "                        <div class=\"span6 label\">\n" +
    "                            <i class=\"fa fa-clock-o\"></i>\n" +
    "                            Runtime\n" +
    "                        </div>\n" +
    "                        <div class=\"span6 value\">{{movie.runtime | time | date:'HH:mm'}}</div>\n" +
    "                    </li>\n" +
    "                    <li class=\"row\">\n" +
    "                        <div class=\"span6 label\">\n" +
    "                            <i class=\"fa fa-star\"></i>\n" +
    "                            Rating\n" +
    "                        </div>\n" +
    "                        <div class=\"span6 value\">{{movie.rating| number : 1}}</div>\n" +
    "                    </li>\n" +
    "                    <li class=\"row\">\n" +
    "                        <div class=\"span6 label\">\n" +
    "                            <i class=\"genre-{{movie.genre[0].toLowerCase()}}\"></i>\n" +
    "                            Genre\n" +
    "                        </div>\n" +
    "                        <div class=\"span6 value\">{{movie.genre[0]}}</div>\n" +
    "                    </li>\n" +
    "                    <li class=\"row\">\n" +
    "                        <div class=\"span6 label\">\n" +
    "                            <i class=\"fa fa-calendar\"></i>\n" +
    "                            Released\n" +
    "                        </div>\n" +
    "                        <div class=\"span6 value\">{{movie.year}}</div>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "                <div ng-if=\"hasAdditionalInfo()\">\n" +
    "                    <button class=\"recommend\"\n" +
    "                         ng-click=\"play(movie)\" ng-show=\"!player.active\">\n" +
    "                        <i class=\"fa fa-play\"></i> Play\n" +
    "                    </button>\n" +
    "                    <button class=\"recommend\"\n" +
    "                         ng-click=\"queue(movie)\" ng-show=\"player.active && !isCurrentlyPlaying\">\n" +
    "                        <i class=\"fa fa-plus\"></i> Queue\n" +
    "                    </button>\n" +
    "                    <button class=\"recommend\"\n" +
    "                         ng-click=\"xbmc.togglePlay()\" ng-show=\"player.active && isCurrentlyPlaying\">\n" +
    "                        <i class=\"fa fa-play\" ng-show=\"!player.speed\"></i>\n" +
    "                        <i class=\"fa fa-pause\" ng-show=\"player.speed\"></i>\n" +
    "                        <span ng-show=\"!player.speed\">Resume</span>\n" +
    "                        <span ng-show=\"player.speed\">Pause</span>\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "                <div ng-if=\"!hasAdditionalInfo()\">\n" +
    "                    <button class=\"recommend\"\n" +
    "                         ng-click=\"play(movie)\">\n" +
    "                        <i class=\"fa fa-play\"></i> Play\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"span7 content\">\n" +
    "                <div class=\"details-section row\">\n" +
    "                    <div class=\"span9\">\n" +
    "                        <h1>Synopsis</h1>\n" +
    "                        <p class=\"plot\">{{movie.plot}}</p>\n" +
    "                    </div>\n" +
    "                    <trakt-actions class=\"span3\" media-type=\"'movies'\" imdb=\"movie.imdbnumber\">\n" +
    "                    </trakt-actions>\n" +
    "                </div>\n" +
    "                <div class=\"details-section\">\n" +
    "                    <h1>\n" +
    "                        Actors\n" +
    "                        <a href=\"javascript:void(0);\" ng-click=\"seeMoreActors=true;\" class=\"more\" ng-class=\"{hidden : seeMoreActors}\">\n" +
    "                            See more\n" +
    "                        </a>\n" +
    "                    </h1>\n" +
    "                    <ul class=\"actors\" ng-class=\"{collapsed : !seeMoreActors}\">\n" +
    "                        <li class=\"actor\" ng-repeat=\"actor in getActors()\">\n" +
    "                            <img class=\"poster\" image image-source=\"getImage(actor.thumbnail)\"/>\n" +
    "\n" +
    "                            <div class=\"name\">{{actor.name}}</div>\n" +
    "                            <div class=\"role\">{{actor.role}}</div>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "                <div class=\"details-section\">\n" +
    "                    <h1>Credits</h1>\n" +
    "                    <ul>\n" +
    "                        <li class=\"row credit\">\n" +
    "                            <b class=\"span3\">Directors</b>\n" +
    "                            <div class=\"span9\">{{movie.director.join(', ')}}</div>\n" +
    "                        </li>\n" +
    "                        <li class=\"row credit\">\n" +
    "                            <b class=\"span3\">Writers</b>\n" +
    "                            <div class=\"span9\">{{movie.writer.join(', ')}}</div>\n" +
    "                        </li>\n" +
    "                        <li class=\"row credit\">\n" +
    "                            <b class=\"span3\">Studio</b>\n" +
    "                            <div class=\"span9\">{{movie.studio.join(', ')}}</div>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"details-section\" ng-if=\"similars.length\">\n" +
    "                    <h1>Similars</h1>\n" +
    "                    <ul class=\"similars collapsed\">\n" +
    "                        <li class=\"similar\" ng-repeat=\"similar in similars\">\n" +
    "                            <a href=\"#/movies/tmdb/{{similar.id}}\">\n" +
    "                                <div class=\"poster\" image\n" +
    "                                     image-source=\"similar.poster | tmdbImage:'w185' | fallback:'img/icons/awe-512.png'\">\n" +
    "                                </div>\n" +
    "                            </a>\n" +
    "                            <div class=\"title\">{{similar.title}}</div>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"details-section\" ng-if=\"hasAdditionalInfo()\">\n" +
    "                    <h1>Additional information</h1>\n" +
    "                    <ul>\n" +
    "                        <li class=\"row info\">\n" +
    "                            <b class=\"span3\">Video</b>\n" +
    "                            <div class=\"span9\">{{getVideoDefinition()}}</div>\n" +
    "                        </li>\n" +
    "                        <li class=\"row info\">\n" +
    "                            <b class=\"span3\">Audio languages</b>\n" +
    "                            <div class=\"span9\">{{getAudio()}}</div>\n" +
    "                        </li>\n" +
    "                        <li class=\"row info\" ng-show=\"movie.mpaa !==''\">\n" +
    "                            <b class=\"span3\">MPAA</b>\n" +
    "                            <div class=\"span9\">{{movie.mpaa}}</div>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "                <div class=\"details-section\" ng-if=\"comments.length\">\n" +
    "                    <h1>Popular comments</h1>\n" +
    "                    <trakt-comments comments=\"comments\"></trakt-comments>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("modules/movie/list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/movie/list.tpl.html",
    "<div class=\"cards fill-height\">\n" +
    "    <div class=\"kodi\" ng-show=\"loading\"></div>\n" +
    "    <no-source source=\"'movies'\" ng-if=\"empty\"></no-source>\n" +
    "    <ul data-type=\"list\" lr-infinite-scroll=\"loadMore\" scroll-threshold=\"200\">\n" +
    "        <li class=\"card movie repeat-animation\" ng-repeat-start=\"movie in movies\">\n" +
    "            <a href=\"{{getMoviesPath(movie)}}\">\n" +
    "                <div class=\"poster\" image image-source=\"getPoster(movie)\">\n" +
    "                    <flipper ng-show=\"hasControls()\">\n" +
    "                        <div class=\"front\">\n" +
    "                            <div rating rating-value=\"movie.rating\" rating-max=\"10\"></div>\n" +
    "                        </div>\n" +
    "                        <div class=\"back\">\n" +
    "                            <div class=\"md-circle rating\">\n" +
    "                                <i class=\"fa fa-play\" ng-click=\"helper.local.movies.play(movie); $event.preventDefault();\"\n" +
    "                                   ng-show=\"!player.active\"></i>\n" +
    "                                <i class=\"fa fa-plus\" ng-click=\"queue(movie); $event.preventDefault();\"\n" +
    "                                   ng-show=\"player.active\"></i>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </flipper>\n" +
    "                    <div class=\"rating-wrapper\" ng-show=\"!hasControls()\">\n" +
    "                        <div rating rating-value=\"movie.rating\" rating-max=\"10\"></div>\n" +
    "                    </div>\n" +
    "                    <div class=\"playcount\" ng-show=\"movie.playcount\">\n" +
    "                         <i class=\"fa fa-check\"></i>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"description\">\n" +
    "                    <h3>{{movie.label || movie.title}}</h3>\n" +
    "                    <h4>{{movie.year}}</h4>\n" +
    "                    <p class=\"clock\" ng-if=\"movie.runtime\">\n" +
    "                        {{movie.runtime | time | date:'HH:mm'}}\n" +
    "                    </p>\n" +
    "                    <div ng-show=\"hasControls()\">\n" +
    "                        <seekbar seekbar-value=\"movie.resume.position\" seekbar-max=\"movie.resume.total\"\n" +
    "                                 seekbar-read-only=\"true\">\n" +
    "                        </seekbar>\n" +
    "                        <div class=\"controls\">\n" +
    "                            <i class=\"fa\" ng-class=\"{'fa-eye':!movie.playcount, 'fa-eye-slash':movie.playcount}\"\n" +
    "                               ng-click=\"toggleWatched(movie); $event.preventDefault();\"\n" +
    "                              ></i>\n" +
    "                            <i class=\"fa fa-trash\"\n" +
    "                               ng-click=\"remove($index, movie); $event.preventDefault();\"\n" +
    "                            ></i>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </a>\n" +
    "        </li>\n" +
    "        <li class=\"card movie\" ng-repeat-end ng-if=\"$index===supportIndex\" ng-click=\"showSupport();\">\n" +
    "            <a href=\"javascript:void:0;\">\n" +
    "                <div class=\"poster\" image image-source=\"'img/backgrounds/support.png'\">\n" +
    "                    <img src=\"../img/icons/loading.png\" width=\"75%\" class=\"arch\"/>\n" +
    "                    <div class=\"rating-wrapper\">\n" +
    "                        <div class=\"md-circle rating\">\n" +
    "                            <i class=\"fa fa-paypal\"></i>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                 <div class=\"description\">\n" +
    "                    <h3>Enjoying Arch ?</h3>\n" +
    "                    <h4>Support us!</h4>\n" +
    "                    <p class=\"clock\" ng-show=\"hasControls()\">&nbsp;</p>\n" +
    "                    <div ng-show=\"hasControls()\">\n" +
    "                        <seekbar seekbar-value=\"0\" seekbar-max=\"1\"\n" +
    "                                 seekbar-read-only=\"true\">\n" +
    "                        </seekbar>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);

angular.module("modules/movie/movies.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/movie/movies.tpl.html",
    "<div class=\"movies fill-height\">\n" +
    "    <div class=\"tabs row\">\n" +
    "        <a class=\"span4 tab\" href=\"#/movies/popular\" ng-class=\"{selected :isSelected('movies.popular')}\">Discover</a>\n" +
    "        <a class=\"span4 tab\" href=\"#/movies/recents\" ng-class=\"{selected :isSelected('movies.recents')}\">Recently added</a>\n" +
    "        <a class=\"span4 tab\" href=\"#/movies/all\"  ng-class=\"{selected :isSelected('movies.all')}\">All movies</a>\n" +
    "        <div class=\"scan\" ng-click=\"xbmc.scan('VideoLibrary')\">\n" +
    "            <i class=\"fa fa-barcode\" title=\"Scan video library\"></i>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div ui-view class=\"content\">\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("modules/music/albums.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/music/albums.tpl.html",
    "<div class=\"fill-height\">\n" +
    "    <div class=\"kodi\" ng-show=\"loading\"></div>\n" +
    "    <no-source source=\"'musics'\" ng-if=\"empty\"></no-source>\n" +
    "    <div class=\"cards albums\">\n" +
    "        <ul data-type=\"list\" lr-infinite-scroll=\"loadMore\">\n" +
    "            <li class=\"row album card repeat-animation\" ng-repeat=\"album in albums\">\n" +
    "                <a href=\"#/musics/songs/albumid/{{album.albumid}}\">\n" +
    "                    <div class=\"poster\" image image-source=\"album.thumbnail | asset:host | fallback:'img/backgrounds/album.png'\">\n" +
    "                    </div>\n" +
    "                    <div class=\"description\">\n" +
    "                        <h3>{{album.label}}</h3>\n" +
    "                        <p>{{album.artist.join(', ')}}</p>\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("modules/music/artist.albums.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/music/artist.albums.tpl.html",
    "<div class=\"fill-height songs-wrapper detail\">\n" +
    "    <div class=\"kodi\" ng-hide=\"songs.length\"></div>\n" +
    "        <div class=\"wrapper row\">\n" +
    "            <div class=\"fanart\" image image-source=\"artist.fanart | asset:host\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"description row\">\n" +
    "            <div class=\"offset1 span2 sidebar\">\n" +
    "                <div class=\"poster-wrapper\">\n" +
    "                    <img class=\"poster\" image image-source=\"artist.thumbnail | asset:host | fallback:'img/backgrounds/vinyls.jpg'\"/>\n" +
    "                </div>\n" +
    "                <ul class=\"nav sections\">\n" +
    "                    <li style=\"text-align: center\">\n" +
    "                        {{artist.artist}}\n" +
    "                    </li>\n" +
    "                    <li class=\"row\">\n" +
    "                        <div class=\"span6 label\">Genre</div>\n" +
    "                        <div class=\"span6 value\">\n" +
    "                            {{artist.genre.join(', ')}}\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                    <li class=\"row\">\n" +
    "                        <div class=\"span6 label\">Active</div>\n" +
    "                        <div class=\"span6 value\">\n" +
    "                            <span ng-repeat=\"active in artist.yearsactive\">{{active}}</span>\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "            <div class=\"span7 content songs\">\n" +
    "                <div class=\"album repeat-animation\" ng-repeat=\"album in albums\">\n" +
    "                    <div class=\"detail\">\n" +
    "                        <div class=\"poster\" image image-source=\"album.thumbnail | asset:host | fallback:'img/backgrounds/vinyls.jpg'\"\n" +
    "                             >\n" +
    "                        </div>\n" +
    "                        <h1>{{album.label}}</h1>\n" +
    "                        <h3>{{album.year}}</h3>\n" +
    "                        <div class=\"md-action md-action-primary\"\n" +
    "                             ng-click=\"xbmc.open({albumid : album.albumid})\">\n" +
    "                            <i class=\"fa fa-play\"></i>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <ul data-type=\"list\">\n" +
    "                        <li class=\"row song\" ng-repeat=\"song in songs | filter:isPartOf(album) | orderBy:song.trac\"\n" +
    "                          ng-click=\"xbmc.open({songid : song.songid})\">\n" +
    "                            <div class=\"span4 track\">\n" +
    "                                <span class=\"thumbnail\" image image-source=\"song.thumbnail | asset:host | fallback:'img/backgrounds/album.png'\">\n" +
    "                                    <i class=\"fa fa-play\"></i>\n" +
    "                                </span>\n" +
    "                                {{song.label}}\n" +
    "                                <img class=\"equalizer\" src=\"img/backgrounds/equalizer.gif\" ng-show=\"isPlaying(song.songid)\"/>\n" +
    "                            </div>\n" +
    "                            <div class=\"span3\">{{song.album}}</div>\n" +
    "                            <div class=\"span3\">{{song.artist.join(', ')}}</div>\n" +
    "                            <div class=\"span1 duration\">{{song.duration | time | date :'mm:ss'}}</div>\n" +
    "                            <div class=\"span1 more\">\n" +
    "                                <i class=\"fa fa-ellipsis-v\"></i>\n" +
    "                                <ul class=\"dropdown-menu\">\n" +
    "                                    <li ng-click=\"xbmc.queue({'songid':song.songid});$event.stopPropagation();\">\n" +
    "                                        <i class=\"fa fa-plus\"></i>\n" +
    "                                        Queue\n" +
    "                                    </li>\n" +
    "                                </ul>\n" +
    "                            </div>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "                <div ng-show=\"!albums.length\" class=\"empty list\">Oops! nothing here</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("modules/music/artists.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/music/artists.tpl.html",
    "<div class=\"fill-height\">\n" +
    "    <div class=\"kodi\" ng-show=\"loading\"></div>\n" +
    "    <no-source source=\"'musics'\" ng-if=\"empty\"></no-source>\n" +
    "    <div class=\"cards artists\">\n" +
    "        <ul data-type=\"list\" lr-infinite-scroll=\"loadMore\">\n" +
    "            <li class=\"row card artist repeat-animation\" ng-repeat=\"artist in artists\">\n" +
    "                <a href=\"#/musics/albums/artistid/{{artist.artistid}}\">\n" +
    "                    <div class=\"poster\" image image-source=\"artist.thumbnail | asset:host | fallback:'img/backgrounds/album.png'\">\n" +
    "                    </div>\n" +
    "                    <div class=\"description\">\n" +
    "                        <h3>{{artist.label}}</h3>\n" +
    "                        <p>{{artist.genre.join(', ')}}&nbsp;</p>\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("modules/music/musics.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/music/musics.tpl.html",
    "<div class=\"music fill-height\">\n" +
    "    <div class=\"tabs row\">\n" +
    "        <a class=\"span4 tab\" href=\"#/musics/albums/all\" ng-class=\"{selected : isSelected('music.*albums$')}\">Albums</a>\n" +
    "        <a class=\"span4 tab\" href=\"#/musics/artists/all\" ng-class=\"{selected : isSelected('music.*artists$')}\">Artists</a>\n" +
    "        <a class=\"span4 tab\" href=\"#/musics/songs/all\" ng-class=\"{selected : isSelected('music.*songs')}\">Songs</a>\n" +
    "        <div class=\"scan\" ng-click=\"xbmc.scan('AudioLibrary')\">\n" +
    "            <i class=\"fa fa-barcode\" title=\"Scan audio library\"></i>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div ui-view class=\"content\">\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("modules/music/songs.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/music/songs.tpl.html",
    "<div class=\"fill-height songs-wrapper detail\" lr-infinite-scroll=\"loadMore\">\n" +
    "    <div class=\"kodi\" ng-show=\"loading\"></div>\n" +
    "    <no-source source=\"'musics'\" ng-if=\"empty\"></no-source>\n" +
    "    <div class=\"wrapper row\">\n" +
    "        <div class=\"fanart\" image image-source=\"album.fanart | asset:host | fallback:'img/backgrounds/vinyls.jpg'\"></div>\n" +
    "        <div class=\"actions\">\n" +
    "            <div class=\"md-action md-action-primary\"\n" +
    "               ng-click=\"xbmc.open({'file' : undefined})\"\n" +
    "               ng-show=\"!album\">\n" +
    "                <i class=\"fa fa-random\"></i>\n" +
    "            </div>\n" +
    "            <div class=\"md-action md-action-primary\"\n" +
    "                 ng-click=\"xbmc.queue({'albumid': album.albumid})\"\n" +
    "                 ng-show=\"album && player.active\">\n" +
    "                <i class=\"fa fa-plus\"></i>\n" +
    "            </div>\n" +
    "            <div class=\"md-action md-action-primary\"\n" +
    "                 ng-click=\"xbmc.open({'albumid': album.albumid})\"\n" +
    "                 ng-show=\"album && !player.active\">\n" +
    "                <i class=\"fa fa-play\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"description row\">\n" +
    "        <div class=\"offset1 span2 sidebar\">\n" +
    "            <div class=\"poster-wrapper\">\n" +
    "                <img class=\"poster\" image image-source=\"album.thumbnail | asset:host | fallback:'img/backgrounds/album.png'\"/>\n" +
    "            </div>\n" +
    "            <ul class=\"nav sections\">\n" +
    "                <li style=\"text-align: center\">\n" +
    "                    {{album.label | fallback:'Library'}}\n" +
    "                </li>\n" +
    "                <li class=\"row\" ng-if=\"album\">\n" +
    "                    <div class=\"span6 label\">Artist</div>\n" +
    "                    <div class=\"span6 value\">\n" +
    "                        {{album.displayartist}}\n" +
    "                    </div>\n" +
    "                </li>\n" +
    "                <li class=\"row\" ng-if=\"album\">\n" +
    "                    <div class=\"span6 label\">Genre</div>\n" +
    "                    <div class=\"span6 value\">\n" +
    "                        {{album.genre.join(', ')}}\n" +
    "                    </div>\n" +
    "                </li>\n" +
    "                <li class=\"row\" ng-if=\"album\">\n" +
    "                    <div class=\"span6 label\">Year</div>\n" +
    "                    <div class=\"span6 value\">\n" +
    "                        {{album.year}}\n" +
    "                    </div>\n" +
    "                </li>\n" +
    "                <li class=\"row\" ng-if=\"!album\">\n" +
    "                    <div class=\"span6 label\"># Songs</div>\n" +
    "                    <div class=\"span6 value\">\n" +
    "                        {{total}}\n" +
    "                    </div>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "            <button class=\"recommend\" class=\"md-action md-action-primary\"\n" +
    "                    ng-click=\"xbmc.open({'file' : undefined})\"\n" +
    "                    ng-show=\"!album\">\n" +
    "                <i class=\"fa fa-random\"></i> Shuffle\n" +
    "            </button>\n" +
    "            <button class=\"recommend\"\n" +
    "                 ng-click=\"xbmc.queue({'albumid': album.albumid})\"\n" +
    "                 ng-show=\"album && player.active\">\n" +
    "                <i class=\"fa fa-plus\"></i> Queue\n" +
    "            </button>\n" +
    "            <button class=\"recommend\"\n" +
    "                 ng-click=\"xbmc.open({'albumid': album.albumid})\"\n" +
    "                 ng-show=\"album && !player.active\">\n" +
    "                <i class=\"fa fa-play\"></i> Play\n" +
    "            </button>\n" +
    "        </div>\n" +
    "        <div class=\"span7 content\">\n" +
    "            <ul data-type=\"list\">\n" +
    "                <li class=\"row song repeat-animation\" ng-repeat=\"song in songs\"\n" +
    "                    ng-click=\"xbmc.open({songid : song.songid})\">\n" +
    "                    <div class=\"span4 track\">\n" +
    "                        <span class=\"thumbnail\" image image-source=\"song.thumbnail | asset:host | fallback:'img/backgrounds/album.png'\">\n" +
    "                            <i class=\"fa fa-play\"></i>\n" +
    "                        </span>\n" +
    "                        {{song.label}}\n" +
    "                        <img class=\"equalizer\" src=\"img/backgrounds/equalizer.gif\" ng-show=\"isPlaying(song.songid)\"/>\n" +
    "                    </div>\n" +
    "                    <div class=\"span3\">{{song.album || '&nbsp;'}}</div>\n" +
    "                    <div class=\"span3\">{{song.artist.join(', ') || '&nbsp;'}}</div>\n" +
    "                    <div class=\"span1 duration\">{{song.duration | time | date :'mm:ss'}}</div>\n" +
    "                    <div class=\"span1 more\">\n" +
    "                        <i class=\"fa fa-ellipsis-v\"></i>\n" +
    "                        <ul class=\"dropdown-menu\">\n" +
    "                            <li ng-click=\"xbmc.queue({'songid':song.songid});$event.stopPropagation();\">\n" +
    "                                <i class=\"fa fa-plus\"></i>\n" +
    "                                Queue\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("modules/now/playing.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/now/playing.tpl.html",
    "<div class=\"row buttons\">\n" +
    "    <div class=\"actions-wrapper row\">\n" +
    "        <div class=\"span4\">\n" +
    "            <div class=\"md-action\" ng-click=\"xbmc.previous()\" >\n" +
    "                <i class=\"fa fa-fast-backward\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"span4\">\n" +
    "            <div class=\"md-action primary\" ng-click=\"xbmc.togglePlay()\">\n" +
    "                <i class=\"fa\" ng-class=\"{'fa-play' : !player.speed, 'fa-pause' : player.speed}\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"span4\">\n" +
    "            <div class=\"md-action\" ng-click=\"xbmc.next()\"  >\n" +
    "                <i class=\"fa fa-fast-forward\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"player-wrapper \" ng-switch on=\"player.active\">\n" +
    "        <div ng-switch-when=\"false\" class=\"empty\">\n" +
    "        </div>\n" +
    "        <div ng-switch-when=\"true\">\n" +
    "            <seekbar seekbar-value=\"player.seek.percentage\" seekbar-max=\"100\"\n" +
    "            on-seekbar-changed=\"onSeekbarChanged(newValue)\"\n" +
    "            class=\"seekbar\"></seekbar>\n" +
    "            <div class=\"player row\">\n" +
    "                <a href=\"#{{getHashForItem()}}\" class=\"poster-wrapper\" >\n" +
    "                    <div class=\"poster\" image image-source=\"player.item.thumbnail | asset:host | fallback:'img/icons/awe-512.png'\"\n" +
    "                         ng-class=\"{show : player.item.type === 'episode'}\"></div>\n" +
    "                </a>\n" +
    "                <div class=\"label\">{{player.item.label}}</div>\n" +
    "                <div class=\"label times\" ng-click=\"toggleTimePicker()\">\n" +
    "                    {{player.seek.time | time | date:'HH:mm:ss'}}/\n" +
    "                    {{player.seek.totaltime | time | date:'HH:mm:ss'}}\n" +
    "                    [-{{(player.seek.totaltime - player.seek.time)  | time | date:'HH:mm:ss'}}]\n" +
    "                </div>\n" +
    "                <div class=\"md-action stop\" ng-click=\"xbmc.stop()\">\n" +
    "                    <i class=\"fa fa-stop\"></i>\n" +
    "                </div>\n" +
    "                <div class=\"md-action more\">\n" +
    "                    <i class=\"fa fa-ellipsis-v\"></i>\n" +
    "                    <ul class=\"dropdown-menu\">\n" +
    "                        <li ng-click=\"xbmc.showOSD()\">OSD</li>\n" +
    "                        <li ng-click=\"toggleAudioStreams()\" ng-show=\"isTypeVideo()\">Switch audio</li>\n" +
    "                        <li ng-click=\"toggleSubtitles()\" ng-show=\"isTypeVideo()\">Switch subtitles</li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"actions-wrapper\">\n" +
    "       <div class=\"span3\">\n" +
    "           <div class=\"md-action\" ng-click=\"xbmc.home()\" >\n" +
    "                <i class=\"fa fa-home\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"span3\">\n" +
    "            <div class=\"md-action\"  ng-click=\"xbmc.open({'file' : undefined})\">\n" +
    "                <i class=\"fa fa-headphones\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"span3\">\n" +
    "            <div class=\"md-action\">\n" +
    "                <i class=\"fa fa-volume-up\" ng-show=\"application.muted\" ng-click=\"xbmc.mute()\"></i>\n" +
    "                <i class=\"fa fa-volume-off\" ng-show=\"!application.muted\" ng-click=\"xbmc.mute()\"></i>\n" +
    "                <div class=\"volume-wrapper\">\n" +
    "                    <seekbar seekbar-value=\"application.volume\" seekbar-max=\"100\"\n" +
    "                    on-seekbar-changed=\"onVolumeChanged(newValue)\"\n" +
    "                    seekbar-orientation=\"vertical\"\n" +
    "                    class=\"volume seekbar\"></seekbar>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"span3\">\n" +
    "            <div class=\"md-action more\">\n" +
    "                <i class=\"fa fa-ellipsis-v\"></i>\n" +
    "                <div class=\"remote-menu\">\n" +
    "                    <div class=\"buttons\" ng-if=\"view==='remote'\"\n" +
    "                        ng-include src=\"'modules/remote/remote.tpl.html'\"></div>\n" +
    "                    <div class=\"buttons\" ng-if=\"view==='playlist'\"\n" +
    "                        ng-include src=\"'modules/now/playlist.tpl.html'\"></div>\n" +
    "                    <div class=\"tabs row\">\n" +
    "                        <a ng-click=\"view = 'remote'\" class=\"tab span6\" ng-class=\"{selected : view === 'remote'}\">Remote</a>\n" +
    "                        <a ng-click=\"view = 'playlist'\" href=\"javascript:void(0);\" class=\"tab span6\" ng-class=\"{selected : view === 'playlist'}\">Queue</a>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "<form role=\"dialog\" data-type=\"action\" class=\"chooser\" onsubmit=\"return false;\" ng-show=\"showAudioSelect\">\n" +
    "    <div class=\"content\">\n" +
    "        <header> Audio Streams </header>\n" +
    "        <div class=\"body\">\n" +
    "            <label ng-repeat=\"audiostream in player.audiostreams\">\n" +
    "                <input type=\"radio\" ng-model=\"stream\" ng-value=\"audiostream.index\" name=\"audiostreams\"/>\n" +
    "                {{audiostream.name}} ( {{audiostream.language}})\n" +
    "            </label>\n" +
    "        </div>\n" +
    "        <div class=\"actions\">\n" +
    "            <button ng-click=\"toggleAudioStreams()\"> Cancel </button>\n" +
    "            <button class=\"recommend\" ng-click=\"onValidateAudioStream()\"> Ok </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "\n" +
    "<form role=\"dialog\" data-type=\"action\" class=\"chooser\" onsubmit=\"return false;\" ng-show=\"showSubtitleSelect\">\n" +
    "    <div class=\"content\">\n" +
    "        <header> Subtitles </header>\n" +
    "        <div class=\"body\">\n" +
    "            <label>\n" +
    "                <input type=\"radio\" ng-model=\"sub\" value=\"off\" name=\"subtitles\"/>\n" +
    "                None\n" +
    "            </label>\n" +
    "            <label ng-repeat=\"subtitle in player.subtitles\">\n" +
    "                <input type=\"radio\" ng-model=\"sub\" ng-value=\"subtitle.index\" name=\"subtitles\"/>\n" +
    "                {{subtitle.name}} ({{subtitle.language}})\n" +
    "            </label>\n" +
    "        </div>\n" +
    "        <div class=\"actions\">\n" +
    "            <button ng-click=\"toggleSubtitles()\"> Cancel </button>\n" +
    "            <button class=\"recommend\" ng-click=\"onValidateSubtitles()\"> Ok </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "\n" +
    "<form role=\"dialog\" data-type=\"action\" class=\"chooser\" onsubmit=\"return false;\" ng-show=\"showTimePicker\">\n" +
    "    <div class=\"content\">\n" +
    "        <header>Select time </header>\n" +
    "        <div class=\"body\">\n" +
    "            <div class=\"time\">\n" +
    "                <div ng-model=\"seekTime\" class=\"picker\">\n" +
    "                    <timepicker hour-step=\"1\" minute-step=\"1\" show-meridian=\"false\"></timepicker>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"actions\">\n" +
    "            <button  ng-click=\"toggleTimePicker()\"> Cancel </button>\n" +
    "            <button class=\"recommend\" ng-click=\"onValidateSeekTime()\"> Ok </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "\n" +
    "\n" +
    "<form role=\"dialog\" data-type=\"action\" class=\"chooser\" onsubmit=\"return false;\" ng-show=\"showKeyboard\">\n" +
    "    <div class=\"content\">\n" +
    "        <header>Send text</header>\n" +
    "        <div class=\"body\">\n" +
    "            <textarea class=\"offset1 span10\" ng-model=\"textToSend\"\n" +
    "                          placeholder=\"Text to send\"></textarea>\n" +
    "        </div>\n" +
    "        <div class=\"actions\">\n" +
    "            <button ng-click=\"toggleKeyboard()\"> Cancel </button>\n" +
    "            <button class=\"recommend\"   ng-click=\"onValidateText()\"> Ok </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>\n" +
    "\n" +
    "\n" +
    "<form role=\"dialog\" data-type=\"action\" class=\"chooser\" onsubmit=\"return false;\" ng-show=\"showShutdownOptions\">\n" +
    "    <div class=\"content\">\n" +
    "        <header>System</header>\n" +
    "        <div class=\"body\">\n" +
    "            <button class=\"command\" ng-click=\"execCommand('shutdown')\">Power off</button>\n" +
    "            <button class=\"command\" ng-click=\"execCommand('hibernate')\">Hibernate</button>\n" +
    "            <button class=\"command\" ng-click=\"execCommand('suspend')\">Suspend</button>\n" +
    "            <button class=\"command\" ng-click=\"execCommand('reboot')\">Reboot</button>\n" +
    "        </div>\n" +
    "        <div class=\"actions\">\n" +
    "            <button ng-click=\"toggleShutdownOptions()\">Cancel</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>");
}]);

angular.module("modules/now/playlist.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/now/playlist.tpl.html",
    "<div class=\"now\">\n" +
    "    <div class=\"arts\">\n" +
    "        <div ng-switch on=\"player.active\">\n" +
    "            <div ng-switch-when=\"true\">\n" +
    "                <div class=\"banner\" image image-source=\"player.item.fanart | asset:host\"></div>\n" +
    "                <seekbar seekbar-value=\"player.seek.percentage\" seekbar-max=\"100\" seekbar-read-only=\"true\"></seekbar>\n" +
    "                <div class=\"label\">{{player.item.label}}</div>\n" +
    "                <div class=\"md-action md-action-primary\" ng-click=\"xbmc.next()\">\n" +
    "                    <i class=\"fa fa-fast-forward\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div ng-switch-when=\"false\">\n" +
    "                <div class=\"banner\"></div>\n" +
    "                <div class=\"md-action md-action-primary\" ng-click=\"xbmc.next()\">\n" +
    "                    <i class=\"fa fa-fast-forward\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"playlist\">\n" +
    "        <ul data-type=\"list\" class=\"view\" ng-if=\"!loading && items.length\">\n" +
    "            <li class=\"row \" ng-repeat=\"item in items\"\n" +
    "                ng-click=\"goTo($index)\">\n" +
    "                <div class=\"span3 wrapper\">\n" +
    "                    <div class=\"md-circle poster\" image image-source=\"item.art | thumb | asset:host | fallback:'img/icons/awe-512.png'\"></div>\n" +
    "                </div>\n" +
    "                <div class=\"span8\">\n" +
    "                    <p>{{item.label}}</p>\n" +
    "                    <p ng-show=\"item.duration\">{{item.duration | time | date :'mm:ss'}}</p>\n" +
    "                    <p ng-show=\"item.runtime\">{{item.runtime| time | date :'hh:mm:ss'}}</p>\n" +
    "                    <img class=\"equalizer\" src=\"img/backgrounds/equalizer.gif\" ng-show=\"isPlaying(item.id)\"/>\n" +
    "                </div>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "        <div ng-if=\"!loading &&!items.length\" class=\"empty list\">Oops! nothing here</div>\n" +
    "        <div ng-if=\"loading\" class=\"loading\"><div class=\"kodi\"></div></div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("modules/remote/remote.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/remote/remote.tpl.html",
    "<div class=\"remote\">\n" +
    "    <div class=\"arts\">\n" +
    "        <div ng-switch on=\"player.active\">\n" +
    "            <div ng-switch-when=\"true\">\n" +
    "                <div class=\"banner\" image image-source=\"player.item.fanart | asset:host\"></div>\n" +
    "                <seekbar seekbar-value=\"player.seek.percentage\" seekbar-max=\"100\" seekbar-read-only=\"true\"></seekbar>\n" +
    "                <div class=\"label\">{{player.item.label}}</div>\n" +
    "                <div class=\"md-action md-action-primary\" ng-click=\"toggleShutdownOptions()\">\n" +
    "                    <i class=\"fa fa-power-off\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div ng-switch-when=\"false\">\n" +
    "                <div class=\"banner\"></div>\n" +
    "                <div class=\"md-action md-action-primary\" ng-click=\"toggleShutdownOptions()\">\n" +
    "                    <i class=\"fa fa-power-off\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"buttons\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"action\">\n" +
    "                <div class=\"md-action\"  ng-click=\"xbmc.info()\">\n" +
    "                    <i class=\"fa fa-info\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"action\">\n" +
    "                <div class=\"md-action direction\"  ng-click=\"xbmc.up()\">\n" +
    "                    <i class=\"fa fa-chevron-up\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"action\">\n" +
    "                <div class=\"md-action\"  ng-click=\"xbmc.contextmenu()\">\n" +
    "                    <i class=\"fa fa-list-ul\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"action\">\n" +
    "                <div class=\"md-action direction\" ng-click=\"xbmc.left()\">\n" +
    "                    <i class=\"fa fa-chevron-left\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"action\">\n" +
    "                <div class=\"md-action select\" ng-click=\"xbmc.select()\">\n" +
    "                    <i class=\"fa fa-circle\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"action\">\n" +
    "                <div class=\"md-action direction\" ng-click=\"xbmc.right()\">\n" +
    "                    <i class=\"fa fa-chevron-right\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"action\">\n" +
    "                <div class=\"md-action\" ng-click=\"xbmc.back()\">\n" +
    "                    <i class=\"fa fa-mail-reply\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"action\">\n" +
    "                <div class=\"md-action direction\" ng-click=\"xbmc.down()\">\n" +
    "                    <i class=\"fa fa-chevron-down\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"action\">\n" +
    "               <div class=\"md-action\" ng-click=\"toggleKeyboard()\">\n" +
    "                    <i class=\"fa fa-keyboard-o\"></i>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("modules/search/list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/search/list.tpl.html",
    "<div class=\"search fill-height\">\n" +
    "    <div class=\"tabs row\">\n" +
    "        <a class=\"span4 tab\" ng-click=\"filter.mediaType=''\"\n" +
    "           ng-class=\"{selected : filter.mediaType==='' }\">\n" +
    "           All\n" +
    "        </a>\n" +
    "        <a class=\"span4 tab\" ng-click=\"filter.mediaType='movie'\"\n" +
    "           ng-class=\"{selected :  filter.mediaType==='movie'}\">\n" +
    "           Movies\n" +
    "        </a>\n" +
    "        <a class=\"span4 tab\" ng-click=\"filter.mediaType='tv'\"\n" +
    "           ng-class=\"{selected :  filter.mediaType==='tv'}\">\n" +
    "           TV shows\n" +
    "        </a>\n" +
    "    </div>\n" +
    "    <div class=\"content\">\n" +
    "        <div class=\"cards fill-height\">\n" +
    "            <div class=\"kodi\" ng-hide=\"results.length\"></div>\n" +
    "            <ul data-type=\"list\" lr-infinite-scroll=\"loadMore\">\n" +
    "                <li class=\"card result repeat-animation\" ng-repeat=\"result in results | filter:filter\">\n" +
    "                    <a href=\"{{getPath(result)}}\">\n" +
    "                        <div class=\"poster\" image image-source=\"result.poster | tmdbImage:'w500' | fallback:'img/icons/awe-512.png'\">\n" +
    "                            <div class=\"rating-wrapper\">\n" +
    "                                <div rating rating-value=\"result.rating\" rating-max=\"10\"></div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"description\">\n" +
    "                            <h3>{{result.label || result.title || result.name}}</h3>\n" +
    "                            <h4>{{result.year || '-'}}</h4>\n" +
    "                        </div>\n" +
    "                    </a>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "            <div ng-show=\"!result.length\" class=\"empty list\">Oops! nothing here</div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>s");
}]);

angular.module("modules/settings/wizard.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/settings/wizard.tpl.html",
    "<form class=\"wizard row fill-height\" name=\"wizard\" >\n" +
    "    <div class=\"arts\">\n" +
    "        <div class=\"banner\"></div>\n" +
    "        <div class=\"md-action md-action-primary\" ng-click=\"save()\">\n" +
    "            <i class=\"fa fa-save\"></i>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"settings\">\n" +
    "      <div data-type=\"list\">\n" +
    "        <div class=\"panel\">\n" +
    "            <h1>  <i class=\"fa fa-info-sign\"></i> General information</h1>\n" +
    "            <p class=\"host row\">\n" +
    "                <label class=\"span4\">Host IP</label>\n" +
    "                <input class=\"span5\" name=\"ip\" type=\"text\" placeholder=\"Ex : 192.16.0.1, hostname\" required=\"\" ng-model=\"host.ip\" tabindex=\"2\"/>\n" +
    "            </p>\n" +
    "            <p class=\"row httpport\">\n" +
    "                <label class=\"span4\">Webserver port</label>\n" +
    "                <input  class=\"span5\" type=\"text\" placeholder=\"Ex : 8080\" required=\"\" ng-model=\"host.httpPort\" tabindex=\"3\"/>\n" +
    "            </p>\n" +
    "            <p class=\"row wsport\">\n" +
    "                <label class=\"span4\">Api port</label>\n" +
    "                <input class=\"span5\" type=\"text\" placeholder=\"Ex : 9090\" required=\"\" ng-model=\"host.port\" tabindex=\"3\"/>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "        <div class=\"panel\">\n" +
    "            <h1>  <i class=\"fa fa-globe\"></i> Discover</h1>\n" +
    "            <p>\n" +
    "               Discover functionnality relies on external video add-on to be able to play content. Sepcify below which add-on you want to use.\n" +
    "            </p>\n" +
    "            <p class=\"row\">\n" +
    "                <label class=\"span4\">External video add-on</label>\n" +
    "                <input class=\"span5\" type=\"text\" placeholder=\"Ex : plugin.video.youtube\" required=\"\" ng-model=\"host.videoAddon\" tabindex=\"4\"/>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "        <div class=\"panel\">\n" +
    "            <h1>  <i class=\"fa fa-trakt\"></i> Trakt</h1>\n" +
    "            <p class=\"row\">\n" +
    "                <label class=\"span4\"> Auto scrobble</label>\n" +
    "                <span class=\"span5\">\n" +
    "                  <input type=\"checkbox\" ng-model=\"autoScrobble\"/>\n" +
    "                  <label>do not activate if trakt plugin is enabled</label>\n" +
    "                </span>\n" +
    "            </p>\n" +
    "            <div class=\"row trakt-status\" style=\"padding : .5rem 1rem;\">\n" +
    "                <div class=\"span4\">Authentication status</div>\n" +
    "                <div class=\"span5\" ng-if=\"authentication\">\n" +
    "                    Last authentication <b>{{ authentication.created_at | date : 'dd/MM/yyyy HH:mm'}}</b>\n" +
    "                    <a href=\"javascript:void(0);\" ng-click=\"refreshToken()\">refresh</a>\n" +
    "                </div>\n" +
    "                <div class=\"span4\" ng-if=\"!authentication\">\n" +
    "                    Not yet authenticated.\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <p class=\"row\">\n" +
    "                <label class=\"span4\">Pin code from Trakt</label>\n" +
    "                <input class=\"span5\" type=\"text\" placeholder=\"Ex : 73F75D39\" ng-model=\"pin\" tabindex=\"4\"/>\n" +
    "            </p>\n" +
    "\n" +
    "            <div class=\"row\" style=\"padding : .5rem 1rem;\">\n" +
    "                <div class=\"span4\">How do I get my PIN</div>\n" +
    "                <div class=\"span5 pin-instruction\">\n" +
    "                    Visit the following url\n" +
    "                    <a href=\"https://trakt.tv/pin/5615\" target=\"_blank\">https://trakt.tv/pin/5615</a>\n" +
    "                    <div class=\"separator-with-text\">or</div>\n" +
    "                    Scan the follwing QR code </br>\n" +
    "                    <img class=\"qr-code\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIAAQAAAADcA+lXAAAD8klEQVR4nO2dQXKjQAxFkUkV2Xlu4NwE3wxzs3CT5AZhN1TF7pG+1EASu2YRnGGo3wvKAfulvVBJ+lLLu/TNtSu+uQgggAACCCCAAAIIuBcgybSe7Mar+NNeJP6D3hn0KS55nZbbAQEEEJABVaRQ7/m+PJqR/orLWeqkd+qkT+p468uyOyCAgM0AutFZ6Tqk9LvoSreaV5Eqm44tOMKH5XdAAAHbA5zlqdCA8Ghx4mn+oJMf2gEBBGwDoF5HndGj/9GKqJsa5Oknd0AAAf81AKnQyV7lfKg+qx2dJL0VbYR5yJkK+ZBcregrEEDAGgBZ5bNUCBfNmfLqxT1TlVoL87q5briir0AAAWsAyKwl4mXU7jp71lz00k4CRDV762m5HRBAwIYA6nCggYsUZXKlQUzImxeqjoU+PkIsv8MOCCCAAF/1xYrE1ZhQ6SvzaihUNe/zjyANY9mYAAKuA9RtIVhEdjVp63uLBfdWmaqtdAWV4xlpGBUMAgi4BogUq/fyrld0q9TaHciBTQiEXTQ0IU48MOkigIAvADili7qgZLbiXmcQiBfNOfcCQryQ/Uy8WHAHBBCwJYAlR+3omSyew50yeybzXmMH7qlkcx8BBFwBoF0Pr5AuWQhn8Rzs6OKJE0pXmjP1Y5i36A4IIGAjAMktsShU6aUTV/PUjlKW7UxWRze6vYtVXwIIuAEI7c5tBFXfvHb5tppQK+aeziaW8wwHAQTcCQDxr4jsKuRAL1SFkn4wk2xS/lhL10YAAdcBg7VWaECIpMt6MDS7OpqsjhpvAb2iSs9F7nMqrCvjtOQOCCBgE4DkuVQ0qKP0K3v3VVjwQ2i+9aovXBi7Awkg4BqgChsZLN+CRfVjC0Xhvsq19UFjPWsafKBnIoCAGwAIE+qZusiQYgpFE8Xg8ExudWpjIcKv6isQQMC/B0g+P9UgwouGiWcMWEJLbOly+hFHr3YfztOv5CsQQMBaAIPLDX50qowwLwSI5H4ItSzrR6K2TgABNwFmI63kqWJ+mRb80Ksf83XPxDCPAALuBZB8wMMPC0OvgA87WA/GIU3TyrwntzcFg33rBBDwFfBpqi2iwjzGAsEi1uBJ19FeM04kgIAbgPlQWlxMSS+tXxAnQUwgdE0jRHie9SWAgJuA2VDa8YCHNwZGZ4W32so42IJhHgEE/A3gjbW9x3NY7YMrGH5wfupQutcOCCBgOwAEdensvmo//tIAvJfXgTmFggACbgFmQ2mnnAnaA7R1/BrBtFr2IxFAwHXAfCgt1sx0oiyFARSYTOvjx5gzEUDAHQCfptpGQlVfPESMFMv71lHRevsM+PYOCCCAAAIIIIAAAghYFvAHGcp+35Z69Z0AAAAASUVORK5CYII=\"/>\n" +
    "                    <br />\n" +
    "                    Follow instruction on screen and authorize Arch. Enter your pin in the above textfield.\n" +
    "                </div>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</form>");
}]);

angular.module("modules/tvshow/calendar.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/tvshow/calendar.tpl.html",
    "<div class=\"cards fill-height\">\n" +
    "    <div class=\"kodi\" ng-show=\"!dates.length || fetching\" ng-class=\"{fetching : fetching}\"></div>\n" +
    "    <div class=\"cal-summary detail\">\n" +
    "        <h1>\n" +
    "            <i class=\"previous\" ng-click=\"previousMonth()\">&#8592;</i>\n" +
    "            <i class=\"next\" ng-click=\"nextMonth()\">&#8594;</i>\n" +
    "            {{refDate.format('MMMM')}}\n" +
    "        </h1>\n" +
    "        <p ng-show=\"showsCount()\">\n" +
    "            <b>{{getEpisodesFor(refDate, 'month').length}}</b> episodes from <b>{{showsCount()}}</b> shows airing this month.\n" +
    "        </p>\n" +
    "        <ul>\n" +
    "            <li ng-repeat=\"(key, value) in shows\" class=\"repeat-animation\">\n" +
    "                <a href=\"#/tvshows/tmdb/{{value.ids.tmdb}}\">\n" +
    "                    <div class=\"banner\" image image-source=\"getBanner(value)\"></div>\n" +
    "                    <div class=\"counter\">{{value.hit}}</div>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li ng-show=\"!showsCount()\">Oops! nothing here</li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "    <ul data-type=\"list\" class=\"cal-grid\">\n" +
    "        <li ng-repeat=\"date in dates\" class=\"repeat-animation cal-day\" on-last-repeat>\n" +
    "            <header ng-class=\"{today : isToday(date), past: isPast(date), future: isFuture(date)}\">\n" +
    "                <div class=\"date\">{{date.format('D')}}</div>\n" +
    "                <div class=\"day\">{{date.format('ddd')}}</div>\n" +
    "                <div class=\"month\">{{date.format('MMM')}}</div>\n" +
    "            </header>\n" +
    "            <div ng-repeat=\"show in getEpisodesFor(date) as episodes\" class=\"card\">\n" +
    "                <a href=\"#/tvshows/tmdb/{{show.show.ids.tmdb}}\">\n" +
    "                    <div class=\"poster\" image image-source=\"getPoster(show)\">\n" +
    "                        <flipper ng-if=\"!isFuture(date)\">\n" +
    "                            <div class=\"front\">\n" +
    "                                <div rating rating-value=\"show.episode.rating || show.show.rating\" rating-max=\"10\"></div>\n" +
    "                            </div>\n" +
    "                            <div class=\"back\">\n" +
    "                                <div class=\"md-circle rating\">\n" +
    "                                    <i class=\"fa fa-play\" ng-click=\"play(show); $event.preventDefault();\"></i>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </flipper>\n" +
    "                        <div class=\"rating-wrapper\" ng-if=\"isFuture(date)\">\n" +
    "                            <div rating rating-value=\"show.episode.rating || show.show.rating\" rating-max=\"10\"></div>\n" +
    "                        </div>\n" +
    "                        <img src=\"https://cdn.rawgit.com/ccMatrix/StudioLogos/master/161x109_mono_png/{{show.show.network}}.png\" class=\"network\" onerror=\"this.src='img/icons/default-studio.png';\"/>\n" +
    "                    </div>\n" +
    "                    <div class=\"description\">\n" +
    "                        <h3>{{show.episode.number | episode:show.episode.season}} - {{show.episode.title || 'TBA'}}</h3>\n" +
    "                        <div>{{show.show.title}}</div>\n" +
    "\n" +
    "                    </div>\n" +
    "                </a>\n" +
    "            </div>\n" +
    "            <div ng-if=\"!episodes.length\" class=\"support\">\n" +
    "                <img src=\"../img/backgrounds/support.png\" width=\"100%\"/>\n" +
    "                <h3>\n" +
    "                    Enjoying Arch ? Support us!\n" +
    "                    <button class=\"recommend\" ng-click=\"showSupport()\">\n" +
    "                        <i class=\"fa fa-paypal\"></i>Donate\n" +
    "                    </button>\n" +
    "                </h3>\n" +
    "            </div>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);

angular.module("modules/tvshow/details.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/tvshow/details.tpl.html",
    "<div ng-switch on=\"loading\" class=\"tvshow detail fill-height\" ng-class=\"{loading : loading}\">\n" +
    "    <div ng-switch-when=\"true\" class=\"loading\"><div class=\"kodi\"></div></div>\n" +
    "    <div ng-switch-when=\"false\">\n" +
    "        <i class=\"fa fa-chevron-left previous\"\n" +
    "           ng-if=\"seasons.indexOf(season) > 0\"\n" +
    "           ng-click=\"previousSeason()\"></i>\n" +
    "        <i class=\"fa fa-chevron-right next\"\n" +
    "           ng-if=\"seasons.indexOf(season) < seasons.length-1\"\n" +
    "           ng-click=\"nextSeason()\"></i>\n" +
    "        <div class=\"experimental row\" ng-show=\"!isExternalAddonAvailable && isUsingExternalAddon()\">\n" +
    "            <div class=\"offset2 span8\">\n" +
    "                <i class=\"fa fa-flask\"></i>\n" +
    "                {{host.videoAddon}} needed to preview discoverable content.\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row wrapper\">\n" +
    "            <tmdb-fanarts fanarts=\"fanarts\" delay=\"10000\" primary=\"show.fanart\"></tmdb-fanarts>\n" +
    "            <div class=\"title\">\n" +
    "                <h1 ng-if=\"season\">{{seasonName(season)}}</h1>\n" +
    "                <h2>{{show.title || show.name}}</h2>\n" +
    "            </div>\n" +
    "            <trakt-stats stats=\"stats\"></trakt-stats>\n" +
    "        </div>\n" +
    "        <div class=\"description row\">\n" +
    "            <div class=\"offset1 span2 sidebar\">\n" +
    "                <div class=\"poster-wrapper\">\n" +
    "                    <img class=\" poster\" image image-source=\"getImage(season.thumbnail || season.poster || show.thumbnail, 'w500')\"/>\n" +
    "                </div>\n" +
    "\n" +
    "                <ul class=\"nav sections\">\n" +
    "                    <li style=\"text-align: center\">\n" +
    "                        {{show.title || show.name}}\n" +
    "                        <seekbar seekbar-value=\"show.watchedepisodes\" seekbar-max=\"show.episode\"\n" +
    "                                 seekbar-read-only=\"true\" class=\"progress-wrapper\"\n" +
    "                                 ng-if=\"show.watchedepisodes\">\n" +
    "                        </seekbar>\n" +
    "                    </li>\n" +
    "                    <li class=\"row\">\n" +
    "                        <div class=\"span6 label\">\n" +
    "                            <i class=\"fa fa-television\"></i>\n" +
    "                            Season\n" +
    "                        </div>\n" +
    "                        <div class=\"span6 value\">{{season.season}}</div>\n" +
    "                    </li>\n" +
    "                    <li class=\"row\">\n" +
    "                        <div class=\"span6 label\">\n" +
    "                             <i class=\"fa fa-star\"></i>\n" +
    "                             Rating\n" +
    "                        </div>\n" +
    "                        <div class=\"span6 value\">{{show.rating| number : 1}}</div>\n" +
    "                    </li>\n" +
    "                    <li class=\"row\">\n" +
    "                        <div class=\"span6 label\">\n" +
    "                            <i class=\"genre-{{show.genre[0].toLowerCase()}}\"></i>\n" +
    "                            Genre\n" +
    "                        </div>\n" +
    "                        <div class=\"span6 value\"> {{show.genre[0]}} </div>\n" +
    "                    </li>\n" +
    "                    <li class=\"row\">\n" +
    "                        <div class=\"span6 label\">\n" +
    "                             <i class=\"fa fa-calendar\"></i>\n" +
    "                             Released\n" +
    "                        </div>\n" +
    "                        <div class=\"span6 value\">{{getYear(show, season)}}</div>\n" +
    "                    </li>\n" +
    "                    <li class=\"row\">\n" +
    "                        <div class=\"span6 label\">\n" +
    "                             <i class=\"fa fa-trakt\"></i>\n" +
    "                             Watching\n" +
    "                        </div>\n" +
    "                        <div class=\"span6 value\">{{watching.length}}</div>\n" +
    "                    </li>\n" +
    "                    <li class=\"row\" ng-show=\"show.watchedepisodes\">\n" +
    "                        <div class=\"span6 label\">Progress</div>\n" +
    "                        <div class=\"span6 value\">{{show.watchedepisodes}}/{{show.episode}}</div>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "            <div class=\"span7 content\">\n" +
    "                <div  class=\"details-section row\">\n" +
    "                    <div class=\"span9\">\n" +
    "                        <h1>Synopsis</h1>\n" +
    "                        <p >{{show.plot}}</p>\n" +
    "                    </div>\n" +
    "                    <trakt-actions class=\"span3\" media-type=\"'shows'\" slug=\"show.traktSlug\">\n" +
    "                    </trakt-actions>\n" +
    "                </div>\n" +
    "                <div  class=\"details-section\" ng-if=\"nextAiringEpisode\">\n" +
    "                    <h1>\n" +
    "                      <i class=\"fa fa-clock-o\"></i>\n" +
    "                      Next Episode\n" +
    "                    </h1>\n" +
    "                    <div class=\"row next-episode\">\n" +
    "                        <div class=\"thumbnail span4\" image image-source=\"nextAiringEpisode.thumbnail | tmdbImage:'w300' | fallback:'img/icons/awe-512.png'\">\n" +
    "                        </div>\n" +
    "                        <div class=\"span8\">\n" +
    "                            <p>\n" +
    "                                {{nextAiringEpisode.episode | episode:nextAiringEpisode.season}} -\n" +
    "                                {{nextAiringEpisode.title || nextAiringEpisode.name}} airs {{nextAiringEpisode.firstaired | date : 'fullDate'}}\n" +
    "                            </p>\n" +
    "                            <p>{{nextAiringEpisode.plot}}</p>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div  class=\"details-section\" ng-if=\"seasons.length\">\n" +
    "                    <h1>\n" +
    "                        <span class=\"season\">\n" +
    "                            <span class=\"md-circle fanart\" image image-source=\"getImage(season.thumbnail || season.poster, 'w500')\">\n" +
    "                            </span>\n" +
    "                            {{seasonName(season)}}\n" +
    "                        </span>\n" +
    "                        <i class=\"fa fa-chevron-right\"></i>\n" +
    "                        Episodes\n" +
    "                    </h1>\n" +
    "                </div>\n" +
    "                <ul data-type=\"list\">\n" +
    "                    <li class=\"row episode playable\" ng-repeat=\"episode in episodes\"\n" +
    "                        ng-click=\"play(episode)\">\n" +
    "                        <div class=\"thumbnail span4\" image image-source=\"getImage(episode.thumbnail, 'w300')\">\n" +
    "                            <div class=\"md-action md-action-primary\">\n" +
    "                                <i class=\"fa fa-play\"></i>\n" +
    "                            </div>\n" +
    "                            <div class=\"playcount\" ng-show=\"episode.playcount\">\n" +
    "                                 <i class=\"fa fa-check\"></i>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"span8\">\n" +
    "                            <h3>\n" +
    "                                <span class=\"se\">{{episode.episode | episode:episode.season}}</span>\n" +
    "                                {{episode.title || episode.name}}\n" +
    "                            </h3>\n" +
    "                            <div>\n" +
    "                                <span class=\"firstaired\" ng-if=\"episode.firstaired\">{{episode.firstaired}}</span>\n" +
    "                                <span class=\"runtime\" ng-if=\"episode.runtime\">{{episode.runtime | time | date:'HH:mm'}}</span>\n" +
    "                            </div>\n" +
    "                            <p>{{episode.plot}}</p>\n" +
    "                            <div class=\"more\" ng-show=\"hasControls()\">\n" +
    "                                <i class=\"fa fa-ellipsis-v\"></i>\n" +
    "                                <ul class=\"dropdown-menu\">\n" +
    "                                    <li ng-click=\"xbmc.queue({'episodeid' : episode.episodeid}); $event.stopPropagation();\"\n" +
    "                                        ng-show=\"player.active\">\n" +
    "                                        <i class=\"fa fa-plus\"></i>\n" +
    "                                        Queue\n" +
    "                                    </li>\n" +
    "                                    <li ng-click=\"toggleWatched(episode); $event.stopPropagation();\">\n" +
    "                                        <i class=\"fa\" ng-class=\"{'fa-eye':!episode.playcount, 'fa-eye-slash':episode.playcount}\"></i>\n" +
    "                                        Toggle watch\n" +
    "                                    </li>\n" +
    "                                    <li ng-click=\"remove($index, episode); $event.stopPropagation();\">\n" +
    "                                        <i class=\"fa fa-trash\"></i>\n" +
    "                                        Remove\n" +
    "                                    </li>\n" +
    "                                </ul>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "                <div ng-show=\"!episodes.length\" class=\"empty list\">Oops! nothing here</div>\n" +
    "                <div  class=\"details-section\" ng-if=\"comments.length\">\n" +
    "                    <h1>Popular comments</h1>\n" +
    "                    <trakt-comments comments=\"comments\"></trakt-comments>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("modules/tvshow/episodes.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/tvshow/episodes.tpl.html",
    "<div class=\"cards fill-height\">\n" +
    "    <div class=\"kodi\" ng-show=\"loading\"></div>\n" +
    "    <no-source source=\"'tvshows'\" ng-if=\"empty\"></no-source>\n" +
    "    <ul data-type=\"list\" lr-infinite-scroll=\"loadMore\">\n" +
    "        <li class=\"card tvshow repeat-animation\" ng-repeat=\"episode in episodes\">\n" +
    "            <a href=\"#/tvshows/{{episode.tvshowid}}\">\n" +
    "                <div class=\"poster\" image image-source=\"episode.art['tvshow.poster'] | asset:host | fallback:'img/icons/awe-512.png'\">\n" +
    "                    <flipper>\n" +
    "                        <div class=\"front\">\n" +
    "                            <div rating rating-value=\"episode.rating\" rating-max=\"10\"></div>\n" +
    "                        </div>\n" +
    "                        <div class=\"back\">\n" +
    "                            <div class=\"md-circle rating\">\n" +
    "                                <i class=\"fa fa-play\" ng-click=\"helper.local.shows.play(episode); $event.preventDefault();\"\n" +
    "                                   ng-show=\"!player.active\"></i>\n" +
    "                                <i class=\"fa fa-plus\" ng-click=\"xbmc.queue({'episodeid' : episode.episodeid}); $event.preventDefault();\"\n" +
    "                                   ng-show=\"player.active\"></i>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </flipper>\n" +
    "                    <div class=\"playcount\" ng-show=\"episode.playcount\">\n" +
    "                         <i class=\"fa fa-check\"></i>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"description\">\n" +
    "                    <h3>{{episode.title}}</h3>\n" +
    "                    <p>Episode {{episode.episode}}</p>\n" +
    "                    <p class=\"clock\">\n" +
    "                        {{episode.runtime | time | date:'HH:mm'}}\n" +
    "                    </p>\n" +
    "                    <seekbar seekbar-value=\"episode.resume.position\" seekbar-max=\"episode.resume.total\"\n" +
    "                             seekbar-read-only=\"true\">\n" +
    "                    </seekbar>\n" +
    "                    <div class=\"controls\">\n" +
    "                        <i class=\"fa\" ng-class=\"{'fa-eye':!episode.playcount, 'fa-eye-slash':episode.playcount}\"\n" +
    "                           ng-click=\"toggleWatched(episode); $event.preventDefault();\"\n" +
    "                        ></i>\n" +
    "                        <i class=\"fa fa-trash\"\n" +
    "                           ng-click=\"remove($index, episode); $event.preventDefault();\"\n" +
    "                        ></i>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);

angular.module("modules/tvshow/list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/tvshow/list.tpl.html",
    "<div class=\"cards fill-height\">\n" +
    "    <div class=\"kodi\" ng-show=\"loading\"></div>\n" +
    "    <no-source source=\"'tvshows'\" ng-if=\"empty\"></no-source>\n" +
    "    <ul data-type=\"list\" lr-infinite-scroll=\"loadMore\">\n" +
    "        <li class=\"card tvshow repeat-animation\" ng-repeat-start=\"show in tvshows\">\n" +
    "            <a href=\"{{getEpisodesPath(show)}}\">\n" +
    "                <div class=\"poster\" image image-source=\"getPoster(show)\">\n" +
    "                    <flipper ng-show=\"hasControls()\">\n" +
    "                        <div class=\"front\">\n" +
    "                            <div rating rating-value=\"show.rating\" rating-max=\"10\"></div>\n" +
    "                        </div>\n" +
    "                        <div class=\"back\">\n" +
    "                            <div class=\"md-circle rating\">\n" +
    "                               <img class=\"studio\" image image-source=\"getStudio(show)\"\n" +
    "                                    onerror=\"this.src='img/icons/default-studio.png';\"/>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </flipper>\n" +
    "                    <div class=\"rating-wrapper\" ng-show=\"!hasControls()\">\n" +
    "                        <div rating rating-value=\"show.rating\" rating-max=\"10\"></div>\n" +
    "                    </div>\n" +
    "                    <div class=\"playcount\" ng-show=\"show.playcount\">\n" +
    "                         <i class=\"fa fa-check\"></i>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"description\">\n" +
    "                    <h3>{{show.title || show.name}}</h3>\n" +
    "                    <p>{{getExtra(show)}}</p>\n" +
    "                    <div ng-show=\"hasControls()\">\n" +
    "                        <p class=\"clock\">&nbsp;</p>\n" +
    "                        <seekbar seekbar-value=\"show.watchedepisodes\" seekbar-max=\"show.episode\"\n" +
    "                                 seekbar-read-only=\"true\">\n" +
    "                        </seekbar>\n" +
    "                        <div class=\"controls\">\n" +
    "                            <i class=\"fa\" ng-class=\"{'fa-eye':!show.playcount, 'fa-eye-slash':show.playcount}\"\n" +
    "                               ng-click=\"toggleWatched(show); $event.preventDefault();\"\n" +
    "                            ></i>\n" +
    "                            <i class=\"fa fa-trash\"\n" +
    "                               ng-click=\"remove($index, show); $event.preventDefault();\"\n" +
    "                            ></i>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </a>\n" +
    "        </li>\n" +
    "        <li class=\"card tvshow\" ng-repeat-end ng-if=\"$index===supportIndex\" ng-click=\"showSupport();\">\n" +
    "            <a href=\"javascript:void:0;\">\n" +
    "                <div class=\"poster\" image image-source=\"'img/backgrounds/support.png'\">\n" +
    "                    <img src=\"../img/icons/loading.png\" class=\"arch\" width=\"75%\"/>\n" +
    "                    <div class=\"rating-wrapper\">\n" +
    "                        <div class=\"md-circle rating\">\n" +
    "                            <i class=\"fa fa-paypal\"></i>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                 <div class=\"description\">\n" +
    "                    <h3>Enjoying Arch ?</h3>\n" +
    "                    <p>Support us!</p>\n" +
    "                    <div ng-show=\"hasControls()\">\n" +
    "                        <seekbar seekbar-value=\"0\" seekbar-max=\"1\"\n" +
    "                                 seekbar-read-only=\"true\">\n" +
    "                        </seekbar>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);

angular.module("modules/tvshow/shows.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/tvshow/shows.tpl.html",
    "<div class=\"fill-height tvshows\">\n" +
    "    <div class=\"tabs row\">\n" +
    "        <a class=\"span3 tab\" href=\"#/tvshows/popular\"\n" +
    "           ng-class=\"{selected :  isSelected('tvshows.popular')}\">\n" +
    "           Discover\n" +
    "        </a>\n" +
    "        <a class=\"span3 tab\" href=\"#/tvshows/calendar\"\n" +
    "           ng-class=\"{selected :  isSelected('tvshows.calendar')}\">\n" +
    "          <i class=\"fa fa-trakt\"></i>\n" +
    "          Calendar\n" +
    "        </a>\n" +
    "        <a class=\"span3 tab\" href=\"#/tvshows/recents\"\n" +
    "           ng-class=\"{selected :  isSelected('tvshows.recents')}\">\n" +
    "           Recently added episodes\n" +
    "        </a>\n" +
    "        <a class=\"span3 tab\" href=\"#/tvshows/all\"\n" +
    "           ng-class=\"{selected :  isSelected('tvshows.all')}\">\n" +
    "           All shows\n" +
    "        </a>\n" +
    "        <div class=\"scan\" ng-click=\"xbmc.scan('VideoLibrary')\">\n" +
    "            <i class=\"fa fa-barcode\" title=\"Scan video library\"></i>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div ui-view class=\"content\">\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("template/actions/actions.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/actions/actions.tpl.html",
    "<div class=\"trakt-actions\">\n" +
    "    <i class=\"fa fa-trakt\" ng-show=\"loading\"></i>\n" +
    "    <div class=\"hidden\" ng-class=\"{hidden : loading}\">\n" +
    "        <div class=\"button history\" ng-class=\"{selected : historyMatch.length}\"\n" +
    "             ng-click=\"toggleHistory()\">\n" +
    "            <i class=\"fa\" ng-class=\"{'fa-play-circle-o': !historyMatch.length, 'fa-play-circle': historyMatch.length}\"></i>\n" +
    "            <span ng-if=\"!historyMatch.length\">Add to history</span>\n" +
    "            <span ng-if=\"historyMatch.length\">Played</span>\n" +
    "            <small>{{historyMatch[0].last_watched_at | date : 'dd MMM'}}</small>\n" +
    "            <div class=\"loading\" ng-show=\"loadings.history\">\n" +
    "                <i class=\"fa fa-spinner fa-pulse\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"button collection\"  ng-class=\"{selected : collectionMatch.length}\"\n" +
    "             ng-click=\"toggleCollection()\">\n" +
    "            <i class=\"fa\" ng-class=\"{'fa-bookmark-o': !collectionMatch.length, 'fa-bookmark': collectionMatch.length}\"></i>\n" +
    "            <span ng-if=\"!collectionMatch.length\">Add to collection</span>\n" +
    "            <span ng-if=\"collectionMatch.length\">Collected</span>\n" +
    "            <small>{{collectionMatch[0].collected_at || collectionMatch[0].last_collected_at | date : 'dd MMM'}}</small>\n" +
    "            <div class=\"loading\" ng-show=\"loadings.collection\">\n" +
    "                <i class=\"fa fa-spinner fa-pulse\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"button watchlist\"  ng-class=\"{selected : watchlistMatch.length}\"\n" +
    "             ng-click=\"toggleWatchlist()\">\n" +
    "            <i class=\"fa fa-align-left\"></i>\n" +
    "            <span ng-if=\"!watchlistMatch.length\">Add to watchlist</span>\n" +
    "            <span ng-if=\"watchlistMatch.length\">Listed</span>\n" +
    "            <small>{{watchlistMatch[0].listed_at | date : 'dd MMM'}}</small>\n" +
    "            <div class=\"loading\" ng-show=\"loadings.watchlist\">\n" +
    "                <i class=\"fa fa-spinner fa-pulse\"></i>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("template/comments/comments.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/comments/comments.tpl.html",
    "<div ng-repeat=\"comment in comments\" class=\"row comment-wrapper\" ng-if=\"comment.comment\">\n" +
    "    <div class=\"caret\"></div>\n" +
    "    <p class=\"comment\" ng-class=\"{spoiler : comment.spoiler, revealed: comment.revealed}\"\n" +
    "        ng-click=\"comment.revealed = true;\">\n" +
    "        {{comment.comment}}\n" +
    "    </p>\n" +
    "    <div class=\"pull-right posted-at\">\n" +
    "        Posted {{comment.created_at | date : 'MMMM d, yyyy HH:mm'}}\n" +
    "    </div>\n" +
    "    <div class=\"user\">\n" +
    "        <a href=\"https://trakt.tv/users/{{comment.user.username}}\" target=\"_blank\">\n" +
    "            <img class=\"md-circle\" image image-source=\"comment.user.images.avatar.full | fallback:'img/icons/trakt.png'\"/>\n" +
    "        </a>\n" +
    "        <div class=\"name\">{{comment.user.username}}</div>\n" +
    "    </div>\n" +
    "</div> ");
}]);

angular.module("template/fanarts/fanarts.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/fanarts/fanarts.tpl.html",
    "<div class=\"fanarts\">\n" +
    "    <img image image-source=\"primary\"\n" +
    "         ng-if=\"!fanarts || !fanarts.length\"/>\n" +
    "    <img ng-repeat=\"fanart in fanarts\" image image-source=\"getImage(fanart.file_path)|filter:wideEnough\"\n" +
    "         ng-class=\"{fx : $index === index}\"/>\n" +
    "</div>");
}]);

angular.module("template/nosource/nosource.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/nosource/nosource.tpl.html",
    "<div class=\"no source\" style=\"background-image:url('{{getBackgroundImg()}}')\">\n" +
    "    <div class=\"message\">\n" +
    "        <div class=\"md-circle robot\">\n" +
    "            <i class=\"genre-family\"></i>\n" +
    "        </div>\n" +
    "        <h1>We looked everywhere</h1>\n" +
    "        <div>But it seems that you do not have any content yet.</div>\n" +
    "        <h2>What's next?</h2>\n" +
    "        <a href=\"{{getWikiPage()}}\" target=\"_blank\">Add a source</a>\n" +
    "        <div ng-if=\"hasPopular()\">\n" +
    "          <div class=\"separator-with-text\">or</div>\n" +
    "          <a href=\"#/{{source}}/popular\" >Discover something new</a>\n" +
    "        </div>\n" +
    "        <div class=\"genres\">\n" +
    "          <i class=\"genre-{{getIcon()}}\"></i>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("template/stats/stats.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/stats/stats.tpl.html",
    "<div class=\"stats row\">\n" +
    "    <div class=\"offset3 span7\">\n" +
    "        <i class=\"fa fa-trakt\"></i>\n" +
    "        <span>\n" +
    "            {{stats.votes | unit}}\n" +
    "            <small>votes</small>\n" +
    "        </span>\n" +
    "        <span>\n" +
    "            {{stats.watchers | unit}}\n" +
    "            <small>watchers</small>\n" +
    "        </span>\n" +
    "        <span>\n" +
    "            {{stats.plays | unit}}\n" +
    "            <small>plays</small>\n" +
    "        </span>\n" +
    "        <span>\n" +
    "            {{stats.collected_episodes | unit}}\n" +
    "            <small>collected</small>\n" +
    "        </span>\n" +
    "        <span>\n" +
    "            {{stats.lists | unit}}\n" +
    "            <small>lists</small>\n" +
    "        </span>\n" +
    "    </div>\n" +
    "</div>");
}]);
