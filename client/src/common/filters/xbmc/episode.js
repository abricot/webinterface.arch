angular.module('filters.xbmc.episode', [])
.filter('episode', function () {
  return function (input, season) {
    var episode = parseInt(input);
    if (season && episode && !isNaN(episode)) {
      return 'S' + (season < 10 ? '0' + season : season) + 'E' + (episode < 10 ? '0' + episode : episode);
    } else {
      return '';
    }
  };
});