angular.module('services.oauth', [])
.factory('oauth', ['$q', '$http',
  function($q, $http) {
    var client = {
      id : '1fdcdbccbaf950016ced2896817e8752cfa77250c7720b58b493a12505a49de5',
      secret : '14eebc65a444d9e4336238d9643c76ba31f34a19d9a6e03cb0e3219b42102886'
    };
    var factory = {};
    factory.getToken = function (code) {
      $http({
        method : 'POST',
        url : 'https://api-v2launch.trakt.tv/oauth/token',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        params : {
          'code' : code,
          'client_id': client.id,
          'client_secret': client.secret,
          'redirect_uri': 'urn:ietf:wg:oauth:2.0:oob',
          'grant_type': 'authorization_code'
        }
      }).
      success(function(data, status, headers, config) {
        debugger;
      }).
      error(function(data, status, headers, config) {
        debugger;
      });
    };
    return factory;
  }
]);