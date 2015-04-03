angular.module('filters.tmdb.image', [])
.filter('tmdbImage', function () {
  return function (subpath, size) {
    size = size || 'original';
    var url = 'http://image.tmdb.org/t/p/'+size;
    if(typeof subpath  === 'undefined' || subpath === null) {
      return '';
    }
    return url + subpath;
  };
});