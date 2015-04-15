angular.module('app')
.controller('NowPlayingCtrl', ['$scope', '$filter',
  function NowPlayingCtrl($scope, $filter) {
    $scope.showAudioSelect = false;
    $scope.showSubtitleSelect = false;
    $scope.showTimePicker = false;
    $scope.showShutdownOptions = false;
    $scope.showRemote = false;
    $scope.textToSend = '';
    $scope.showKeyboard = false;
    $scope.showShutdownOptions = false;

    $scope.stream = 0;
    $scope.sub = 0;

    $scope.$watch('player.current', function (newVal, oldVal) {
      if($scope.player.current) {
        if( $scope.player.current.audiostream) {
          $scope.stream = $scope.player.current.audiostream.index;
        }
        if($scope.player.current.subtitle) {
          $scope.sub = $scope.player.current.subtitle.index || 'off';
        }
      }
    });

    var timeFilter = $filter('time');
    $scope.seekTime = timeFilter($scope.player.seek.time);

    $scope.execCommand = function(xbmcCommand){
      $scope.toggleShutdownOptions();
      $scope.xbmc[xbmcCommand]();
    };

    $scope.getHashForItem = function () {
      if($scope.player.type === 'video' && $scope.player.item) {
        if( $scope.player.item.tvshowid === -1) {
          return '/movies/'+ $scope.player.item.id;
        } else {
          return '/tvshows/'+ $scope.player.item.tvshowid
        }
      } else if($scope.player.type === 'audio' && $scope.player.item) {
        return '/musics/songs/albumid/'+ $scope.player.item.albumid;
      }
      return '';
    },

    $scope.isTypeVideo = function() {
      return $scope.player.type === 'video' ||
      $scope.player.type === 'movie' ||
      $scope.player.type === 'episode';
    };

    $scope.isSelected = function(current, obj) {
      if (typeof obj === 'string') {
        return obj === current;
      } else {
        return obj.index === current.index;
      }
    };

    $scope.onSeekbarChanged = function(newValue) {
      $scope.updateSeek(newValue);
    };

    var removeTime = function(date) {
      date.setSeconds(0);
      date.setHours(0);
      date.setMinutes(0);
      return date;
    };

    $scope.onValidateSeekTime = function() {
      var startTime = removeTime(new Date()).getTime();
      var totalTime = timeFilter($scope.player.seek.totaltime).getTime();
      var seekTime = $scope.seekTime.getTime();
      var percent = (seekTime - startTime) / (totalTime - startTime) * 100;
      $scope.updateSeek(Math.floor(percent));
      $scope.showTimePicker = false;
    };

    $scope.onValidateAudioStream = function() {
      $scope.showAudioSelect = false;
      $scope.xbmc.setAudioStream($scope.stream);
    };

    $scope.onValidateText = function() {
      $scope.xbmc.sendText($scope.textToSend);
      $scope.showKeyboard = false;
      $scope.textToSend = '';
    };
    

    $scope.onValidateSubtitles = function() {
      $scope.showSubtitleSelect = false;
      $scope.xbmc.setSubtitle($scope.sub);
    };

    $scope.onVolumeChanged = function(newValue) {
      $scope.xbmc.setVolume(newValue);
    }

    $scope.toggleAudioStreams = function() {
      $scope.showAudioSelect = !$scope.showAudioSelect;
    };

     $scope.toggleRemote = function() {
      $scope.showRemote = !$scope.showRemote;
    };

    $scope.toggleSubtitles = function() {
      $scope.showSubtitleSelect = !$scope.showSubtitleSelect;
    };

    $scope.toggleTimePicker = function() {
      $scope.seekTime = timeFilter($scope.player.seek.time);
      $scope.showTimePicker = !$scope.showTimePicker;
    };

    $scope.toggleKeyboard = function() {
      $scope.showKeyboard = !$scope.showKeyboard;
    };

    $scope.toggleShutdownOptions = function() {
      $scope.showShutdownOptions = !$scope.showShutdownOptions;
    };

    $scope.toggleShutdownOptions = function() {
      $scope.showShutdownOptions = !$scope.showShutdownOptions;
    };

    $scope.updateSeek = function(newValue) {
      newValue = Math.min(newValue, 100);
      newValue = Math.max(newValue, 0);
      $scope.xbmc.seek(newValue);
    }
  }
]);