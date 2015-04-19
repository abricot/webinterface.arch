  angular.module('services.tmdb.transform', [])
  .factory('transform', [
    function() {
      var factory = {};

      var flatten = function (objects) {
        objects = objects || [];
        return objects.map(function(object) {
          return object.name;
        });
      };

      var year = function (dateStr) {
        var parts = dateStr.split('-');
        return parseInt(parts[0], 10);
      };

      var runtime = function (runtime) {
        return runtime * 60;
      }

      factory.translate = function (tmdbResponse) {
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

      var mapping = {
        'backdrop_path' : 'fanart',
        'genres' : {
          key : 'genre',
          transformFn : flatten
        },
        'id' : 'id',
        'tvdb_id' : 'tvdbid',
        'poster_path' : 'poster',
        'name' : 'name',
        'networks' :  {
          key : 'studios',
          transformFn : flatten
        },
        'movie_results' : {
          key : 'movies',
          transformFn : factory.translate
        },
        'seasons' : {
          key : 'seasons',
          transformFn : factory.translate
        },
        'season_number' : 'season',
        'tv_results' : {
          key : 'tvShows',
          transformFn : factory.translate
        },
        'tv_episode_results' : {
          key : 'tvShowEpisodes',
          transformFn : factory.translate
        },
        'tv_season_results' : {
          key : 'tvShowSeasons',
          transformFn : factory.translate
        },
        'episode_count' : 'episode',
        'title' : 'title',
        'vote_average' : 'rating',
        'episodes' : {
          key : 'episodes',
          transformFn : factory.translate
        },
        'still_path':'thumbnail',
        'air_date' : 'firstaired',
        'first_air_date' : 'firstaired',
        'overview' : 'plot',
        'episode_number' : 'episode',
        'season_number' : 'season',
        'results' : {
          key : 'results',
          transformFn : factory.translate
        },
        'release_date' : {
          key : 'year',
          transformFn : year
        },
        'imdb_id' : 'imdbnumber',
        'cast' : {
          key : 'cast',
          transformFn : factory.translate
        },
        'profile_path' : 'thumbnail',
        'character' : 'role',
        'runtime' : {
          key : 'runtime',
          transformFn : runtime
        },
        'production_companies' : {
          key : 'studio',
          transformFn : flatten
        },
        'crew' : {
          key : 'crew',
          transformFn : factory.translate
        },
        'job' : 'job',
        'total_pages' : 'totalPages',
        'key' : 'key'
      };
      return factory;
    }
  ]);