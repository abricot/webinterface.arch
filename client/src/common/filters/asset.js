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
      var regExp = new RegExp('image://([^/]*)');
      var matches = input.match(regExp);
      if(matches.length === 2) {
        return 'http://' + securityPrefix + host.ip + ':'+host.httpPort+'/image/image://' + encodeURIComponent(matches[1])+'/';
      }  
    } 
    return '';
  };
});