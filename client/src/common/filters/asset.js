angular.module('filters.xbmc.asset', [])
    .filter('asset', function () {
        return function (input, ip) {
            if (input && conf) {
                return 'http://' + ip + ':8080/image/' + encodeURIComponent(input);
            }     else {
                return '';
            }
        };
    });