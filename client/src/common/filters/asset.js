angular.module('filters.xbmc.asset', [])
    .filter('asset', function () {
        return function (input, host, port) {
            if (input && host) {
                port = port || 8080;
                return 'http://' + host + ':' + port + '/image/' + encodeURIComponent(input);
            } else {
                return '/img/blank.gif';
            }
        };
    });