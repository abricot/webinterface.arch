angular.module('app')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('playing', {
            url: '/now/playing',
            views: {
                header: {templateUrl: 'layout/headers/basic.tpl.html'},
                body: {
                    templateUrl: 'now/playing.tpl.html',
                    controller: 'NowPlayingCtrl'
                },
                footer: {templateUrl: 'layout/footers/player.tpl.html', controller: 'FooterCtrl'}
            }
        });
    }])
    .controller('NowPlayingCtrl', ['$scope',
        function NowPlayingCtrl($scope) {
            $scope.loading = true;
            $scope.showAudioSelect = false;
            $scope.showSubtitleSelect = false;
            var onLoad = function () {
                $scope.xbmc.send('Player.GetActivePlayers', null, true, 'result').then(function (players) {
                        if (players.length > 0) {
                            $scope.library.item = $scope.xbmc.send('Player.GetItem', {
                                'properties': ['title', 'artist', 'albumartist', 'genre',
                                    'year', 'rating', 'album', 'track', 'duration', 'comment', 'lyrics',
                                    'musicbrainztrackid', 'musicbrainzartistid', 'musicbrainzalbumid',
                                    'musicbrainzalbumartistid', 'playcount', 'fanart', 'director', 'trailer',
                                    'tagline', 'plot', 'plotoutline', 'originaltitle', 'lastplayed', 'writer',
                                    'studio', 'mpaa', 'cast', 'country', 'imdbnumber', 'premiered', 'productioncode',
                                    'runtime', 'set', 'showlink', 'streamdetails', 'top250', 'votes', 'firstaired',
                                    'season', 'episode', 'showtitle', 'thumbnail', 'file', 'resume', 'artistid',
                                    'albumid', 'tvshowid', 'setid', 'watchedepisodes', 'disc', 'tag', 'art', 'genreid',
                                    'displayartist', 'albumartistid', 'description', 'theme', 'mood', 'style',
                                    'albumlabel', 'sorttitle', 'episodeguide', 'uniqueid', 'dateadded', 'channel',
                                    'channeltype', 'hidden', 'locked', 'channelnumber', 'starttime', 'endtime'],
                                'playerid': players[0].playerid
                            }, true, 'result.item').then(function (item) {
                                    $scope.loading = false;
                                    return item;
                                });

                        } else {
                            $scope.go('/');
                        }
                    }
                )
            }.bind(this);
            if ($scope.xbmc.isConnected()) {
                onLoad();
            } else {
                $scope.xbmc.register('Websocket.OnConnected', onLoad);
            }

            $scope.isTypeVideo = function () {
                return $scope.player.type === 'video' ||
                    $scope.player.type === 'movie' ||
                    $scope.player.type === 'episode';
            };

            $scope.isSelected = function (current, obj) {
                if (typeof obj === 'string') {
                    return obj === current;
                } else {
                    return obj.index === current.index;
                }
            };

            $scope.onSeekbarChanged = function (newValue) {
                $scope.xbmc.send('Player.Seek', {
                    'playerid': $scope.player.id,
                    'value': newValue});
            };

            $scope.select = function (type, obj) {
                var params = {
                    'playerid': $scope.player.id};
                var method = '';
                if (type === 'audio') {
                    method = 'Player.SetAudioStream';
                    params.stream = typeof obj === 'string' ? obj : obj.index;
                    $scope.showAudioSelect = false;
                    $scope.player.current.audiostream = obj;
                } else if (type === 'subtitle') {
                    method = 'Player.SetSubtitle';
                    params.subtitle = typeof obj === 'string' ? obj : obj.index;
                    params.enable = true;
                    $scope.showSubtitleSelect = false;
                    $scope.player.current.subtitle = obj;
                }
                $scope.xbmc.send(method, params);
            };

            $scope.toggleAudioStreams = function () {
                $scope.showAudioSelect = !$scope.showAudioSelect;
            };

            $scope.toggleSubtitles = function () {
                $scope.showSubtitleSelect = !$scope.showSubtitleSelect;
            };


            $scope.$watch('player.item', function () {
                $scope.library.item = $scope.player.item;
            }, true);

        }
    ])
