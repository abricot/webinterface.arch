angular.module('filters.xbmc.thumb', [])
.filter('thumb', function () {
  return function (input) {
    var defaultValue = '';
    if (input) {
      if (input['album.thumb']) {
        return  input['album.thumb'];
      }
      if (input['tvshow.poster']) {
        return  input['tvshow.poster'];
      }
      if (input.poster) {
        return  input.poster;
      }
      if (input.thumb) {
        return input.thumb;
      }
    }
    return defaultValue;
  };
});