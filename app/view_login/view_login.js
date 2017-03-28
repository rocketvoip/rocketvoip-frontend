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

    .controller('ViewLoginCtrl', ['$scope', '$location', 'AuthenticationService', '$mdToast',
        function ($scope, $location, AuthenticationService, $mdToast) {
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

            //TODO: Define Global!
            $scope.showToast = function (message) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(message)
                        .hideDelay(3000)
                );
            };

            // reset login status while initializing this controller
            AuthenticationService.Logout();
        }]);