angular.module('filters.xbmc.fallback', [])
.filter('fallback', function () {
  return function (input, path) {
    path = path || 'img/blank.gif';
    if (input === '') {
      return path;
    }
    return input;
  };
});