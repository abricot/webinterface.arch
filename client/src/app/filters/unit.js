angular.module('filters.unit', [])
.filter('unit', ['$filter', function ($filter) {
  return function (input) {
    var parsed, value; 
    var numFilter = $filter('number');
    if(!angular.isNumber(input)) {
      parsed = parseInt(input);
    } else {
      parsed = input;
    }
    if(!isNaN(parsed)) {
      if(parsed > 1000000) {
        value = numFilter(parsed/1000000, 1)+'m';
      } else if (parsed > 1000) {
        value = numFilter(parsed/1000, 1)+'k';
      } else {
        value = parsed;
      }
    } else {
      value = input;
    }
    return value;
  };
}]);