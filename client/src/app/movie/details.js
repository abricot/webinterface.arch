angular.module('app')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('moviedetails', {
    url: '/movie/:movieid',
    views: {
      header: {templateUrl: 'layout/headers/navigation.tpl.html', controller : 'HeaderNavController'},
      body: {
        templateUrl: 'movie/details.tpl.html',
        controller: 'MovieDetailsCtrl'
      }
    }
  });
}])
.controller('MovieDetailsCtrl', ['$scope', '$stateParams', '$location',
  function MovieDetailsCtrl($scope, $stateParams, $location, utilities) {
    $scope.movieid = parseInt($stateParams.movieid);
    $scope.loading = true;
    $scope.isCurrentlyPlaying = false;

    $scope.seeMoreActors = false;
    $scope.similars = [];
    function isCurrentlyPlaying() {
      return $scope.player.active && $scope.player.item.id === $scope.library.item.movieid;
    };

    function onMovieRetrieved (item) {
      item.type = 'movie';
      $scope.library.item = item;
      $scope.isCurrentlyPlaying = isCurrentlyPlaying();
      $scope.loading = false;
      $scope.tmdb.find('imdb_id', item.imdbnumber).then(function(result){
        var movies = result.data.movie_results;
        if(movies.length === 1) {
          $scope.tmdb.similar(movies[0].id, 1).then(function(result){
            $scope.similars = result.data.results.filter(function(similar) {
              return typeof similar.poster_path !== 'undefined' && similar.poster_path !== null;
            });
          })
        }
      });
    };
    var onLoad = function () {
      $scope.xbmc.getMovieDetails($scope.movieid, onMovieRetrieved);
    };
    if ($scope.xbmc.isConnected()) {
      onLoad();
    } else {
      $scope.xbmc.register('Websocket.OnConnected', { fn : onLoad, scope : this});
    }

    $scope.imdb = function (imdbnumber) {
      window.open('http://www.imdb.com/title/' + imdbnumber + '/', '_blank');
    };

    $scope.getActors = function () {
      return $scope.library.item.cast.filter(function(actor) {
        return actor.role !== '' && typeof actor.thumbnail !== 'undefined';
      })
    };



    $scope.getAudio = function () {
      if($scope.library.item.streamdetails.audio.length > 0) {
        return $scope.library.item.streamdetails.audio.map(function(audio) {
          return audio.language;
        }).join(', ');
      } else {
        return '-';
      }
    };

    $scope.getVideoDefinition = function () {
      if($scope.library.item.streamdetails.audio.length > 0) {
        var video = $scope.library.item.streamdetails.video[0];
        return video.width + 'x' + video.height;
      } else {
        return '-';
      }
    };

    $scope.getPosterURL = function(similar) {
      return 'https://image.tmdb.org/t/p/w185' + similar.poster_path;
    }

    $scope.$watch('player.item', function (newVal, oldVal) {
      $scope.isCurrentlyPlaying = isCurrentlyPlaying();
    });
  }
  ]);