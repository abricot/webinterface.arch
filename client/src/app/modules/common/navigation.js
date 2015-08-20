angular.module('app')
.controller('HeaderNavController', ['$scope', '$location', '$filter',
  function ($scope, $location, $filter) {
    $scope.showWizard = false;
    $scope.query = '';
    $scope.isOpen = false;
    $scope.medias = [{
      hash: '/movies/recents',
      label: 'Movies',
      matchRegExp : /movie.*$/
    }, {
      hash: '/tvshows/recents',
      label: 'TV Shows',
      matchRegExp : /.*show.*$/
    }, {
      hash: '/musics/artists/all',
      label: 'Musics',
      matchRegExp : /music.*$/
    }, {
      hash: '/settings',
      label: 'Settings',
      matchRegExp : /settings.*$/
    }];

    $scope.isCurrent = function (matchRegExp) {
      return $location.path().match(matchRegExp) !== null;
    };

    $scope.open =  function () {
      $scope.isOpen = !$scope.isOpen;
      document.querySelector('header nav .search input').focus();
    }

    $scope.search = function () {
      $scope.go('/search/'+$scope.query);
    };

    $scope.toggleWizard = function () {
      $scope.showWizard = !$scope.showWizard;
    };

    $scope.scan = function() {
      var hash = window.location.hash;
      if(hash.indexOf('movies')>-1 || hash.indexOf('tvshows') > -1) {
        $scope.xbmc.scan('VideoLibrary');
      } else if (hash.indexOf('musics')>-1 ) {
        $scope.xbmc.scan('AudioLibrary');
      }
    };
  }
]);
