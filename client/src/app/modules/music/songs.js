angular.module('app')
.controller('MusicSongsCtrl', ['$scope', '$rootScope', '$stateParams', '$filter', 'storage',
  function MusicSongsCtrl($scope, $rootScope, $stateParams, $filter, storage) {
    $scope.loading = true;
    $scope.fetching = false;

    $scope.requestItemsBy = 75;
    $scope.total = Infinity;

    $scope.filter = $stateParams.filter;
    $scope.album = null;
    $scope.songs = [];

    var filter = null;
    if ($scope.filter) {
      filter = {key : $scope.filter, value : parseInt($stateParams.filterId)}
    }

    function onSongsFromSource (result) {
      var songs = result ? result.songs : [];
      $scope.total = result ? result.limits.total : Infinity;
      $scope.songs = $scope.songs.concat(songs);
      if(filter !== null) {
        $scope.xbmc.getAlbumDetails(filter.value, onAlbumRetrieved);
      } else {
        $scope.loading = false;
        $scope.fetching = false;
      }
    };

    function onAlbumRetrieved (album) {
      $scope.album = album;
      $scope.loading = false;
    };

    function onLoad() {
      var limits =  {
        'start' : 0,
        'end' : $scope.requestItemsBy
      }
      $scope.xbmc.getSongs(filter, onSongsFromSource, limits);
    };

    if ($scope.xbmc.isConnected()) {
      onLoad();
    } else {
      $scope.xbmc.register('Websocket.OnConnected', { fn : onLoad, scope : this});
    }

    $scope.getCover = function (song) {
      var assetFilter = $filter('asset');
      var hasCover = typeof $scope.filter !== 'undefined' && song && song.thumbnail !== '';
      if (hasCover) {
        return assetFilter(song.thumbnail, $scope.host);
      } else {
        return '';
      }
    };

    $scope.isFiltered = function () {
      return typeof $scope.filter !== 'undefined';
    };

    $scope.loadMore = function () {
      if($scope.songs.length < $scope.total) {
        $scope.fetching = true;
        var limits =  {
          'start' : $scope.songs.length,
          'end' : Math.min($scope.songs.length+$scope.requestItemsBy, $scope.total)
        };
         $scope.xbmc.getSongs(filter, onSongsFromSource, limits);
      }
    };
  }
]);