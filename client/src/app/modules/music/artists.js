angular.module('app')
.controller('MusicArtistsCtrl', ['$scope', 'storage',
  function MusicAlbumsCtrl($scope, storage) {
    $scope.loading = true;
    $scope.fetching = false;

    $scope.requestItemsBy = 50;
    $scope.total = Infinity;
    $scope.artists = [];

    function onArtistsFromSource(result) {
       var artists = result ? result.artists : [];
      $scope.total = result ? result.limits.total : Infinity;
      $scope.artists = $scope.artists.concat(artists);
      $scope.loading = false;
      $scope.fetching = false;
    };

    function onLoad () {
      $scope.loading = true;
      var limits =  {
        'start' : 0,
        'end' : $scope.requestItemsBy
      }
      $scope.xbmc.getArtists(onArtistsFromSource, limits);
    };
    if ($scope.xbmc.isConnected()) {
      onLoad();
    } else {
      $scope.xbmc.register('Websocket.OnConnected', { fn : onLoad, scope : this});
    }

    $scope.hasCover = function (artist) {
      return artist.thumbnail !== '';
    };

    $scope.loadMore = function () {
      if($scope.artists.length < $scope.total) {
        $scope.fetching = true;
        var limits =  {
          'start' : $scope.artists.length,
          'end' : Math.min($scope.artists.length+$scope.requestItemsBy, $scope.total)
        };
         $scope.xbmc.getArtists(onArtistsFromSource, limits);
      }
    };
  }
]);