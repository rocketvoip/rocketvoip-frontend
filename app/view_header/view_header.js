'use strict';
/*
 Module for index.html header
 Author: Marco Studerus
 */
angular.module('rocketvoip.view_header', [])
    .controller('HeaderCtrl', function ($scope, $localStorage, AuthenticationService) {
        $scope.logout = AuthenticationService.Logout;
        $scope.localStorage = $localStorage;
    });