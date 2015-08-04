angular.module('app')
.controller('ShowsCalendarCtrl', ['$scope', '$filter',
  function ShowsCalendarCtrl($scope, $filter) {
    var beginOfMonth = moment().startOf('month');
    var current = beginOfMonth.month();
    $scope.dates = [];
    while(current === beginOfMonth.month()) {
      $scope.dates.push(moment(beginOfMonth));
      beginOfMonth.add(1, 'd');
    }
  }
]);
