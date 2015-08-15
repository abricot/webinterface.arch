angular.module('services.helper', ['services.storage'])
.factory('helper', ['$http', '$interpolate', 'storage',
  function($http, $interpolate, storage) {
    var playFn = $interpolate('http://{{ip}}:{{port}}/jsonrpc?request={ "jsonrpc": "2.0", "method": "Player.Open", "params" : {"item": { "file": "{{path}}" }}, "id": {{uid}}}');
    
    var xbmc, tmdb;
    var factory = {
      local : {
        movies : {},
        shows : {},
        musics : {},
      },
      foreign : {
        movies : {},
        shows : {}
      }
    };
    
    factory.setProviders = function (providers) {
      xbmc = providers.xbmc || null;
      tmdb = providers.tmdb || null;
    };

    factory.local.movies.play = function (movie) {
      xbmc.open({'movieid': movie.movieid});
    };

    factory.local.shows.play = function (episode) {
      xbmc.open({'episodeid': episode.episodeid});
    };

    factory.local.musics.play = function (key, item) {
      var data = {};
      data[key] = item[key];
      xbmc.open(data);
    };

    factory.foreign.movies.play = function (host, movie) {
      var title = movie.name || movie.title;
      if(host.videoAddon.toLowerCase().indexOf('youtube')>-1) {
        $scope.xbmc.open({'file': movie.trailer});
      } else if(host.videoAddon.toLowerCase().indexOf('genesis') > -1) {
        xbmc.executeAddon({
          addonid : 'plugin.video.genesis',
          params : 'action=movies_search'+
                   '&query='+title
        });
      } else if(host.videoAddon.toLowerCase().indexOf('pulsar') > -1) {
        var path = '/movie/'+movie.imdbnumber+'/play';
        var url = playFn({
          ip : host.ip,
          port : host.httpPort,
          path : 'plugin://'+ host.videoAddon + path,
          uid : Date.now()
        });
        $http.get(url);
      }
    };

    factory.foreign.shows.play = function (host, show, episode) {
      var tvdb =  show.ids.tvdb || show.ids.tvdbid;
      var imdb =  show.ids.imdb || show.ids.imdbnumber;
      var number = episode.number || episode.episode;
      var season = episode.season;
      var title = show.name || show.title;
      var year = episode.hasOwnProperty('firstaired') ? moment(episode.firstaired).year() : episode.year;
      var firstaired = episode.hasOwnProperty('firstaired') ?  moment(episode.firstaired) :  moment(episode.first_aired);

      if(host.videoAddon.toLowerCase().indexOf('youtube') > -1) {
        tmdb.tv.videos(tvdb, season, number).then(function(result){
            var videos = result.data.results;
            var pluginURL = 'plugin://'+videoAddon+'/?action=play_video&videoid='+videos[0].key;
            xbmc.open({file: pluginURL});
        });
      } else if(host.videoAddon.toLowerCase().indexOf('genesis') > -1) {
        xbmc.executeAddon({
          addonid : 'plugin.video.genesis',
          params : 'action=episodes2'+
                   '&episode='+number+
                   '&imdb='+ imdb.replace('tt', '')+
                   '&season='+season+
                   '&show='+title+
                   '&tvdb='+tvdb+
                   '&year='+year+
                   '&date='+firstaired.format('YYYY-MM-DD')
        });
      } else if(host.videoAddon.toLowerCase().indexOf('pulsar') > -1) {
        var path = '/show/'+ids.tvdb+'/season/'+season+'/episode/'+episode+'/play';
        var url = playFn({
          ip : host.ip,
          port : host.httpPort,
          path : 'plugin://plugin.video.pulsar' + path,
          uid : Date.now()
        })
        $http.get(url);
      }
    };

    return factory;
  }
]);