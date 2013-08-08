angular.module('filters.xbmc.asset', [])
    .filter('asset', function () {
        return function (input, ip) {
            if (input && ip) {
                return 'http://' + ip + ':8080/image/' + encodeURIComponent(input);
            }     else {
                return '';
            }
        };
    });