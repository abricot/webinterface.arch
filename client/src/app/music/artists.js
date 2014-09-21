angular.module('app')
.controller('MusicArtistsCtrl', ['$scope', 'storage',
  function MusicAlbumsCtrl($scope, storage) {
    $scope.loading = true;
    $scope.updating = true;

    function onArtistsFromCache(artists) {
      if(artists) {
        $scope.artists = artists;
        $scope.loading = false;
      }
    };

    function onArtistsFromSource(artists) {
      $scope.artists = artists;
      storage.setItem('AudioLibrary.Artists', artists);
      $scope.loading = false;
      $scope.updating = false;
    };

    var onLoad = function () {
      $scope.loading = true;
      storage.getItem('AudioLibrary.Artists', onArtistsFromCache);
      $scope.xbmc.getArtists(onArtistsFromSource);
    };
    if ($scope.xbmc.isConnected()) {
      onLoad();
    } else {
      $scope.xbmc.register('Websocket.OnConnected', { fn : onLoad, scope : this});
    }

    $scope.hasCover = function (artist) {
      return artist.thumbnail !== '';
    };
  }
]);