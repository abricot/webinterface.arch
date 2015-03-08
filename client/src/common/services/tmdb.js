angular.module('services.tmdb', [])
.factory('tmdb', ['$http', '$interpolate',
  function($http, $interpolate) {
    var factory = {};
    var interpolateFn = $interpolate('http://api.themoviedb.org/3/{{action}}{{parameters}}');
    var httpConfig = {
      headers : {
        'Accept' : 'application/json'
      }
    };

    factory.find = function (imdbNumer) {
      var url = interpolateFn({
        action : 'find/'+imdbNumer,
        parameters : '?api_key=a76cc8ff9e26a5f688544d73c90e4807&external_source=imdb_id'
      });
      return $http.get(url, httpConfig);
    };

    factory.similar = function (id, page) {
      var url = interpolateFn({
        action : 'movie/'+id+'/similar',
        parameters : '?api_key=a76cc8ff9e26a5f688544d73c90e4807&page='+page
      });
      return $http.get(url, httpConfig);
    };

    return factory;
  }
]);