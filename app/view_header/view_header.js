'use strict';
/*
 Module for index.html header
 Author: Marco Studerus
 */
angular.module('rocketvoip.view_header', [])
    .controller('HeaderCtrl', ['$scope', 'AuthenticationService', function ($scope, AuthenticationService) {
        $scope.logout = AuthenticationService.Logout;
    }]);