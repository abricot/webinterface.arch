angular.module('filters.xbmc.asset', [])
    .filter('asset', function () {
        return function (input, host) {
            if (input && host) {
                return 'http://' + host.ip + ':'+host.httpPort+'/image/' + encodeURIComponent(input);
            }     else {
                return '';
            }
        };
    });