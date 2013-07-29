angular.module('app')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('music', {
            url: '/musics',
            views: {
                header: {templateUrl: 'layout/headers/basic.tpl.html'},
                body: {
                    templateUrl: 'music/musics.tpl.html'
                }
            }
        })
    }])