'use strict';
/*
 Module panel_edit is a dialog for adding or editing a company
 Author: Martin Wittwer
 */
angular.module('rocketvoip.panel_editCompany', [])
    .controller('PanelCompanyDialogCtrl', ['$scope', 'mdPanelRef', 'company', 'appConfig',
        'CompanyService','UtilityService',
        function ($scope, mdPanelRef, company, appConfig, CompanyService,UtilityService) {
            this.closeDialog = function() {
                mdPanelRef && mdPanelRef.close();
            };

            this.saveCompany = function() {
                if($scope.companyEditForm.$valid) {
                    if($scope.company.id == undefined) {
                        CompanyService.save($scope.company).$promise.then(this.closeDialog);
                    } else {
                        CompanyService.update($scope.company).$promise.then(this.closeDialog);
                    }
                } else {
                    UtilityService.setAllFieldsTouched($scope.companyEditForm);
                }
            };

            this.deleteCompany = function () {
                if ($scope.company.id != null) {
                    CompanyService.delete($scope.company).$promise.then(this.closeDialog);
                }
            };

            $scope.company = angular.copy(company);

            if ($scope.company == null) {
                $scope.isNewCompany = true;
            } else {
                $scope.isNewCompany = false;
                $scope.companyNameCopy = angular.copy(company.name);
            }
        }
    ]);