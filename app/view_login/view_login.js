'use strict';
/*
 Module for User Login
 Author: Marco Studerus
 */
angular.module('rocketvoip.view_login', ['ngRoute', 'ngResource'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'view_login/view_login.html',
            controller: 'ViewLoginCtrl'
        });
    }])

    .controller('ViewLoginCtrl', function ($scope, $location, AuthenticationService, UtilityService) {
            var viewLoginCtrl = this;
            this.login = function () {
                if ($scope.viewLoginForm.$valid) {
                    viewLoginCtrl.loading = true;
                    AuthenticationService.Login($scope.username, $scope.password, function (result) {
                        if (result === true) {
                            $location.path('/');
                        } else {
                            $scope.showToast(result);
                            $scope.password = '';
                        }
                    });
                }
                else {
                    UtilityService.setAllFieldsTouched($scope.viewLoginForm);
                }
            };

            $scope.showToast = UtilityService.showToast;
        });