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
      seasons : {}
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