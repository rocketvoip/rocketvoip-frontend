'use strict';
/*
 Dialog for reseting admin password
 Author: Marco Studerus
 */
angular.module('rocketvoip.dialog_resetPassword', ['ngMessages','ngPassword'])
    .controller('ResetPasswordDialogCtrl',
        function ($scope, $mdDialog, admin, AdminPasswordService) {
            $scope.admin = angular.copy(admin);
            $scope.admin.password = "";
            $scope.confirmPassword = "";
            
            $scope.save = function () {
                if ($scope.resetPasswordForm.$valid){
                    AdminPasswordService.update($scope.admin);
                    $scope.close();
                }
            };
            $scope.close = function () {
                $mdDialog.cancel();
            };
        }).factory('AdminPasswordService', ['$resource', 'appConfig', function ($resource, appConfig) {
    return $resource(appConfig.BACKEND_BASE_URL + appConfig.API_ENDPOINT + '/admins/:id/password', {id: "@id"}, {
        update: {
            method: 'PUT'
        }
    });
}]);