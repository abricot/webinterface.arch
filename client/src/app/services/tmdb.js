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
      }

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

      factory.tv.externalIDs = function (id) {
        var url = interpolateFn({
          action : 'tv/'+id+'/external_ids',
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