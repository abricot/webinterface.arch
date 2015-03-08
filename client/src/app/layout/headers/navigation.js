angular.module('app')
.controller('HeaderNavController', ['$scope', '$location', '$filter',
  function ($scope, $location, $filter) {
    $scope.medias = [{
      hash: '/movies',
      icon: 'icon-film',
      label: 'Movies'
    }, {
      hash: '/tvshows',
      icon: 'icon-facetime-video',
      label: 'TV Shows'
    }, {
      hash: '/musics/artists',
      icon: 'icon-music',
      label: 'Musics'
    }];

    $scope.isCurrent = function (hash) {
      return hash === $location.path();
    };
  }
]);
