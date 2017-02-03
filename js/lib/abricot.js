"use strict";
angular.module('directives.flipper', [])
.directive('flipper', ['$timeout', function ($timeout) {
  return {
    restrict: 'E',
    transclude : true,
    replace : true,
    templateUrl: 'template/flipper/flipper.tpl.html',
    link: function (scope, elem, attrs) {
      function isTouchDevice() {
        return (('ontouchstart' in window) || 
                (navigator.MaxTouchPoints > 0) || 
                (navigator.msMaxTouchPoints > 0));
      };
      if(isTouchDevice()) {
        scope.flipped = false;
        elem.bind('touchstart', function (evt) {
          evt.stopPropagation();
        });

        elem.bind('click', function (evt) {
          evt.stopPropagation();
        });
        elem.bind('touchend', function (evt) {
          evt.stopPropagation();
          scope.flipped = !scope.flipped;
        });
      }
    }
  };
}]); 
"use strict";
angular.module('directives.hold', [])
.directive('ngHold', ['$parse', '$interval', function ($parse, $interval) {
  var isTouch = !!('ontouchstart' in window);
  var promise = null;
  return  {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var promise = null;;
      var  clickHandler = $parse(attrs.ngHold);

      var down = function () {
        if(promise === null) {
          promise = $interval(function() {
            clickHandler(scope);
          }, 100);
        }
      };

      var up = function () {
        $interval.cancel(promise);
        promise = null;
      };

      // if there is no touch available, we'll fall back to click
      if (isTouch) {
        element.bind('touchstart', down);
        element.bind('touchleave', up);
        element.bind('touchend', up);
      } else {
        element.bind('mousedown', down);
        element.bind('mouseup', up);
      }
    }
  };
}]);
"use strict";
angular.module('directives.image', [])
.directive('image', function () {
  return  {
    restrict: 'A',
    scope: {
      imageSource: '='
    },
    link: function (scope, elem, attrs) {
      var element = elem[0];
      var asChromeApp = false;
      if(window.chrome && window.chrome.storage) {
        asChromeApp = true;
      }
      var updateValue = function () {
        if(asChromeApp) {
          var remoteImage = new RAL.RemoteImage({
            element : element,
            src : scope.imageSource ,
            width : element.offsetWidth,
            height : element.offsetHeight
          });
          RAL.Queue.add(remoteImage, true);
        } else {
          if(element.tagName.toLowerCase() === 'img') {
            element.src = scope.imageSource 
          } else {
            element.style.backgroundImage = 'url(\'' + scope.imageSource + '\')';
          } 
          
        }
      };
      scope.$watch('imageSource', function (newVal, oldVal) {
        if (newVal) {
          updateValue();
        }
      });
    }
  };
});
"use strict";
angular.module('directives.keybinding', [])
.directive('keybinding', function () {
  return {
    restrict: 'E',
    link: function (scope, el, attrs) {
      var fn = function (e) {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          // internet explorer
          e.returnValue = false;
        }
        scope.$apply(attrs.invoke);
      };
      Mousetrap.bind(attrs.on, fn);
      el.on('$destroy', function() {
        Mousetrap.unbind(attrs.on);
      });
    }
  };
});
"use strict";
angular.module('directives.rating', [])
.directive('rating', function () {
  return {
    restrict: 'A',
    templateUrl: 'template/rating/rating.tpl.html',
    scope: {
      ratingValue: '=',
      ratingMax: '='
    },
    link: function (scope, elem, attrs) {
      var updateValue = function () {
        scope.roundedValue = Math.floor(scope.ratingValue * 10 )/10;
      };

      scope.$watch('ratingValue', function (newVal, oldVal) {
        if (newVal) {
          updateValue();
        }
      });
    }
  };
});
"use strict";
angular.module('directives.seekbar', [])
.directive('seekbar', function () {
  return {
    restrict: 'E',
    replace : true,
    templateUrl: 'template/seekbar/seekbar.tpl.html',
    scope: {
      seekbarValue: '=',
      seekbarMax: '=',
      onSeekbarChanged: '&'
    },
    link: function (scope, elem, attrs) {
      var seekbarReadOnly = angular.isDefined(attrs.seekbarReadOnly) ? attrs.seekbarReadOnly : false;
      scope.seekbarIsVertical =  false;
      if(angular.isDefined(attrs.seekbarOrientation) && attrs.seekbarOrientation == 'vertical') {
        scope.seekbarIsVertical = true;
      }
      var thumb = elem.find('button');
      var progress = elem.find('progress');
      var body = angular.element(document).find('body');

      var update = function (value) {
        thumb.css('left', value + '%');
        progress.attr('value', Math.round(value));
      };

      if(seekbarReadOnly) {
        thumb.css('display', 'none');
      } else {
        var moving = false;
        var newValue = -1;

        var offset = function (el) {
          return el[0].getBoundingClientRect();
        };

        var toPercentage = function (target, progress) {
          var position =  offset(progress);
          var percent = (target.clientX - position.left) / position.width;
          if(scope.seekbarIsVertical) {
            percent = (position.height - (target.clientY -  position.top))/ position.height;
          }
          return percent;
        };

        progress.bind('click touchstart', function (evt) {
          evt.stopPropagation();
          var target = evt.touches ? evt.touches[0] : evt;
          var percent = toPercentage(target, progress);
          if (percent < 0)
            percent = 0;
          if (percent > 1)
            percent = 1;
          update(scope.seekbarMax * percent);
          scope.onSeekbarChanged({newValue: parseInt(progress.attr('value'))});
        });

        thumb.bind('mousedown touchstart', function (evt) {
          evt.stopPropagation();
          thumb.addClass('active');
          moving = true;
        });

        var onMove = function (evt) {
          evt.stopPropagation();
          if (moving) {
            var target = evt.touches ? evt.touches[0] : evt;
            var percent = toPercentage(target, progress);
            if (percent < 0)
              percent = 0;
            if (percent > 1)
              percent = 1;
            update(scope.seekbarMax * percent);
          }
        };

        thumb.bind('touchmove', onMove);
        body.bind('mousemove', onMove);

        var onMoveEnd = function () {
          if(moving) {
            scope.onSeekbarChanged({newValue: parseInt(progress.attr('value'))});
            moving = false;
            thumb.removeClass('active');
          }
        }
        thumb.bind('touchend', onMoveEnd);
        body.bind('mouseup', onMoveEnd);

        var onMouseWheel = function (event) {
          event = window.event || event;
          var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
          var oldValue = parseInt(progress.attr('value'));
          var newValue = oldValue + delta;
          if (newValue < 0)
            newValue = 0;
          if (newValue > 100)
            newValue = 100;
          scope.onSeekbarChanged({newValue: newValue});
        };

        elem[0].addEventListener('DOMMouseScroll', onMouseWheel, false ); // For FF and Opera
        elem[0].addEventListener('mousewheel', onMouseWheel, false ); // For others
      }

      scope.$watch('seekbarValue', function (newVal, oldVal) {
        if (newVal && !moving) {
          scope.seekbarValue = newVal;
          update(newVal);
        }
      });

      scope.$on('$destroy', function() {
       if(!seekbarReadOnly) {
          elem[0].removeEventListener('DOMMouseScroll', onMouseWheel, false ); // For FF and Opera
          elem[0].removeEventListener('mousewheel', onMouseWheel, false ); // For others
        }
      });
    }
  }
});
"use strict";
angular.module('directives.spinner', [])
.directive('spinner', function () {
  return {
    restrict: 'E',
    replace : true,
    templateUrl: 'template/spinner/spinner.tpl.html',
    link: function (scope, elem, attrs) {
    }
  };
});
"use strict";
angular.module('directives.streamdetails', [])
.directive('streamdetails', function () {
  return {
    restrict: 'E',
    replace : true,
    templateUrl: 'template/streamdetails/streamdetails.tpl.html',
    scope: {
      details: '='
    },
    link: function (scope, elem, attrs) {
      scope.hasAudio = function () {
        return scope.details && scope.details.audio && scope.details.audio.length >0;
      };
      scope.hasVideo = function () {
        return scope.details && scope.details.video && scope.details.video.length >0;
      };
      scope.hasSubtitle = function () {
        return scope.details && scope.details.subtitle && scope.details.subtitle.length >0;
      };

      scope.getVideoMode = function () {
        if(scope.hasVideo()) {
          var firstVideo = scope.details.video[0];
          if(firstVideo.width >= 1280) {
            return 'HD';
          } else {
            return 'SD';
          }
          return scope.details.video[0].height;
        } else {
          return '';
        }
      };

      scope.getAudioChannels = function () {
        if(scope.hasAudio()) {
          var firstAudio = scope.details.audio[0];
          if(firstAudio.channels < 3) {
            return firstAudio.channels;
          } else {
            return firstAudio.channels-1+'.1'; 
          }
        } else {
          return '';
        }
      };

      scope.getAudioCodec = function () {
        return scope.details.audio[0].codec;
      };

      scope.getAudioLanguage = function () {
        if(scope.details.audio.length === 1) {
          var firstAudio = scope.details.audio[0];
          return firstAudio.language;
        } else {
          return 'multi';
        }
      };

      scope.getSubtitles = function () {
        if(scope.details.subtitle.length === 1) {
          var firstSubtitle = scope.details.subtitle[0];
          return firstSubtitle.language;
        } else {
          return 'multi';
        }
      };
    }
  };
}); 
angular.module('filters.xbmc.asset', [])
.filter('asset', function () {
  return function (input, host) {
    if (input && host) {
      var securityPrefix = '';
      var asChromeApp = false;
      if(window.chrome && window.chrome.storage) {
        asChromeApp = true;
      }
      if(!asChromeApp && host.username !== '' && host.password !== '') {
       securityPrefix = host.username + ':' + host.password + '@';
      }
      var regExp = new RegExp('image://([^/]*)');
      var matches = input.match(regExp);
      if(matches.length === 2) {
        return 'http://' + securityPrefix + host.ip + ':'+host.httpPort+'/image/' + encodeURIComponent('image://'+matches[1]+'/');
      }  
    } 
    return '';
  };
});
angular.module('filters.xbmc.episode', [])
.filter('episode', function () {
  return function (input, season) {
    var episode = parseInt(input);
    if (season && episode && !isNaN(episode)) {
      return 'S' + (season < 10 ? '0' + season : season) + 'E' + (episode < 10 ? '0' + episode : episode);
    } else {
      return '';
    }
  };
});
angular.module('filters.xbmc.thumb', [])
.filter('thumb', function () {
  return function (input) {
    var defaultValue = '';
    if (input) {
      if (input['album.thumb']) {
        return  input['album.thumb'];
      }
      if (input['tvshow.poster']) {
        return  input['tvshow.poster'];
      }
      if (input.poster) {
        return  input.poster;
      }
      if (input.thumb) {
        return input.thumb;
      }
    }
    return defaultValue;
  };
});
angular.module('filters.xbmc.time', [])
.filter('time', function () {
  return function (input) {
    if (typeof input === 'number') {
      var d = new Date();
      d.setHours(0);
      d.setMinutes(0);
      d.setSeconds(0);
      return new Date(d.getTime() + input * 1000);
    }
    if (typeof input === 'object') {
      var seconds = 0;
      seconds += input.hours * 60 * 60;
      seconds += input.minutes * 60;
      seconds += input.seconds;
      return seconds;
    }
  };
});
angular.module('filters.xbmc.trust', [])
.filter('trust', ['$sce', function ($sce) {
  return function(url) {
    return $sce.trustAsResourceUrl(url);
  };
}]);
angular.module('filters.xbmc', [
  'filters.xbmc.asset',
  'filters.xbmc.episode',
  'filters.xbmc.thumb',
  'filters.xbmc.time',
  'filters.xbmc.trust'
]);
angular.module('services.io', ['services.websocket'])
.factory('io', ['$rootScope', '$q', '$parse', 'websocket',
  function($rootScope, $q, $parse, transport) {
    var factory = {};
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
    };

    function getDefer(id, method, pathExpr) {
      var defer = $q.defer();
      callbacks[id] = {
        timestamp: Date.now(),
        cb: defer,
        parseExpr: pathExpr,
        method: method
      };
      return defer;
    };

    function onConnected() {
      transport.subscribe(onMessage.bind(this));
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
        var data = JSON.parse(event.data);
        if (callbacks.hasOwnProperty(data.id)) {
          var cb = callbacks[data.id];
          var obj = data;
          if (cb.hasOwnProperty('parseExpr')) {
            var getter = $parse(cb.parseExpr);
            obj = getter(data);
          }
          if(!$rootScope.$$phase) {
            $rootScope.$apply(callbacks[data.id].cb.resolve(obj));
          } else {
            callbacks[data.id].cb.resolve(obj);
          }
          delete callbacks[data.id];
        } else if (notifications[data.method] && notifications[data.method].length > 0) {
          for (var i = 0; i < notifications[data.method].length; i++) {
            var cb = notifications[data.method][i];
            $rootScope.$apply(cb.fn.call(cb.scope, data));
          }
        }
      }
    };

    factory.send = function (method, params, shouldDefer, pathExpr) {
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
      transport.send(request);
      return shouldDefer ? defer.promise : 0;
    };


    factory.isConnected = function() {
      return transport.isConnected();
    };

    factory.register = function(method, callback) {
      notifications[method] = notifications[method] || [];
      notifications[method].push(callback);
    };

    factory.unregister = function(method, callback) {
      notifications[method] = notifications[method] || [];
      var indexOf = notifications[method].indexOf(callback);
      if (indexOf > -1) {
        notifications[method] = notifications[method].splice(indexOf, 1);
      }
    };

    factory.connect = function(url, port) {
      transport.connect( url + ':' + port + '/jsonrpc', onConnected, onDiconnected);
    };

    factory.disconnect = function () {
      transport.disconnect();
    };

    return factory;
  }
]);

