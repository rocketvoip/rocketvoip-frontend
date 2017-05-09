'use strict';

// Declare app level module which depends on views, and components
angular.module('rocketvoip', [
    'ngRoute',
    'ngMaterial',
    'ngStorage',
    'angular-jwt',
    'rocketvoip.login',
    'rocketvoip.utility_service',
    'rocketvoip.panel_editUser',
    'rocketvoip.view_dashboard',
    'rocketvoip.version',
    'rocketvoip.view_users',
    'rocketvoip.view_login',
    'rocketvoip.view_companies',
    'rocketvoip.view_dialplans',
    'rocketvoip.view_editDialplan',
    'rocketvoip.panel_editAction',
    'rocketvoip.panel_editCompany',
    'rocketvoip.view_admins',
    'rocketvoip.view_header'
]).constant('appConfig', {
    'BACKEND_BASE_URL': 'http://localhost:8080',
    'API_ENDPOINT': '/v1',
    'PASSWORD_LENGTH': 16
}).config(function ($locationProvider, $routeProvider, $httpProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({redirectTo: '/dashboard'});

    $httpProvider.interceptors.push(function ($q, $injector) {
        return {
            responseError: function (rejection) {
                if (rejection.status === 401) {
                    //Inject in the place to avoid circular dependency
                    var AuthenticationService = $injector.get('AuthenticationService');
                    AuthenticationService.Logout();
                }
                return $q.reject(rejection);
            }
        };
    });
}).run(function ($rootScope, $http, $location, $localStorage, jwtHelper, $injector, $timeout) {
    if ($localStorage.currentUser) {

        var token = $localStorage.currentUser.token;
        if (token === 'Test-Token'){
            // For E2E Tests
            $rootScope.isLoggedIn = true;
            $rootScope.isGlobalAdmin = true;
        } else if (jwtHelper.isTokenExpired(token)) {
            //Token is not valid
            var AuthenticationService = $injector.get('AuthenticationService');
            AuthenticationService.Logout();
        } else {
            $rootScope.isLoggedIn = true;
            $rootScope.isGlobalAdmin = false;
            $http.defaults.headers.common['x-auth-token'] = token;
            var expirationTime = jwtHelper.getTokenExpirationDate(token) - new Date();

            //Register timer for token expiration
            $timeout(function () {
                var AuthenticationService = $injector.get('AuthenticationService');
                AuthenticationService.Logout();
            }, expirationTime);
        }
    }
    $rootScope.$on('$locationChangeStart', function () {
        var publicPages = ['/login'];
        var restrictedPage = publicPages.indexOf($location.path()) === -1;
        if (restrictedPage && !$localStorage.currentUser) {
            $location.path('/login');
        }
    });
});