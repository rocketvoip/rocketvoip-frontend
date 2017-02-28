'use strict';

angular.module('rocketvoip.version', [
  'rocketvoip.version.interpolate-filter',
  'rocketvoip.version.version-directive'
])

.value('version', '0.1');
