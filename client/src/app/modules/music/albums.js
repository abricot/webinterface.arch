angular.module('app')
.controller('MusicAlbumsCtrl', ['$scope', '$stateParams', 'storage',
  function MusicAlbumsCtrl($scope, $stateParams, storage) {
    $scope.loading = true;
    $scope.fetching = false;

    $scope.requestItemsBy = 50;
    $scope.total = Infinity;

    $scope.filter = $stateParams.filter;
    $scope.albums =[];

    var filter = null;
    if ($scope.filter) {
      $scope.filterId = parseInt($stateParams.filterId);
      filter = {
        key: $scope.filter,
        value: $scope.filterId
      };
    }

    function onSongsFromSource (result) {
      $scope.songs = result.songs;
      $scope.loading = false;
    }
    
    function onArtistFromSource (artist) {
      $scope.artist = artist;
      var songFilter = {
        key : 'artistid',
        value : $scope.albums[0].artistid[0]
      }
      $scope.xbmc.getSongs(songFilter, onSongsFromSource, {start:0, end:200});
    };

    function onAlbumsFromSource(result) {
      var albums = result ? result.albums : [];
      $scope.total = result ? result.limits.total : Infinity;
      $scope.albums = $scope.albums.concat(albums);

      if ($scope.filter) {
        $scope.xbmc.getArtistDetails(albums[0].artistid[0], onArtistFromSource);
      } else {
        $scope.loading = false;
        $scope.fetching = false;

      }
    };

    function onLoad() {
      var limits =  {
        'start' : 0,
        'end' : $scope.requestItemsBy
      };
      $scope.xbmc.getAlbums(filter, onAlbumsFromSource, limits);
    };

    if ($scope.xbmc.isConnected()) {
      onLoad();
    } else {
      $scope.xbmc.register('Websocket.OnConnected', {
        fn: onLoad,
        scope: this
      });
    }

    $scope.isPartOf = function (album) {
      return function (song) {
        return song.albumid === album.albumid;
      };
    };

    $scope.hasCover = function(album) {
      return album.thumbnail !== '';
    };

    $scope.loadMore = function () {
      if($scope.albums.length < $scope.total) {
        $scope.fetching = true;
        var limits =  {
          'start' : $scope.albums.length,
          'end' : Math.min($scope.albums.length+$scope.requestItemsBy, $scope.total)
        };
         $scope.xbmc.getAlbums(filter, onAlbumsFromSource, limits);
      }
    };

    var detail = document.querySelector('.songs-wrapper.detail');
    if(detail) {
      detail.onscroll = function () {
        if(detail.scrollTop > 300) {
          if(!detail.classList.contains('affixable')) {
            detail.classList.add('affixable');
          }
        } else {
          detail.classList.remove('affixable');
        };
      };
    }
  }
]);