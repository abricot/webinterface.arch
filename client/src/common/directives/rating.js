"use strict";
angular.module('directives.rating', [])
    .directive('rating', function () {
        return {
            restrict: 'A',
            template: '<div class="rating">' +
                '<i ng-repeat="star in stars" ng-class="star"></i>' +
                '</div>',
            scope: {
                ratingValue: '=',
                ratingMax: '='
            },
            link: function (scope, elem, attrs) {
                var updateStars = function () {
                    scope.stars = [];
                    for (var i = 1; i <= scope.ratingMax; i++) {
                        if (i < scope.ratingValue) {
                            scope.stars.push({'icon-star': true});
                        } else if (Math.round(scope.ratingValue) === i) {
                            scope.stars.push({'icon-star-half-empty': true});
                        } else {
                            scope.stars.push({'icon-star-empty': true});
                        }
                    }
                };

                scope.$watch('ratingValue', function (newVal, oldVal) {
                    if (newVal) {
                        updateStars();
                    }
                });
            }
        }
    });