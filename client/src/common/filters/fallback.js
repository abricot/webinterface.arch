angular.module('filters.fallback', [])
.filter('fallback', function () {
  return function (input, fallback) {
    fallback = fallback || '';
    if (typeof input === 'undefined' || input === null || input === '') {
      return fallback;
    }
    return input;
  };
});