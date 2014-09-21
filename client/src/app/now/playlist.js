angular.module('app')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('playlist', {
    url: '/now/playlist',
    views: {
      header: {templateUrl: 'layout/headers/basic.tpl.html'},
      body: {
        templateUrl: 'now/playlist.tpl.html',
        controller: 'NowPlaylistCtrl'
      }
    }
  });
}])
.controller('NowPlaylistCtrl', ['$scope',
  function NowPlaylistCtrl($scope) {
    $scope.loading = true;

    var getItems = function () {
      $scope.xbmc.getPlaylistItems(function (items) {
        $scope.items = items;
        $scope.loading = false;
      });
    };

    var onLoad = function () {
      if ($scope.playlist > -1) {
        getItems();
      } else {
        $scope.go('/remote');
      }
    };
    if ($scope.xbmc.isConnected()) {
      onLoad();
    } else {
      $scope.xbmc.register('Websocket.OnConnected', { fn: onLoad, scope: this});
    }

    var onPlaylistAdd = function (obj) {
      $scope.loading = true;
      getItems();
    };

    var onPlaylistClear = function () {
      $scope.go('/remote');
    };

    var onPlaylistRemove = function (obj) {
      var data = obj.params.data;
      if (!$scope.loading && $scope.playlist === data.playlistid && typeof $scope.items !== 'undefined') {
        $scope.items.splice(data.position);
      }
    };

    $scope.xbmc.register('Playlist.OnAdd', { fn: onPlaylistAdd, scope: this});
    $scope.xbmc.register('Playlist.OnClear', { fn: onPlaylistClear, scope: this});
    $scope.xbmc.register('Playlist.OnRemove', { fn: onPlaylistRemove, scope: this});

    $scope.isPlaying = function (id) {
      return  $scope.player.item.id === id;
    };
  }
]);
