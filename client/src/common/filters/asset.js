angular.module('filters.xbmc.asset', [])
.filter('asset', function () {
  return function (input, host) {
    if (input && host) {
      var securityPrefix = '';
      var asChromeApp = false;
      if(window.chrome && window.chrome.storage) {
        asChromeApp = true;
      }
      if(!asChromeApp && host.username !== '' && host.password !== '') {
       securityPrefix = host.username + ':' + host.password + '@';
      }
      return 'http://' + securityPrefix + host.ip + ':'+host.httpPort+'/image/' + encodeURIComponent(input);
    } else {
      return '';
    }
  };
});