angular.module('filters.xbmc.time', [])
.filter('time', function () {
  return function (input) {
    if (typeof input === 'number') {
      var d = new Date();
      d.setHours(0);
      d.setMinutes(0);
      d.setSeconds(0);
      return new Date(d.getTime() + input * 1000);
    }
    if (typeof input === 'object') {
      var seconds = 0;
      seconds += input.hours * 60 * 60;
      seconds += input.minutes * 60;
      seconds += input.seconds;
      return seconds;
    }
  };
});