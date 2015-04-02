angular.module('filters.xbmc.trust', [])
.filter('trust', ['$sce', function ($sce) {
  return function(url) {
    return $sce.trustAsResourceUrl(url);
  };
}]);