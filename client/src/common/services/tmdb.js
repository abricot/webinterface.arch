  angular.module('services.tmdb', [
    'services.tmdb.transform'
    ])
  .factory('tmdb', ['$q', '$http', '$interpolate', 'transform',
    function($q, $http, $interpolate, transform) {
      var apiKey = 'a76cc8ff9e26a5f688544d73c90e4807';
      var factory = {};
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

      factory.getEpisodes = function(id) {
        var defer = $q.defer();
        factory.tvshow(id).then(function(result) {
          var tv = result.data;
          var latestSeason = tv.seasons[tv.seasons.length-1];
          factory.seasons(tv.id, latestSeason.season).then(function(result){
            defer.resolve(result);
          });
        });
        return defer.promise;
      };

       factory.movie = function (id) {
        var url = interpolateFn({
          action : 'movie/'+id,
          apiKey : apiKey,
          parameters : ''
        });
        return $http(getConfig(url, 'GET'));
      };

      factory.popularTvshows = function (numberOfPage, firstAirDateGte, voteAverageGte) {
        var chain = [];
        for (var i = 0; i <numberOfPage; i++) {
           var url = interpolateFn({
            action : 'discover/tv',
            apiKey : apiKey,
            parameters : '&page='+(i+1)+'&first_air_date.gte='+firstAirDateGte+'&sort_by=popularity.desc&vote_average.gte='+voteAverageGte
          });
          chain.push($http(getConfig(url, 'GET')));
        }
        return $q.all(chain);
      };

      factory.popularMovies = function (numberOfPage, primaryReleaseDate, voteAverageGte) {
        var chain = [];
        for (var i = 0; i <numberOfPage; i++) {
           var url = interpolateFn({
            action : 'discover/movie',
            apiKey : apiKey,
            parameters : '&page='+(i+1)+'&primary_release_date.gte='+primaryReleaseDate+'&sort_by=popularity.desc&vote_average.gte='+voteAverageGte
          });
          chain.push($http(getConfig(url, 'GET')));
        }
        return $q.all(chain);
      };

      factory.tvshow = function (id) {
        var url = interpolateFn({
          action : 'tv/'+id,
          apiKey : apiKey,
          parameters : ''
        });
        return $http(getConfig(url, 'GET'));
      };

      factory.tvshowExternalIDs = function (id) {
        var url = interpolateFn({
          action : 'tv/'+id+'/external_ids',
          apiKey : apiKey,
          parameters : ''
        });
        return $http(getConfig(url, 'GET'));
      }

      factory.seasons = function (id, season) {
        var url = interpolateFn({
          action : 'tv/'+id+'/season/'+season,
          apiKey : apiKey,
          parameters : ''
        });
        return $http(getConfig(url, 'GET'));
      };

      factory.similarMovie = function (id, page) {
        var url = interpolateFn({
          action : 'movie/'+id+'/similar',
          apiKey : apiKey,
          parameters : '&page='+page
        });
        return $http(getConfig(url, 'GET'));
      };

      return factory;
    }
  ]);