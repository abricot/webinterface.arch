angular.module('app')
.controller('HeaderNavController', ['$scope', '$location', '$filter',
  function ($scope, $location, $filter) {
    $scope.medias = [{
      hash: '/movies/recents',
      icon: 'icon-film',
      label: 'Movies',
      matchRegExp : /movie.*$/
    }, {
      hash: '/tvshows/recents',
      icon: 'icon-facetime-video',
      label: 'TV Shows',
      matchRegExp : /tvshow.*$/
    }, {
      hash: '/musics/artists/all',
      icon: 'icon-music',
      label: 'Musics',
      matchRegExp : /music.*$/
    }];

    $scope.isCurrent = function (matchRegExp) {
      return $location.path().match(matchRegExp) !== null;
    };
  }
]);
