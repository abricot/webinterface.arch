angular.module('services.trakt', [])
.factory('trakt', ['$q', '$http', '$filter', '$interpolate', 'storage',
  function($q, $http, $filter, $interpolate, storage) {
    var $date = $filter('date');
    var factory = {
      calendar : {}
    };
    var authentication = null;
    var client = {
      id : '1fdcdbccbaf950016ced2896817e8752cfa77250c7720b58b493a12505a49de5',
      secret : '14eebc65a444d9e4336238d9643c76ba31f34a19d9a6e03cb0e3219b42102886'
    };
    var headers = {
        'Content-Type' : 'application/json',
        'trakt-api-version' : 2,
        'trakt-api-key' : client.id
      };

    var interpolateFn = $interpolate('https://api-v2launch.trakt.tv/{{action}}');
      

    var getConfig = function (url, method, data) {
      headers['X-Proxy-URL'] = url;
      var config = {
        url: 'http://ec2-52-19-7-166.eu-west-1.compute.amazonaws.com/proxy.php',
        method: method,
        headers : headers
      };
      if(data) {
        config.data = data;
      }
      return config;
    }

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
        }
        defer.resolve(data);
      });
      return defer.promise;;
    };

    factory.calendar.myShows = function (startDate, days) {
      var action = 'calendars/my/shows/'+$date(startDate, 'yyyy-MM-dd') + '/'+days;
      var url = interpolateFn({
          action : action
        });
        return $http(getConfig(url, 'GET'));
    };

    storage.getItem('trakt-authentication').then(function(data) {
      if(data) {
        authentication = data;
        headers.Authorization = 'Bearer '+data.access_token;
      };
    });

    return factory;
  }
]);