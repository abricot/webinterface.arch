angular.module('app')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('hosts', {
    url: '/hosts',
    views: {
      header: { templateUrl: 'layout/headers/basic.tpl.html'},
      body: {templateUrl: 'settings/hosts.tpl.html', controller: 'HostsCtrl'}
    }
  });
}])
.controller('HostsCtrl', ['$scope', 'storage',
  function HostsCtrl($scope, storage) {
    $scope.hasSelected = false;
    $scope.selected = null;

    $scope.setAsDefault = function (host) {
      $scope.xbmc.disconnect();
      $scope.xbmc.connect(host.ip, host.port);
      var filterDefault =  function (el) {
        return el.default;
      };
      var filtered = $scope.hosts.filter(filterDefault);
      filtered.forEach(function(el) {
        el.default=false;
      });
      host.default = true;
      storage.setItem('hosts', $scope.hosts);
    };
  }
]);