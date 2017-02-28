'use strict';

// Declare app level module which depends on views, and components
angular.module('rocketvoip', [
    'ngRoute',
    'ngMaterial',
    'rocketvoip.dashboard',
    'rocketvoip.view2',
    'rocketvoip.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/dashboard'});
}]);
