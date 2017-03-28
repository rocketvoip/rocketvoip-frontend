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

    .controller('ViewLoginCtrl', ['$scope', '$location', 'AuthenticationService', 'UtilityService',
        function ($scope, $location, AuthenticationService, UtilityService) {
            var viewLoginCtrl = this;
            this.login = function () {
                if ($scope.viewLoginForm.$valid) {
                    viewLoginCtrl.loading = true;
                    AuthenticationService.Login(viewLoginCtrl.username, viewLoginCtrl.password, function (result) {
                        if (result === true) {
                            $location.path('/');
                        } else {
                            $scope.showToast(result);
                            viewLoginCtrl.loading = false;
                        }
                    });
                }
                else {
                    //TODO: Refactor Global Function!
                    angular.forEach($scope.viewLoginForm.$error, function (field) {
                        angular.forEach(field, function (errorField) {
                            errorField.$setTouched();
                        });
                    });
                }
            };

            $scope.showToast = UtilityService.showToast;

            // reset login status while initializing this controller
            AuthenticationService.Logout();
        }]);