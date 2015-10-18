"use strict";
angular.module('directives.noSource', [])
.directive('noSource', function () {
  return {
    restrict: 'E',
    replace : true,
    templateUrl: 'template/nosource/nosource.tpl.html',
    scope: {
      source: '='
    },
    link: function (scope, elem, attrs) {
      scope.getBackgroundImg = function () {
        if(scope.source === 'movies') {
          return '../img/interstellar-blur.jpg';
        } else if (scope.source === 'tvshows') {
          return '../img/twd-blur.jpg';
        } else if (scope.source === 'musics') {
          return '../img/acdc-blur.jpg';
        }
        return '../img/blank.gif';
      };

      scope.getWikiPage = function () {
        if(scope.source === 'movies' || scope.source === 'tvshows') {
          return 'http://kodi.wiki/view/Adding_video_sources';
        } else if (scope.source === 'musics') {
          return 'http://kodi.wiki/view/Adding_music_to_the_library';
        }
        return 'about:blank';
      };

      scope.getIcon = function(){
        if(scope.source === 'movies') {
          return 'adventure';
        } else if (scope.source === 'tvshows') {
          return 'horror';
        } else if (scope.source === 'musics') {
          return 'music';
        }
        return '';
      };

      scope.hasPopular = function () {
        return scope.source === 'movies' || scope.source === 'tvshows';
      };
    }
  };
});