angular.module('services.xbmc', ['services.io'])
.factory('xbmc', [ 'io',
  function(io) {
    // We return this object to anything injecting our service
    var factory = {};
    var activePlayer = -1;
    var activePlaylist = -1;
    var volume = 0;


    factory.connect = function(url, port) {
      io.connect(url, port);
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
      io.send('Input.sendText', {'text' : textToSend});
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
      io.send('Player.SetAudioStream', {
        'playerid': activePlayer,
        'stream': audioStream
      });
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

    factory.queue = function(item) {
      if (activePlaylist > -1) {
        io.send('Playlist.Add', {
          'playlistid': activePlaylist,
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
        'writer', 'year','plotoutline', 'tagline', 'art', 'showlink'
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
        'properties': ['formed', 'description', 'genre', 'thumbnail', 'fanart']
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
        'year' ],
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

    return factory;
  }
])