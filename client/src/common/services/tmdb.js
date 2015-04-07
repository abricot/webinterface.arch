  angular.module('services.tmdb', [])
  .factory('tmdb', ['$q', '$http', '$interpolate',
    function($q, $http, $interpolate) {
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
            return transform(value);
          })
        };
      }

      var appendTransform = function(defaults, transform) {
        defaults = angular.isArray(defaults) ? defaults : [defaults];
        return defaults.concat(transform);
      };

      var transform = function (tmdbResponse) {
        var fn = function(el){
          var transformed = {};
          for(var key in mapping) {
            if(el.hasOwnProperty(key)) {
              var transformedKey = mapping[key];
              if(angular.isObject(transformedKey)) {
                transformed[transformedKey.key] = transformedKey.transformFn(el[key]);
              } else {
                transformed[transformedKey] = el[key];
              }
            }
          }
          return transformed;
        };
        if(!angular.isArray(tmdbResponse)) {
          return fn(tmdbResponse)
        } else {
          return tmdbResponse.map(fn);
        }
      };

      var flatten = function (objects) {
        objects = objects || [];
        return objects.map(function(object) {
          return object.name;
        });
      };

      var mapping = {
        'backdrop_path' : 'fanart',
        'genres' : {
          key : 'genres',
          transformFn : flatten
        },
        'id' : 'id',
        'tvdb_id' : 'tvdbid',
        'poster_path' : 'poster',
        'name' : 'title',
        'networks' :  {
          key : 'studios',
          transformFn : flatten
        },
        'movie_results' : {
          key : 'movies',
          transformFn : transform
        },
        'seasons' : {
          key : 'seasons',
          transformFn : transform
        },
        'season_number' : 'season',
        'tv_results' : {
          key : 'tvShows',
          transformFn : transform
        },
        'tv_episode_results' : {
          key : 'tvShowEpisodes',
          transformFn : transform
        },
        'tv_season_results' : {
          key : 'tvShowSeasons',
          transformFn : transform
        },
        'episode_count' : 'episode',
        'title' : 'title',
        'vote_average' : 'rating',
        'episodes' : {
          key : 'episodes',
          transformFn : transform
        },
        'still_path':'thumbnail',
        'air_date' : 'firstaired',
        'first_air_date' : 'firstaired',
        'overview' : 'plot',
        'episode_number' : 'episode',
        'season_number' : 'season',
        'results' : {
          key : 'results',
          transformFn : transform
        }
      };

      factory.find = function (source, id) {
        var url = interpolateFn({
          action : 'find/'+id,
          apiKey : apiKey,
          parameters : '&external_source='+source
        });
        return $http(getConfig(url, 'GET'));
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

      return factory;
    }
  ]);