angular.module('app')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('music', {
    url: '/musics',
    views: {
      header: {templateUrl: 'modules/common/navigation.tpl.html', controller : 'HeaderNavController'},
      body: {
        templateUrl: 'modules/music/musics.tpl.html',
        controller: 'MusicCtrl'
      }
    }
  }).state('music.albums', { 
    url : '/albums/all',
    templateUrl: 'modules/music/albums.tpl.html',
    controller: 'MusicAlbumsCtrl'
  }).state('music.filteredAlbums', { 
    url: '/albums/:filter/:filterId',
    templateUrl: 'modules/music/artist.albums.tpl.html',
    controller: 'MusicAlbumsCtrl'
  }).state('music.artists', {
    url : '/artists/all',
    templateUrl: 'modules/music/artists.tpl.html',
    controller: 'MusicArtistsCtrl'
  }).state('music.songs', {
    url : '/songs/all',
    templateUrl: 'modules/music/songs.tpl.html',
    controller: 'MusicSongsCtrl'
  }).state('music.filteredSongs', {
    url : '/songs/:filter/:filterId',
    templateUrl: 'modules/music/songs.tpl.html',
    controller: 'MusicSongsCtrl'
  });
}])
.controller('MusicCtrl', ['$scope',
  function MusicCtrl($scope, $stateParams) {
    $scope.isSelected = function (regExpStr) {
      var regExp = new RegExp(regExpStr, 'gi');
      return $scope.$state.current.name.match(regExp) !== null;
    }
  }
]);