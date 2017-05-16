'use strict';
/*
 Module panel_editAdmin is a dialog for adding oder editing an Admin
 Author: Marco Studerus
 */
angular.module('rocketvoip.panel_editAdmin', ['ngMessages'])
    .controller('PanelEditAdminDialogCtrl',
        function ($scope, mdPanelRef, admin, CompanyService, AdminService, UtilityService) {
            var controller = this;
            controller.isNewAdmin = function () {
                if (admin == undefined) {
                    return true;
                }
                return false;
            };

            controller.initializeNewAdmin = function () {
                $scope.admin = {
                    userName: undefined,
                    password: undefined,
                    firstName: undefined,
                    lastName: undefined,
                    companyDtoList: []
                }
            };

            controller.initialize = function () {
                $scope.isNewAdmin = controller.isNewAdmin();
                if ($scope.isNewAdmin) {
                    controller.initializeNewAdmin();
                } else {
                    $scope.nameCopy = admin.firstName + ' ' + admin.lastName;
                    $scope.admin = admin;
                }
                $scope.companies = CompanyService.query();
            };

            $scope.delete = function () {
                AdminService.delete($scope.admin).$promise.then(this.close);
            };

            $scope.save = function () {
                if ($scope.adminEditForm.$valid && $scope.admin.companyDtoList.length > 0) {
                    if ($scope.admin.id == undefined) {
                        AdminService.save($scope.admin).$promise.then(this.close);
                    } else {
                        AdminService.update($scope.admin).$promise.then(this.close);
                    }
                } else {
                    UtilityService.setAllFieldsTouched($scope.adminEditForm);
                }
            };

            $scope.close = function () {
                mdPanelRef && mdPanelRef.close();
            };

            controller.initialize();
        });