"use strict";
angular.module('services.jsonp', [])
.factory('jsonp', ['$rootScope', '$q', '$http', '$parse', '$interpolate',
  function ($rootScope, $q, $http, $parse, $interpolate) {
    // We return this object to anything injecting our service
    var factory = {};
    var isConnected = false;
    var urlFn;
    var msgCallback;
    factory.isConnected = function () {
      return isConnected;
    };

    factory.register = function (method, callback) {
    };

    factory.send = function (request) {
      var defer = $q.defer();
      var req = {
       method: 'POST',
       url: urlFn,
       headers: {
         'Content-Type': 'application/json'
       },
       data: request
      };
      $http(req).success(function (data) {
        msgCallback({data:JSON.stringify(data)});
      });
      return defer.promise;
    };

    factory.unregister = function (method, callback) {
    };

    factory.connect = function (partial, connectCallback, disconnectCallback) {
      urlFn = 'http://'+partial;
      isConnected = true;
      connectCallback();
    };

    factory.subscribe = function (callback) {
      msgCallback = callback
    };

    return factory;
  }
]);
"use strict";
angular.module('services.io.mock', [])
.factory('io', ['$rootScope', '$q', '$http', '$parse',
  function ($rootScope, $q, $http, $parse) {
    // We return this object to anything injecting our service
    var factory = {};
    var isConnected = false;
    factory.isConnected = function () {
      return isConnected;
    };

    factory.register = function (method, callback) {
    };

    factory.send = function (method, params, shouldDefer, pathExpr) {
      var defer = $q.defer();
      $http.get('/js/data/' + method + '.json').success(function (data) {
        var obj = data;
        if (pathExpr) {
          var getter = $parse(pathExpr);
          obj = getter(data);
        } else {
          obj = data;
        }
        window.setTimeout(function () {
          $rootScope.$apply(function () {
            defer.resolve(obj);
          });
        }, Math.round(Math.random() * 1000))
      });
      return defer.promise;
    };

    factory.unregister = function (method, callback) {
    };

    factory.connect = function () {
      isConnected = true;
    };

    return factory;
  }
]);

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
    if(url.indexOf('ws://')<0) {
      url = 'ws://' + url;
    }
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
    if(ws!==null) {
      ws.onclose = function(){}
      ws.close();
      dispose();
    }
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
angular.module('services.xbmc', ['services.io'])
.factory('xbmc', [ 'io', '$interpolate', '$http',
  function(io, $interpolate, $http) {
    // We return this object to anything injecting our service
    var factory = {};
    var activePlayer = -1;
    var activePlaylist = -1;
    var volume = 0;
    var _host = '';
    var jsonRpcFn = $interpolate('http://{{ip}}:{{port}}/jsonrpc?request={ "jsonrpc": "2.0", "method": "{{method}}", "params" : {{params}}}');

    factory.connect = function(host) {
      _host = host;
      io.connect(host.ip, host.port);
    };

    factory.disconnect = function(){
      io.disconnect();
    };

    factory.isConnected = function() {
      return io.isConnected();
    };

    factory.register = function(method, callback) {
      io.register(method, callback);
    };

    factory.unregister = function(method, callback) {
      io.unregister(method, callback);
    };

    factory.up = function() {
      io.send('Input.Up');
    };

    factory.down = function() {
      io.send('Input.Down');
    };

    factory.left = function() {
      io.send('Input.Left');
    };

    factory.right = function() {
      io.send('Input.Right');
    };

    factory.select = function() {
      io.send('Input.Select');
    };

    factory.back = function() {
      io.send('Input.Back');
    };

    factory.contextmenu = function() {
      io.send('Input.ContextMenu');
    };

    factory.info = function() {
      io.send('Input.Info');
    };

    factory.home = function() {
      io.send('Input.Home');
    };

    factory.sendText = function (textToSend) {
      //For some reaso sendText does not work thorugh websocket, fallbacking to jsonRPC
      var url = jsonRpcFn({
          ip : _host.ip,
          port : _host.httpPort,
          method : 'Input.SendText',
          params : JSON.stringify({'text' : textToSend})
        });
        $http.get(url);
    };

    factory.showOSD = function () {
      io.send('Input.ShowOSD');
    };

    factory.getActivePlayers = function(cb) {
      io.send('Player.GetActivePlayers', null, true, 'result').then(cb);
    };

    factory.setActivePlayer = function(playerId) {
      activePlayer = playerId;
    };

    factory.setActivePlaylist = function(playlistId) {
      activePlaylist = playlistId;
    };

    factory.getPlayerItem = function(cb, playerId) {
      playerId = playerId || activePlayer;
      io.send('Player.GetItem', {
        'properties': ['title', 'artist', 'albumartist', 'genre',
        'year', 'rating', 'album', 'track', 'duration', 'comment', 'lyrics',
        'musicbrainztrackid', 'musicbrainzartistid', 'musicbrainzalbumid',
        'musicbrainzalbumartistid', 'playcount', 'fanart', 'director', 'trailer',
        'tagline', 'plot', 'plotoutline', 'originaltitle', 'lastplayed', 'writer',
        'studio', 'mpaa', 'cast', 'country', 'imdbnumber', 'premiered', 'productioncode',
        'runtime', 'set', 'showlink', 'streamdetails', 'top250', 'votes', 'firstaired',
        'season', 'episode', 'showtitle', 'thumbnail', 'file', 'resume', 'artistid',
        'albumid', 'tvshowid', 'setid', 'watchedepisodes', 'disc', 'tag', 'art', 'genreid',
        'displayartist', 'albumartistid', 'description', 'theme', 'mood', 'style',
        'albumlabel', 'sorttitle', 'episodeguide', 'uniqueid', 'dateadded', 'channel',
        'channeltype', 'hidden', 'locked', 'channelnumber', 'starttime', 'endtime'
        ],
        'playerid': playerId
      }, true, 'result.item').then(cb);
    };

    factory.getPlayerProperties = function(cb) {
      io.send('Player.GetProperties', {
        'properties': ['percentage', 'time', 'totaltime',
        'speed', 'playlistid',
        'currentsubtitle', 'subtitles',
        'audiostreams', 'currentaudiostream', 'type'
        ],
        'playerid': activePlayer
      }, true, 'result').then(cb);
    };

    factory.getApplicationProperties = function(cb) {
      io.send('Application.GetProperties', {
        'properties': ['volume','muted', 'name', 'version']
      }, true, 'result').then(cb);
    };


    factory.goTo = function(index) {
      io.send('Player.GoTo', {
        'playerid': activePlayer,
        'to': index
      });
    };

    factory.next = function() {
      io.send('Player.GoTo', {
        'playerid': activePlayer,
        'to': 'next'
      });
    };

    factory.open = function(item) {
      io.send('Player.Open', {
        'item': item
      });
    };

    factory.previous = function() {
      io.send('Player.GoTo', {
        'playerid': activePlayer,
        'to': 'previous'
      });
    };

    factory.togglePlay = function() {
      io.send('Player.PlayPause', {
        'playerid': activePlayer
      });
    };

    factory.seek = function(newValue) {
      io.send('Player.Seek', {
        'playerid': activePlayer,
        'value': newValue
      });
    };

    factory.setAudioStream = function(audioStream) {
      var url = jsonRpcFn({
          ip : _host.ip,
          port : _host.httpPort,
          method : 'Player.SetAudioStream',
          params : JSON.stringify({
            'playerid': activePlayer,
            'stream': audioStream
          })
      });
      $http.get(url);
    };

    var subtitleState = null;
    factory.toggleSubtitles = function () {
      if(subtitleState === null) {
        factory.setSubtitle('off');
        subtitleState = 'off';
      } else {
        factory.setSubtitle(1);
        subtitleState = null;
      }

      factory.setSubtitle(1);
    },

    factory.setSubtitle = function(subtitle) {
      io.send('Player.SetSubtitle', {
        'playerid': activePlayer,
        'subtitle': subtitle,
        'enable': true
      });
    };

    factory.setSpeed = function(speed) {
      io.send('Player.SetSpeed', {
        'playerid': activePlayer,
        'speed': speed
      });
    };

    factory.stop = function() {
      io.send('Player.Stop', {
        'playerid': activePlayer
      });
    };

    factory.increaseVolume = function(volume) {
      factory.setVolume(Math.min(volume + 1, 100));
    };

    factory.decreaseVolume = function(volume) {
      factory.setVolume(Math.max(volume - 1, 0));
    };

    factory.setVolume = function(volume) {
      io.send('Application.SetVolume', {
        'volume':volume
      });
    };

    factory.mute = function() {
      io.send('Application.SetMute', {
        'mute': 'toggle'
      });
    };

    factory.shutdown = function() {
      io.send('System.Shutdown');
    };

    factory.hibernate = function() {
      io.send('System.Hibernate');
    };

    factory.suspend = function() {
      io.send('System.Suspend');
    };

    factory.reboot = function() {
      io.send('System.Reboot');
    };

    factory.activateWindow = function(params) {
      io.send('GUI.ActivateWindow', params);
    };

    factory.getPlaylistItems = function(cb) {
      io.send('Playlist.GetItems', {
        'playlistid': activePlaylist,
        'properties': ['title', 'art', 'duration', 'runtime', 'thumbnail', 'rating', 'fanart']
      }, true, 'result.items').then(cb);
    };

    factory.getPlaylists = function (cb) {
      io.send('Playlist.GetPlaylists', null, true, 'result').then(cb);
    };

    factory.queue = function(item, playlistid) {
      playlistid = playlistid || activePlaylist;
      if (playlistid > -1) {
        io.send('Playlist.Add', {
          'playlistid': playlistid,
          'item': item
        });
      } else{
        factory.open(item);
      }
    };

    factory.addFavourite = function (title, path, cb) {
      io.send('Favourites.AddFavourite', {
        'title' : title,
        'type' : 'media',
        'path' : path
      }, true, 'result').then(cb);
    };

    var moviesProperties = ['file', 'title', 'genre', 'rating', 'thumbnail', 'runtime', 'playcount',
                            'streamdetails', 'fanart', 'year', 'dateadded', 'resume', 'studio'];
    factory.getMovies = function(cb, limits) {
      limits = limits || {
        'start': 0,
        'end': 50
      };
      io.send('VideoLibrary.GetMovies', {
        'limits': limits,
        'properties': moviesProperties,
        'sort': {
          'order': 'ascending',
          'method': 'label',
          'ignorearticle': true
        }
      }, true, 'result').then(cb);
    };

    factory.getRecentlyAddedMovies = function(cb, limits) {
      io.send('VideoLibrary.GetRecentlyAddedMovies', {
        'properties': moviesProperties,
        'limits': limits
      }, true, 'result').then(cb);
    };

    factory.getMovieDetails = function(movieId, cb) {
      io.send('VideoLibrary.GetMovieDetails', {
        'properties': ['title', 'genre', 'rating', 'thumbnail', 'plot', 'streamdetails',
        'studio', 'director', 'fanart', 'runtime', 'trailer', 'imdbnumber','mpaa','cast',
        'writer', 'year','plotoutline', 'tagline', 'art', 'showlink', 'playcount', 'resume'
        ],
        'movieid': movieId
      }, true, 'result.moviedetails').then(cb);

    };

    factory.setMovieDetails = function (updateData, cb) {
       io.send('VideoLibrary.SetMovieDetails', updateData, true, 'result').then(cb);
    };

    factory.getAlbums = function(filter, cb, limits) {
      limits = limits || {
        'start': 0,
        'end': 50
      };
      var params = {
        'limits': limits,
        'properties': ['title', 'artist', 'thumbnail', 'year', 'genre', 'artistid', 'rating'],
        'sort': {
          'order': 'descending',
          'method': 'year',
          'ignorearticle': true
        },
      };
      if (filter && filter.key) {
        params.filter = {};
        params.filter[filter.key] = filter.value;
      }
      io.send('AudioLibrary.GetAlbums', params, true, 'result').then(cb);
    };

    factory.getAlbumDetails = function(albumid, cb) {
      io.send('AudioLibrary.GetAlbumDetails', {
        'albumid' : albumid,
        'properties': ['title','description', 'artist', 'genre', 'albumlabel', 'year',
                       'fanart',  'thumbnail', 'playcount', 'genreid', 'artistid',
                       'displayartist']
      }, true, 'result.albumdetails').then(cb);

    };

    factory.getArtists = function(cb, limits) {
      limits = limits || {
        'start': 0,
        'end': 50
      };
      io.send('AudioLibrary.GetArtists', {
        'limits': limits,
        'properties': ['genre', 'thumbnail', 'fanart'],
        'sort': {
          'order': 'ascending',
          'method': 'label',
          'ignorearticle': true
        }
      }, true, 'result').then(cb);

    };

    factory.getArtistDetails = function(artistid, cb) {
      io.send('AudioLibrary.GetArtistDetails', {
        'artistid' : artistid,
        'properties': ['instrument', 'style', 'mood', 'born', 'formed',
                       'description', 'genre', 'died', 'disbanded',
                       'yearsactive', 'musicbrainzartistid', 'fanart', 'thumbnail']
      }, true, 'result.artistdetails').then(cb);

    };

    factory.getSongs = function(filter, cb, limits) {
      limits = limits || {
        'start': 0,
        'end': 100
      }
      var params = {
        'limits': limits,
        'properties': ['title', 'artist', 'album', 'albumid', 'thumbnail', 'duration', 'track', 'year', 'albumartistid', 'rating', 'lyrics'],
        'sort': {
          'order': 'ascending',
          'method': 'title',
          'ignorearticle': true
        }
      };
      if (filter && filter.key) {
        params.filter = {};
        params.filter[filter.key] = filter.value;
        params.sort.method = 'track';
      }
      io.send('AudioLibrary.GetSongs', params, true, 'result').then(cb);
    };

    factory.getTVShows = function(cb, limits) {
      limits = limits || {
        'start': 0,
        'end': 50
      };
      io.send('VideoLibrary.GetTVShows', {
        'limits': limits,
        'properties': ['genre', 'title', 'rating', 'art', 'playcount', 'thumbnail', 'watchedepisodes', 'episode', 'studio'],
        'sort': {
          'order': 'ascending',
          'method': 'label'
        }
      }, true, 'result').then(cb);
    };

    factory.getTVShowDetails = function(tvShowId, cb) {
      io.send('VideoLibrary.GetTVShowDetails', {
        'tvshowid': tvShowId,
        'properties': ['title', 'genre', 'rating', 'thumbnail', 'plot', 'episode',
        'studio', 'fanart', 'episodeguide', 'season', 'imdbnumber','mpaa','cast',
        'year',  'watchedepisodes'],
      }, true, 'result.tvshowdetails').then(cb);
    };

    factory.setTVShowDetails = function (updateData, cb) {
       io.send('VideoLibrary.SetTVShowDetails', updateData, true, 'result').then(cb);
    };

    factory.getSeasons = function(tvShowId, cb) {
      io.send('VideoLibrary.GetSeasons', {
        'tvshowid': tvShowId,
        'properties': ['season', 'showtitle', 'fanart', 'thumbnail', 'playcount'],
        'limits': {
          'start': 0,
          'end': 75
        },
        'sort': {
          'order': 'ascending',
          'method': 'label'
        }
      }, true, 'result.seasons').then(cb);
    };

    var episodesProperties = ['file', 'title', 'rating', 'runtime', 'season',
    'episode', 'thumbnail', 'fanart','art', 'playcount', 'resume', 'tvshowid',
    'plot'];
    factory.getEpisodes = function(tvShowId, season, cb) {
      io.send('VideoLibrary.GetEpisodes', {
        'tvshowid': tvShowId,
        'season': season,
        'properties':episodesProperties,
        'limits': {
          'start': 0,
          'end': 75
        },
        'sort': {
          'order': 'descending',
          'method': 'episode'
        }
      }, true, 'result.episodes').then(cb);
    };

    factory.getEpisodeDetails = function(episodeId, cb) {
      io.send('VideoLibrary.GetEpisodeDetails', {
        'episodeid': episodeId,
        'properties': ['title', 'plot', 'rating', 'runtime', 'thumbnail', 'art',
        'playcount', 'cast', 'season', 'tvshowid', 'streamdetails']
      }, true, 'result.episodedetails').then(cb);
    };

    factory.setEpisodeDetails = function (updateData, cb) {
       io.send('VideoLibrary.SetEpisodeDetails', updateData, true, 'result').then(cb);
    };

    factory.getRecentlyAddedEpisodes = function(cb, limits) {
      limits = limits || {
        'start': 0,
        'end': 50
      };
      io.send('VideoLibrary.GetRecentlyAddedEpisodes', {
        'properties': episodesProperties,
        'limits': limits,
        'sort': {
          'order': 'descending',
          'method': 'dateadded'
        }
      }, true, 'result').then(cb);
    };

    factory.removeEpisode = function (episodeId, cb) {
       io.send('VideoLibrary.RemoveEpisode', {'episodeid':episodeId}, true, 'result').then(cb);
    };

    factory.removeMovie = function (movieId, cb) {
       io.send('VideoLibrary.RemoveMovie',  {'movieid':movieid}, true, 'result').then(cb);
    };

    factory.removeTVShow = function (tvshowid, cb) {
       io.send('VideoLibrary.RemoveTVShow', {'tvshowid':tvshowid}, true, 'result').then(cb);
    };

    factory.scan = function (library) {
      io.send(library+'.scan');
    };

    factory.executeAddon = function (params) {
      io.send('Addons.ExecuteAddon', params);
    }

    factory.getAddonDetails = function (addonid, cb) {
      io.send('Addons.GetAddonDetails', {
        'addonid': addonid,
        'properties': ['enabled'],
      }, true, 'result').then(cb);
    }

    return factory;
  }
])
angular.module('templates.abricot', ['template/flipper/flipper.tpl.html', 'template/rating/rating.tpl.html', 'template/seekbar/seekbar.tpl.html', 'template/spinner/spinner.tpl.html', 'template/streamdetails/streamdetails.tpl.html', 'template/timepicker/timepicker.html']);

