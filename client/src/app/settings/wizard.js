angular.module('app')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('settings', {
    url: '/host/wizard',
    views: {
      header: { templateUrl: 'layout/headers/backable.tpl.html'},
      body: {templateUrl: 'settings/wizard.tpl.html', controller: 'WizardCtrl'}
    }
  }).state('filteredHost', {
    url: '/host/:hostIndex',
    views: {
      header: {templateUrl: 'layout/headers/backable.tpl.html'},
      body: {templateUrl: 'settings/wizard.tpl.html', controller: 'WizardCtrl'}
    }
  });
}])
.controller('WizardCtrl', ['$scope', 'storage', '$stateParams',
  function WizardCtrl($scope, storage, $stateParams) {
    $scope.host = {
      ip: '',
      port: '9090',
      httpPort : '8080',
      displayName: '',
      default : false
    };
    $scope.hostIndex = null;
    if(typeof $stateParams.hostIndex !== 'undefined') {
      $scope.hostIndex = parseInt($stateParams.hostIndex);
      $scope.host = $scope.hosts[$scope.hostIndex];
    }

    $scope.save = function () {
      if($scope.wizard.$valid) {
        if($scope.hosts.length === 0) {
          $scope.host.default = true;
        }
        if($scope.hostIndex !== null) {
          $scope.hosts[$scope.hostIndex] = $scope.host;
        } else {
          $scope.hosts.push($scope.host);
        }
        storage.setItem('hosts', $scope.hosts);
        if($scope.host.default) {
          $scope.xbmc.connect($scope.host.ip, $scope.host.port);
        }
        if($scope.hosts.length > 1) {
          $scope.go('/hosts');
        } else {
          $scope.go('/');
        }
      }
    };

    $scope.delete = function () {
      if($scope.hostIndex !== null) {
        var spliced = $scope.hosts.splice($scope.hostIndex, 1);
        var splicedHost = spliced[0];
        if(splicedHost.default) {
          var firstHost = $scope.hosts[0];
          firstHost.default=true;
          $scope.xbmc.disconnect();
          $scope.xbmc.connect(firstHost.ip, firstHost.port);
        }
        storage.setItem('hosts', $scope.hosts);
        $scope.go('/hosts');
      }
    };
  }
]);