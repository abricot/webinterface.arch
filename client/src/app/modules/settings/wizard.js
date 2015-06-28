angular.module('app')
.controller('WizardCtrl', ['$scope', 'storage', '$stateParams',
  function WizardCtrl($scope, storage, $stateParams) {
    $scope.host = {
      ip: '',
      port: '9090',
      httpPort : '8080',
      displayName: '',
      default : false,
      username : 'kodi',
      password : '',
      videoAddon : 'plugin.video.youtube'
    };

    $scope.save = function () {
      if(this.wizard.$valid) {
        $scope.hosts.splice(0,1,$scope.host);
        storage.setItem('hosts', $scope.hosts);
        $scope.initialize($scope.host);
      }
    };

    $scope.$watch('hosts', function(newVal, oldVal) {
      var filterDefault = function(el) {
        return el.default;
      }
      var filtered = $scope.hosts.filter(filterDefault);
      if(filtered.length ===1) {
        angular.copy(filtered[0], $scope.host);
      }
    });
  }
]);