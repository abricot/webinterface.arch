angular.module('services.xbmc', ['services.websocket'])
    .factory('xbmc', ['$rootScope', '$q', '$parse', '$interval', 'websocket',
        function($rootScope, $q, $parse, $interval, websocket) {
            // We return this object to anything injecting our service
            var factory = {};
            var resolved = false;
            var callbacks = {};
            var currentCallbackId = 0;
            var notifications = {};

            var activePlayer = -1;
            var activePlaylist = -1;
            var volume = 0;

            var timeout = 60000;

            // This creates a new callback ID for a request
            function getCallbackId() {
                currentCallbackId += 1;
                if (currentCallbackId > 10000) {
                    currentCallbackId = 0;
                }
                return currentCallbackId;
            }

            function getDefer(id, method, pathExpr) {
                var defer = $q.defer();
                callbacks[id] = {
                    timestamp: Date.now(),
                    cb: defer,
                    parseExpr: pathExpr,
                    method: method
                };
                return defer;
            }

            function onConnected() {
                websocket.subscribe(onMessage.bind(this));
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
                    console.log(event.data);
                    var data = JSON.parse(event.data);
                    if (callbacks.hasOwnProperty(data.id)) {
                        var cb = callbacks[data.id];
                        var obj = data;
                        if (cb.hasOwnProperty('parseExpr')) {
                            var getter = $parse(cb.parseExpr);
                            obj = getter(data);
                        }
                        $rootScope.$apply(callbacks[data.id].cb.resolve(obj));
                        delete callbacks[data.id];
                    } else if (notifications[data.method] && notifications[data.method].length > 0) {
                        for (var i = 0; i < notifications[data.method].length; i++) {
                            var cb = notifications[data.method][i];
                            $rootScope.$apply(cb.fn.call(cb.scope, data));
                        }
                    }
                }
            };

            function send(method, params, shouldDefer, pathExpr) {
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
                websocket.send(request);
                return shouldDefer ? defer.promise : 0;
            };


            factory.isConnected = function() {
                return websocket.isConnected();
            }

            factory.register = function(method, callback) {
                notifications[method] = notifications[method] || [];
                notifications[method].push(callback);
            }

            factory.unregister = function(method, callback) {
                notifications[method] = notifications[method] || [];
                var indexOf = notifications[method].indexOf(callback);
                if (indexOf > -1) {
                    notifications[method] = notifications[method].splice(indexOf, 1);
                }
            }

            factory.connect = function(url, port) {
                websocket.connect('ws://' + url + ':' + port + '/jsonrpc', onConnected, onDiconnected);
            }

            var canceljob = function() {
                angular.forEach(callbacks, function(callback, key) {
                    var now = Date.now();
                    if (now - callback.timestamp > timeout) {
                        callback.cb.reject();
                        delete callbacks[key];
                    }
                });
            };

            $interval(canceljob, 1000)

            factory.up = function() {
                send('Input.Up');
            };
            factory.down = function() {
                send('Input.Down');
            };
            factory.left = function() {
                send('Input.Left');
            };
            factory.right = function() {
                send('Input.Right');
            };
            factory.select = function() {
                send('Input.Select');
            };
            factory.back = function() {
                send('Input.Back');
            };
            factory.contextmenu = function() {
                send('Input.ContextMenu');
            };
            factory.info = function() {
                send('Input.Info');
            };
            factory.home = function() {
                send('Input.Home');
            };
            factory.sendText = function (textToSend) {
                send('Input.SendText', {'text' : textToSend});
            }
            factory.showOSD = function () {
                send('Input.ShowOSD');
            };

            factory.getActivePlayers = function(cb) {
                send('Player.GetActivePlayers', null, true, 'result').then(cb);
            };

            factory.setActivePlayer = function(playerId) {
                activePlayer = playerId;
            }

            factory.setActivePlaylist = function(playlistId) {
                activePlaylist = playlistId;
            }

            factory.getPlayerItem = function(cb, playerId) {
                playerId = playerId || activePlayer;
                send('Player.GetItem', {
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
                send('Player.GetProperties', {
                    'properties': ['percentage', 'time', 'totaltime',
                        'speed', 'playlistid',
                        'currentsubtitle', 'subtitles',
                        'audiostreams', 'currentaudiostream', 'type'
                    ],
                    'playerid': activePlayer
                }, true, 'result').then(cb);
            };

            factory.goTo = function(index) {
                send('Player.GoTo', {
                    'playerid': activePlayer,
                    'to': index
                });
            };

            factory.next = function() {
                send('Player.GoTo', {
                    'playerid': activePlayer,
                    'to': 'next'
                });
            };

            factory.open = function(item) {
                send('Player.Open', {
                    'item': item
                });
            };

            factory.previous = function() {
                send('Player.GoTo', {
                    'playerid': activePlayer,
                    'to': 'previous'
                });
            };

            factory.togglePlay = function() {
                send('Player.PlayPause', {
                    'playerid': activePlayer
                });
            };

            factory.seek = function(newValue) {
                send('Player.Seek', {
                    'playerid': activePlayer,
                    'value': newValue
                });
            };

            factory.setAudioStream = function(audioStream) {
                send('Player.SetAudioStream', {
                    'playerid': activePlayer,
                    'stream': audioStream
                });
            };

            factory.setSubtitle = function(subtitle) {
                send('Player.SetSubtitle', {
                    'playerid': activePlayer,
                    'subtitle': subtitle,
                    'enable': true
                });
            };

            factory.setSpeed = function(speed) {
                send('Player.SetSpeed', {
                    'playerid': activePlayer,
                    'speed': speed
                });
            };

            factory.stop = function() {
                send('Player.Stop', {
                    'playerid': activePlayer
                });
            };

            (function getVolume(cb) {
                send('Application.GetProperties', {
                    'properties': ['volume']
                }, true, 'result.volume').then(function(value) {
                    volume = value;
                });
            })();

            factory.increaseVolume = function() {
                volume = Math.min(volume + 1, 100);
                send('Application.SetVolume', {
                    'volume': volume
                });
            };
            factory.decreaseVolume = function() {
                volume = Math.max(volume - 1, 0);
                send('Application.SetVolume', {
                    'volume':volume
                });
            };
            factory.mute = function() {
                send('Application.SetMute', {
                    'mute': 'toggle'
                });
            };

            factory.shutdown = function() {
                send('System.Shutdown');
            };

            factory.activateWindow = function(params) {
                send('GUI.ActivateWindow', params);
            };

            factory.getPlaylistItems = function(cb) {
                send('Playlist.GetItems', {
                    'playlistid': activePlaylist,
                    'properties': ['title', 'art', 'duration', 'runtime', 'thumbnail']
                }, true, 'result.items').then(cb);
            };

            factory.queue = function(item) {
                if (activePlaylist > -1) {
                    send('Playlist.Add', {
                        'playlistid': activePlaylist,
                        'item': item
                    });
                }
            };

            factory.getMovies = function(cb) {
                send('VideoLibrary.GetMovies', {
                    'limits': {
                        'start': 0,
                        'end': 75
                    },
                    'properties': ['title', 'genre', 'rating', 'thumbnail', 'runtime', 'playcount', 'streamdetails'],
                    'sort': {
                        'order': 'ascending',
                        'method': 'label',
                        'ignorearticle': true
                    }
                }, true, 'result.movies').then(cb);
            };

            factory.getMovieDetails = function(movieId, cb) {
                send('VideoLibrary.GetMovieDetails', {
                    'properties': ['title', 'genre', 'rating', 'thumbnail', 'plot',
                        'studio', 'director', 'fanart', 'runtime', 'trailer', 'imdbnumber'
                    ],
                    'movieid': movieId
                }, true, 'result.moviedetails').then(cb);

            };

            factory.getAlbums = function(filter, cb) {
                var params = {
                    'limits': {
                        'start': 0,
                        'end': 100
                    },
                    'properties': ['title', 'artist', 'thumbnail', 'year', 'genre'],
                    'sort': {
                        'order': 'ascending',
                        'method': 'label',
                        'ignorearticle': true
                    },
                };
                if (filter && filter.key) {
                    params.filter = {};
                    params.filter[filter.key] = filter.value;
                }
                send('AudioLibrary.GetAlbums', params, true, 'result.albums').then(cb);
            };

            factory.getArtists = function(cb) {
                send('AudioLibrary.GetArtists', {
                    'limits': {
                        'start': 0,
                        'end': 100
                    },
                    'properties': ['genre', 'thumbnail'],
                    'sort': {
                        'order': 'ascending',
                        'method': 'label',
                        'ignorearticle': true
                    }
                }, true, 'result.artists').then(cb);

            };

            factory.getSongs = function(filter, cb) {
                var params = {
                    'limits': {
                        'start': 0,
                        'end': 500
                    },
                    'properties': ['title', 'artist', 'album', 'albumid', 'thumbnail', 'duration', 'track', 'year'],
                    'sort': {
                        'order': 'ascending',
                        'method': 'label',
                        'ignorearticle': true
                    }
                };
                if (filter && filter.key) {
                    params.filter = {};
                    params.filter[filter.key] = filter.value;
                    params.sort.method = 'track';
                }
                send('AudioLibrary.GetSongs', params, true, 'result.songs').then(cb);
            };

            factory.getTVShows = function(cb) {
                send('VideoLibrary.GetTVShows', {
                    'limits': {
                        'start': 0,
                        'end': 75
                    },
                    'properties': ['genre', 'title', 'rating', 'art', 'playcount'],
                    'sort': {
                        'order': 'ascending',
                        'method': 'label'
                    }
                }, true, 'result.tvshows').then(cb);
            };
            factory.getSeasons = function(tvShowId, cb) {
                send('VideoLibrary.GetSeasons', {
                    'tvshowid': tvShowId,
                    'properties': ['season', 'showtitle', 'fanart', 'thumbnail'],
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
            factory.getEpisodes = function(tvShowId, season, cb) {
                send('VideoLibrary.GetEpisodes', {
                    'tvshowid': tvShowId,
                    'season': season,
                    'properties': ['title', 'rating', 'firstaired', 'runtime', 'season', 'episode', 'thumbnail', 'art'],
                    'limits': {
                        'start': 0,
                        'end': 75
                    },
                    'sort': {
                        'order': 'ascending',
                        'method': 'label'
                    }
                }, true, 'result.episodes').then(cb);
            };
            factory.getEpisodeDetails = function(episodeId, cb) {
                send('VideoLibrary.GetEpisodeDetails', {
                    'episodeid': episodeId,
                    'properties': ['title', 'plot', 'rating', 'firstaired', 'runtime', 'thumbnail', 'art']
                }, true, 'result.episodedetails').then(cb);
            };

            return factory;
        }
    ])