angular.module('app')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('settings', {
    url: '/settings',
    views: {
      header: {templateUrl: 'modules/common/navigation.tpl.html', controller : 'HeaderNavController'},
      body: {templateUrl: 'modules/settings/wizard.tpl.html', controller: 'WizardCtrl'}
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
      default : false,
      username : 'kodi',
      password : '',
      videoAddon : 'plugin.video.youtube',
      traktPin : ''
    };

    $scope.save = function () {
      if(this.wizard.$valid) {
        $scope.hosts.splice(0,1,$scope.host);
        storage.setItem('hosts', $scope.hosts);
        $scope.initialize($scope.host);
        $scope.go('/');
      }
    };
    $scope.$watch('host.traktPin', function(newVal, oldVal) {
      if(newVal) {
        $scope.oauth.getToken(newVal);
      }
    });

    $scope.$watch('hosts', function(newVal, oldVal) {
      var filterDefault = function(el) {
        return el.default;
      }
      var filtered = $scope.hosts.filter(filterDefault);
      if(filtered.length ===1) {
        var host = filtered[0];
        host.videoAddon = host.videoAddon || 'plugin.video.youtube';
        angular.copy(host, $scope.host);
      }
    });
  }
]);