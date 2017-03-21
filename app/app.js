'use strict';

// Declare app level module which depends on views, and components
angular.module('rocketvoip', [
    'ngRoute',
    'ngMaterial',
    'rocketvoip.panel_editUser',
    'rocketvoip.view_dashboard',
    'rocketvoip.version',
    'rocketvoip.view_users'
]).constant('appConfig',  {
    'BACKEND_BASE_URL' : 'https://rocketvoip.herokuapp.com',
    'API_ENDPOINT': '/v1',
    'PASSWORD_LENGTH': 16
})
    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({redirectTo: '/dashboard'});
    }]);

