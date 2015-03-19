"use strict";
angular.module('directives.seekbar', [])
.directive('seekbar', function () {
  return {
    restrict: 'E',
    replace : true,
    templateUrl: 'template/seekbar/seekbar.tpl.html',
    scope: {
      seekbarValue: '=',
      seekbarMax: '=',
      onSeekbarChanged: '&'
    },
    link: function (scope, elem, attrs) {
      var seekbarReadOnly = angular.isDefined(attrs.seekbarReadOnly) ? attrs.seekbarReadOnly : false;
      scope.seekbarIsVertical =  false;
      if(angular.isDefined(attrs.seekbarOrientation) && attrs.seekbarOrientation == 'vertical') {
        scope.seekbarIsVertical = true;
      }
      var thumb = elem.find('button');
      var progress = elem.find('progress');
      var body = angular.element(document).find('body');

      var update = function (value) {
        thumb.css('left', value + '%');
        progress.attr('value', Math.round(value));
      };

      if(seekbarReadOnly) {
        thumb.css('display', 'none');
      } else {
        var moving = false;
        var newValue = -1;

        var offset = function (el) {
          return el[0].getBoundingClientRect();
        };

        var toPercentage = function (target, progress) {
          var position =  offset(progress);
          var percent = (target.clientX - position.left) / position.width;
          if(scope.seekbarIsVertical) {
            percent = (position.height - (target.clientY -  position.top))/ position.height;
          }
          return percent;
        };

        progress.bind('click touchstart', function (evt) {
          evt.stopPropagation();
          var target = evt.touches ? evt.touches[0] : evt;
          var percent = toPercentage(target, progress);
          if (percent < 0)
            percent = 0;
          if (percent > 1)
            percent = 1;
          update(scope.seekbarMax * percent);
          scope.onSeekbarChanged({newValue: parseInt(progress.attr('value'))});
        });

        thumb.bind('mousedown touchstart', function (evt) {
          evt.stopPropagation();
          thumb.addClass('active');
          moving = true;
        });

        var onMove = function (evt) {
          evt.stopPropagation();
          if (moving) {
            var target = evt.touches ? evt.touches[0] : evt;
            var percent = toPercentage(target, progress);
            if (percent < 0)
              percent = 0;
            if (percent > 1)
              percent = 1;
            update(scope.seekbarMax * percent);
          }
        };

        thumb.bind('touchmove', onMove);
        body.bind('mousemove', onMove);

        var onMoveEnd = function () {
          if(moving) {
            scope.onSeekbarChanged({newValue: parseInt(progress.attr('value'))});
            moving = false;
            thumb.removeClass('active');
          }
        }
        thumb.bind('touchend', onMoveEnd);
        body.bind('mouseup', onMoveEnd);

        var onMouseWheel = function (event) {
          event = window.event || event;
          var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
          var oldValue = parseInt(progress.attr('value'));
          var newValue = oldValue + delta;
          if (newValue < 0)
            newValue = 0;
          if (newValue > 100)
            newValue = 100;
          scope.onSeekbarChanged({newValue: newValue});
        };

        elem[0].addEventListener('DOMMouseScroll', onMouseWheel, false ); // For FF and Opera
        elem[0].addEventListener('mousewheel', onMouseWheel, false ); // For others
      }

      scope.$watch('seekbarValue', function (newVal, oldVal) {
        if (newVal && !moving) {
          scope.seekbarValue = newVal;
          update(newVal);
        }
      });

      scope.$on('$destroy', function() {
       if(!seekbarReadOnly) {
          elem[0].removeEventListener('DOMMouseScroll', onMouseWheel, false ); // For FF and Opera
          elem[0].removeEventListener('mousewheel', onMouseWheel, false ); // For others
        }
      });
    }
  }
});