angular.module("template/flipper/flipper.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/flipper/flipper.tpl.html",
    "<div class=\"flipper\" ng-transclude ng-class=\"{flipped : flipped}\">\n" +
    "</div>");
}]);

angular.module("template/rating/rating.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/rating/rating.tpl.html",
    "<div class=\"md-circle rating\">\n" +
    "    <div class=\"value\">{{roundedValue}}</div>\n" +
    "    <i class=\"star fa fa-star left\"></i>\n" +
    "    <i class=\"star fa fa-star middle\"></i>\n" +
    "    <i class=\"star fa fa-star right\"></i>\n" +
    "</div>");
}]);

angular.module("template/seekbar/seekbar.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/seekbar/seekbar.tpl.html",
    "<div role=\"slider\" ng-class=\"{horizontal : !seekbarIsVertical, vertical : seekbarIsVertical}\">\n" +
    "    <progress class=\"progress\" value=\"0\" max=\"{{seekbarMax}}\"></progress>\n" +
    "    <button class=\"thumb\"></button>\n" +
    "</div>");
}]);

angular.module("template/spinner/spinner.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/spinner/spinner.tpl.html",
    "<div class=\"spinner-wrapper\">\n" +
    "    <div class=\"spinner\">\n" +
    "        <div class=\"bounce\"></div>\n" +
    "        <div class=\"bounce\"></div>\n" +
    "        <div class=\"bounce\"></div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("template/streamdetails/streamdetails.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/streamdetails/streamdetails.tpl.html",
    "<div class=\"stream details\">\n" +
    "    <div class=\"detail video mode\" ng-show=\"hasVideo()\">\n" +
    "        <i class=\"icon-film\"></i>\n" +
    "        {{getVideoMode()}}\n" +
    "    </div>\n" +
    "    <div class=\"detail audio channels\" ng-show=\"hasAudio()\">\n" +
    "        <i class=\"icon-volume-up\"></i>\n" +
    "        {{getAudioChannels()}}\n" +
    "    </div>\n" +
    "    <div class=\"detail audio lang\" ng-show=\"hasAudio()\">\n" +
    "        <i class=\"icon-comments-alt\"></i>\n" +
    "        {{getAudioLanguage()}}\n" +
    "    </div>\n" +
    "    <div class=\"detail audio subtitle\" ng-show=\"hasSubtitle()\">\n" +
    "        <i class=\"icon-file-text-alt\"></i>\n" +
    "        {{getSubtitles()}}\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("template/timepicker/timepicker.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/timepicker/timepicker.html",
    "<table>\n" +
    "    <tbody>\n" +
    "        <tr>\n" +
    "          <td><a ng-click=\"incrementHours()\" class=\"btn-link\"><span class=\"icon-chevron-up\"></span></a></td>\n" +
    "          <td>&nbsp;</td>\n" +
    "          <td><a ng-click=\"incrementMinutes()\" class=\"btn-link\"><span class=\"icon-chevron-up\"></span></a></td>\n" +
    "          <td ng-show=\"showMeridian\"></td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td style=\"width:50px;\" class=\"form-group\" ng-class=\"{'has-error': invalidHours}\">\n" +
    "                <input type=\"text\" ng-model=\"hours\" ng-change=\"updateHours()\" class=\"form-control text-center\" ng-mousewheel=\"incrementHours()\" ng-readonly=\"readonlyInput\" maxlength=\"2\"/>\n" +
    "            </td>\n" +
    "            <td>:</td>\n" +
    "            <td style=\"width:50px;\" class=\"form-group\" ng-class=\"{'has-error': invalidMinutes}\">\n" +
    "                <input type=\"text\" ng-model=\"minutes\" ng-change=\"updateMinutes()\" class=\"form-control text-center\" ng-readonly=\"readonlyInput\" maxlength=\"2\"/>\n" +
    "            </td>\n" +
    "            <td ng-show=\"showMeridian\"><button type=\"button\" class=\"btn btn-default text-center\" ng-click=\"toggleMeridian()\">\n" +
    "                {{meridian}}\n" +
    "            </button></td>\n" +
    "        </tr>\n" +
    "        <tr>\n" +
    "            <td><a ng-click=\"decrementHours()\" class=\"btn-link\"><span class=\"icon-chevron-down\"></span></a></td>\n" +
    "            <td>&nbsp;</td>\n" +
    "            <td><a ng-click=\"decrementMinutes()\" class=\"btn-link\"><span class=\"icon-chevron-down\"></span></a></td>\n" +
    "            <td ng-show=\"showMeridian\"></td>\n" +
    "        </tr>\n" +
    "    </tbody>\n" +
    "</table>");
}]);
