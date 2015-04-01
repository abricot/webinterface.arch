angular.module('services.tmdb', [])
.factory('tmdb', ['$http', '$interpolate',
  function($http, $interpolate) {
    var apiKey = 'a76cc8ff9e26a5f688544d73c90e4807';
    var factory = {};
    var interpolateFn = $interpolate('http://api.themoviedb.org/3/{{action}}?api_key={{apiKey}}{{parameters}}');
    var httpConfig = {
      headers : {
        'Accept' : 'application/json'
      }
    };

    factory.find = function (source, id) {
      var url = interpolateFn({
        action : 'find/'+id,
        apiKey : apiKey,
        parameters : '&external_source='+source
      });
      return $http.get(url, httpConfig);
    };

    factory.similarMovie = function (id, page) {
      var url = interpolateFn({
        action : 'movie/'+id+'/similar',
        apiKey : apiKey,
        parameters : '&page='+page
      });
      return $http.get(url, httpConfig);
    };

    factory.popularTvshows = function (numberOfPage, firstAirDateGte, voteAverageGte) {

      var url = interpolateFn({
        action : 'discover/tv',
        apiKey : apiKey,
        parameters : '&first_air_date.gte='+firstAirDateGte+'&sort_by=popularity.desc&vote_average.gte='+voteAverageGte
      });
      return $http.get(url, httpConfig);
    };

     factory.tvshow = function (id) {
      var url = interpolateFn({
        action : 'tv/'+id,
        apiKey : apiKey,
        parameters : ''
      });
      return $http.get(url, httpConfig);
    };

    factory.seasons = function (id, season) {
      var url = interpolateFn({
        action : 'tv/'+id+'/season/'+season,
        apiKey : apiKey,
        parameters : ''
      });
      return $http.get(url, httpConfig);
    };

    return factory;
  }
]);