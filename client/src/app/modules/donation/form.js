angular.module('app')
.controller('DonationFormCtrl', ['$scope',
  function DonationFormCtrl ($scope) {
    $scope.donation = {
      amount : 5,
      currency : {value : 'USD', label : 'US Dollar'},
      currencies : [
        {value : 'USD', label : 'US Dollar'},
        {value : 'EUR', label : 'Euro'},
        {value : 'GBP', label : 'British Pound'},
        {value : 'CAD', label : 'Canadian Dollar'},
        {value : 'AUD', label : 'Australian Dollar'},
        {value : 'JPY', label : 'Japanese Yen'}
      ]
    }
  }
]);
