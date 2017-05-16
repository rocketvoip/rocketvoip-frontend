'use strict';
/*
 Dialog for reseting admin password
 Author: Marco Studerus
 */
angular.module('rocketvoip.dialog_resetPassword', ['ngMessages','ngPassword'])
    .controller('ResetPasswordDialogCtrl',
        function ($scope, $mdDialog, admin, AdminService) {
            $scope.admin = angular.copy(admin);
            $scope.admin.password = "";
            $scope.confirmPassword = "";
            
            $scope.save = function () {
                if ($scope.resetPasswordForm.$valid){
                    AdminService.update($scope.admin);
                    $scope.close();
                }
            };
            $scope.close = function () {
                $mdDialog.cancel();
            };
        });