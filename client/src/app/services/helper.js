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
        xbmc.open({'file': movie.trailer});
      } else if(host.videoAddon.toLowerCase().indexOf('genesis') > -1 ||
                host.videoAddon.toLowerCase().indexOf('exodus') > -1) {
        //Mimic exodus logic for movies search, movies.py def search
        var quote_plus = function(str) {return encodeURIComponent(str).replace(/%20/gi,'+');}
        var search_link = 'http://api-v2launch.trakt.tv/search?type=movie&limit=20&page=1&query=';
        var exodusQuotedTitle = quote_plus(title);
        var params = 'action=moviePage&url='+quote_plus(search_link+exodusQuotedTitle)

        xbmc.executeAddon({
          addonid : host.videoAddon,
          params : params
        });
      } else if(host.videoAddon.toLowerCase().indexOf('pulsar') > -1 ||
                host.videoAddon.toLowerCase().indexOf('quasar') > -1 ) {
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
      var tmdb = show.ids.tmdb || show.ids.tmdbid;
      var imdb =  show.ids.imdb || show.ids.imdbnumber;
      var number = episode.number || episode.episode;
      var season = episode.season;
      var title = show.name || show.title;
      var year = episode.hasOwnProperty('firstaired') ? moment(episode.firstaired).year() : episode.year;
      var firstaired = episode.hasOwnProperty('firstaired') ?  moment(episode.firstaired) :  moment(episode.first_aired);

      if(host.videoAddon.toLowerCase().indexOf('youtube') > -1) {
        tmdb.tv.videos(show.ids.tmdbid, season, number).then(function(result){
            var videos = result.data.results;
            var pluginURL = 'plugin://'+host.videoAddon+'/?action=play_video&videoid='+videos[0].key;
            xbmc.open({file: pluginURL});
        });
      } else if(host.videoAddon.toLowerCase().indexOf('genesis') > -1 ||
                host.videoAddon.toLowerCase().indexOf('exodus') > -1 ) {

        xbmc.executeAddon({
          addonid : host.videoAddon,
          params : 'action=episodes'+
                   '&imdb='+ imdb.replace('tt', '')+
                   '&season='+season+
                   '&tmdb='+tmdb+
                   '&tvdb='+tvdb+
                   '&tvshowtitle='+title+
                   '&year='+year
        });
      } else if(host.videoAddon.toLowerCase().indexOf('pulsar') > -1 ||
                host.videoAddon.toLowerCase().indexOf('quasar') > -1 ) {
        var path = '/show/'+tvdb+'/season/'+season+'/episode/'+number+'/play';
        var url = playFn({
          ip : host.ip,
          port : host.httpPort,
          path : 'plugin://'+ host.videoAddon + path,
          uid : Date.now()
        })
        $http.get(url);
      }
    };

    return factory;
  }
]);