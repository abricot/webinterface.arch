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
    $scope.authentication = null;
    $scope.pin = null;
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
    $scope.autoScrobble = true;
    var setAutoScrobble = function(data) {
      $scope.autoScrobble = data
    };
    var setToken = function(data){
      if(data) {
        $scope.authentication = data;
      }
    };

    $scope.save = function () {
      if(this.wizard.$valid) {
        $scope.hosts.splice(0,1,$scope.host);
        storage.setItem('hosts', $scope.hosts);
        $scope.initialize($scope.host);
        $scope.go('/');
        $scope.trakt.autoScrobble($scope.autoScrobble);
      }
    };

    $scope.refreshToken = function() {
      $scope.trakt.getToken($scope.authentication.refresh_token, 'refresh_token').then(setToken);
    }

    $scope.$watch('pin', function(newVal, oldVal) {
      if(newVal) {
        $scope.trakt.getToken(newVal).then(setToken);
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

    storage.getItem('trakt-authentication').then(setToken);
    storage.getItem('trakt-autoscrobble').then(setAutoScrobble);
  }
]);