'use strict';

angular.module('rocketvoip.version.version-directive', [])

.directive('appVersion', ['version', function(version) {
  return function(scope, elm) {
    elm.text(version);
  };
}]);
