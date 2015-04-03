angular.module('services.tmdb', [])
.factory('tmdb', ['$q', '$http', '$interpolate',
  function($q, $http, $interpolate) {
    var apiKey = 'a76cc8ff9e26a5f688544d73c90e4807';
    var factory = {};
    var interpolateFn = $interpolate('http://api.themoviedb.org/3/{{action}}?api_key={{apiKey}}{{parameters}}');
    var httpConfig = {
      headers : {
        'Accept' : 'application/json'
      }
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
      'poster_path' : 'poster',
      'name' : 'label',
      'networks' :  {
        key : 'studios',
        transformFn : flatten
      },
      'seasons' : {
        key : 'seasons',
        transformFn : transform
      },
      'season_number' : 'season',
      'episode_count' : 'episode',
      'title' : 'title',
      'vote_average' : 'rating'
    };

    factory.find = function (source, id) {
      var defer = $q.defer();
      var url = interpolateFn({
        action : 'find/'+id,
        apiKey : apiKey,
        parameters : '&external_source='+source
      });

      $http.get(url, httpConfig).then(function(result) {
        var data = result.data;
        defer.resolve({
          movies : transform(data.movie_results),
          persons : transform(data.person_results),
          tvShows : transform(data.tv_results),
          tvShowEpisodes : transform(data.tv_episode_results),
          tvShowSeasons : transform(data.tv_season_results)
        });
      });
      return defer.promise;
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
        chain.push($http.get(url, httpConfig));
      }
      return $q.all(chain);
    };

    factory.tvshow = function (id) {
      var defer = $q.defer();
      var url = interpolateFn({
        action : 'tv/'+id,
        apiKey : apiKey,
        parameters : ''
      });
      $http.get(url, httpConfig).then(function(result) {
        var data = result.data;
        defer.resolve(transform(result.data));
      });
      return defer.promise;
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